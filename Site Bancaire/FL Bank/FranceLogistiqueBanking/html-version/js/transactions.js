// Gestion des transactions

// Fonction pour formater le montant
function formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
    }).format(amount);
}

// Fonction pour formater la date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Charger les données
function loadTransactionData() {
    // Mettre à jour le solde du compte FL
    const account = AppData.getFLAccount();
    document.getElementById('flAccountBalance').textContent = formatAmount(account.balance);

    // Charger la liste des employés
    const employees = AppData.getEmployees();
    populateEmployeeSelects(employees);

    // Charger les transactions
    renderTransactions();
}

// Remplir les selects d'employés
function populateEmployeeSelects(employees) {
    const salarySelect = document.getElementById('salaryEmployee');
    const transferFromSelect = document.getElementById('transferFrom');
    const transferToSelect = document.getElementById('transferTo');

    [salarySelect, transferFromSelect, transferToSelect].forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Sélectionnez un employé</option>';
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.firstName} ${employee.lastName} (${employee.id})`;
            select.appendChild(option);
        });
    });
}

// Afficher les transactions
function renderTransactions() {
    const account = AppData.getFLAccount();
    const employees = AppData.getEmployees();
    const currentTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'all';
    const searchTerm = document.getElementById('transactionSearch')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('transactionFilter')?.value || 'all';

    let transactions = account.transactions || [];

    // Filtrer par type
    if (currentTab === 'salaries') {
        transactions = transactions.filter(t => t.type === 'debit' && t.employeeId);
    } else if (currentTab === 'transfers') {
        transactions = transactions.filter(t => t.type === 'transfer');
    } else if (currentTab === 'deposits') {
        transactions = transactions.filter(t => t.type === 'credit');
    }

    // Filtrer par date
    const now = new Date();
    if (filterValue === 'today') {
        transactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.toDateString() === now.toDateString();
        });
    } else if (filterValue === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        transactions = transactions.filter(t => new Date(t.date) >= weekAgo);
    } else if (filterValue === 'month') {
        transactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
    } else if (filterValue === 'year') {
        transactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getFullYear() === now.getFullYear();
        });
    }

    // Filtrer par recherche
    if (searchTerm) {
        transactions = transactions.filter(t => {
            const employee = employees.find(e => e.id === t.employeeId);
            const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
            return employeeName.toLowerCase().includes(searchTerm) ||
                   t.description?.toLowerCase().includes(searchTerm) ||
                   formatAmount(t.amount).toLowerCase().includes(searchTerm);
        });
    }

    // Trier par date (plus récent en premier)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;

    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucune transaction trouvée</td></tr>';
        return;
    }

    tbody.innerHTML = transactions.map(transaction => {
        const employee = employees.find(e => e.id === transaction.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : transaction.employeeName || '-';
        
        let typeIcon = 'ri-exchange-line';
        let typeLabel = 'Transaction';
        let typeClass = '';
        let typeColor = '';
        let typeBg = '';

        if (transaction.type === 'debit' && transaction.employeeId) {
            typeIcon = 'ri-money-euro-circle-line';
            typeLabel = 'Salaire';
            typeClass = 'salary';
            typeColor = '#4CAF50';
            typeBg = 'rgba(76, 175, 80, 0.15)';
        } else if (transaction.type === 'transfer') {
            typeIcon = 'ri-exchange-line';
            typeLabel = 'Transfert';
            typeClass = 'transfer';
            typeColor = '#2196F3';
            typeBg = 'rgba(33, 150, 243, 0.15)';
        } else if (transaction.type === 'credit') {
            typeIcon = 'ri-arrow-down-circle-line';
            typeLabel = 'Dépôt';
            typeClass = 'deposit';
            typeColor = '#9C27B0';
            typeBg = 'rgba(156, 39, 176, 0.15)';
        } else if (transaction.type === 'debit') {
            typeIcon = 'ri-arrow-up-circle-line';
            typeLabel = 'Débit';
            typeClass = 'debit';
            typeColor = '#FF9800';
            typeBg = 'rgba(255, 152, 0, 0.15)';
        }

        const amountClass = transaction.type === 'credit' ? 'positive' : 'negative';
        const amountPrefix = transaction.type === 'credit' ? '+' : '-';

        return `
            <tr class="transaction-row ${typeClass}">
                <td>${formatDate(transaction.date)}</td>
                <td>
                    <span class="transaction-type ${typeClass}" style="background: ${typeBg}; color: ${typeColor}; border-left: 4px solid ${typeColor};">
                        <i class="${typeIcon}"></i> ${typeLabel}
                    </span>
                </td>
                <td><strong>${employeeName}</strong></td>
                <td>${transaction.description || '-'}</td>
                <td class="amount ${amountClass}" style="font-weight: 700; font-size: 1.1em;">
                    ${amountPrefix}${formatAmount(Math.abs(transaction.amount))}
                </td>
                <td><span class="status success">Effectué</span></td>
                <td>
                    <button class="btn-icon" title="Voir détails" onclick="viewTransaction('${transaction.id}')">
                        <i class="ri-eye-line"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Gestion des onglets
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTransactions();
    });
});

// Recherche et filtres
const searchInput = document.getElementById('transactionSearch');
const filterSelect = document.getElementById('transactionFilter');

if (searchInput) {
    searchInput.addEventListener('input', renderTransactions);
}
if (filterSelect) {
    filterSelect.addEventListener('change', renderTransactions);
}

// Sélecteur de type de transaction
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const type = btn.dataset.type;
        document.querySelectorAll('.transaction-form').forEach(form => {
            form.classList.remove('active');
        });
        
        if (type === 'salary') {
            document.getElementById('salaryPaymentForm').classList.add('active');
        } else if (type === 'transfer') {
            document.getElementById('transferForm').classList.add('active');
        }
    });
});

// Gestion du formulaire de paiement de salaire
const salaryForm = document.getElementById('salaryPaymentForm');
if (salaryForm) {
    salaryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const employeeId = document.getElementById('salaryEmployee').value;
        const amount = document.getElementById('salaryAmount').value;
        const period = document.getElementById('salaryPeriod').value;
        const description = document.getElementById('salaryDescription').value || 'Salaire du mois';

        if (!employeeId || !amount || !period) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const account = AppData.getFLAccount();
        if (parseFloat(amount) > account.balance) {
            alert('Solde insuffisant sur le compte France Logistique.');
            return;
        }

        try {
            const success = AppData.paySalary(employeeId, amount, description, period);
            if (success) {
                alert('Paiement effectué avec succès !');
                closeTransactionModal();
                loadTransactionData();
            } else {
                alert('Erreur lors du paiement.');
            }
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });
}

// Gestion du formulaire de transfert
const transferForm = document.getElementById('transferForm');
if (transferForm) {
    transferForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fromId = document.getElementById('transferFrom').value;
        const toId = document.getElementById('transferTo').value;
        const amount = document.getElementById('transferAmount').value;
        const description = document.getElementById('transferDescription').value || 'Transfert entre employés';

        if (!fromId || !toId || !amount) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (fromId === toId) {
            alert('Vous ne pouvez pas transférer vers le même compte.');
            return;
        }

        const fromEmployee = AppData.getEmployeeById(fromId);
        if (parseFloat(amount) > parseFloat(fromEmployee.balance)) {
            alert('Solde insuffisant sur le compte de l\'expéditeur.');
            return;
        }

        try {
            // Débiter l'expéditeur
            AppData.updateEmployeeBalance(fromId, -parseFloat(amount));
            
            // Créditer le destinataire
            AppData.updateEmployeeBalance(toId, parseFloat(amount));

            // Enregistrer la transaction
            const account = AppData.getFLAccount();
            const transaction = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                amount: parseFloat(amount),
                type: 'transfer',
                description: description,
                fromEmployeeId: fromId,
                fromEmployeeName: `${fromEmployee.firstName} ${fromEmployee.lastName}`,
                toEmployeeId: toId,
                toEmployee: AppData.getEmployeeById(toId)
            };
            account.transactions.push(transaction);
            localStorage.setItem('fl_account', JSON.stringify(account));

            alert('Transfert effectué avec succès !');
            closeTransactionModal();
            loadTransactionData();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });
}

// Gestion du formulaire d'ajout de fonds
const addFundsForm = document.getElementById('addFundsForm');
if (addFundsForm) {
    addFundsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = document.getElementById('fundsAmount').value;
        const description = document.getElementById('fundsDescription').value || 'Ajout de fonds';

        if (!amount || parseFloat(amount) <= 0) {
            alert('Veuillez entrer un montant valide.');
            return;
        }

        try {
            AppData.addToFLAccount(amount, description);
            alert('Fonds ajoutés avec succès !');
            closeAddFundsModal();
            loadTransactionData();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });
}

// Fermer les modals
function closeTransactionModal() {
    const modal = document.getElementById('newTransactionModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.getElementById('salaryPaymentForm').reset();
    document.getElementById('transferForm').reset();
}

function closeAddFundsModal() {
    const modal = document.getElementById('addFundsModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.getElementById('addFundsForm').reset();
}

function showAddFundsModal() {
    const modal = document.getElementById('addFundsModal');
    modal.style.display = 'block';
    modal.classList.add('active');
}

// Ouvrir le modal de transaction
const newTransactionBtn = document.getElementById('newTransactionBtn');
if (newTransactionBtn) {
    newTransactionBtn.addEventListener('click', () => {
        const modal = document.getElementById('newTransactionModal');
        modal.style.display = 'block';
        modal.classList.add('active');
        const now = new Date();
        document.getElementById('salaryPeriod').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
}

const addFundsBtn = document.getElementById('addFundsBtn');
if (addFundsBtn) {
    addFundsBtn.addEventListener('click', showAddFundsModal);
}

// Fermer les modals en cliquant en dehors
window.addEventListener('click', (e) => {
    if (e.target.id === 'newTransactionModal') {
        closeTransactionModal();
    }
    if (e.target.id === 'addFundsModal') {
        closeAddFundsModal();
    }
});

// Fonction pour voir une transaction
function viewTransaction(transactionId) {
    const account = AppData.getFLAccount();
    const transaction = account.transactions.find(t => t.id === transactionId);
    const employees = AppData.getEmployees();
    
    if (transaction) {
        const employee = employees.find(e => e.id === transaction.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : transaction.employeeName || '-';
        
        let details = `Détails de la transaction:\n\n` +
                      `Date: ${formatDate(transaction.date)}\n` +
                      `Type: ${transaction.type === 'debit' ? 'Débit' : transaction.type === 'credit' ? 'Crédit' : 'Transfert'}\n` +
                      `Montant: ${formatAmount(transaction.amount)}\n` +
                      `Description: ${transaction.description}\n`;
        
        if (transaction.employeeId) {
            details += `Employé: ${employeeName}\n`;
        }
        
        if (transaction.type === 'transfer') {
            const fromEmployee = employees.find(e => e.id === transaction.fromEmployeeId);
            const toEmployee = employees.find(e => e.id === transaction.toEmployeeId);
            details += `De: ${fromEmployee ? `${fromEmployee.firstName} ${fromEmployee.lastName}` : '-'}\n`;
            details += `Vers: ${toEmployee ? `${toEmployee.firstName} ${toEmployee.lastName}` : '-'}\n`;
        }
        
        alert(details);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadTransactionData();
});

