// Gestion des rapports

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
        year: 'numeric'
    });
}

// Obtenir le trimestre d'une date
function getQuarter(date) {
    const month = date.getMonth();
    return Math.floor(month / 3) + 1;
}

// Obtenir les dates du trimestre
function getQuarterDates(quarter, year) {
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    return {
        start: new Date(year, startMonth, 1),
        end: new Date(year, endMonth + 1, 0, 23, 59, 59)
    };
}

// Calculer les statistiques
function calculateStatistics() {
    const account = AppData.getFLAccount();
    const employees = AppData.getEmployees();
    const payslips = AppData.getPayslips();
    const transactions = account.transactions || [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentQuarter = getQuarter(now);
    const previousQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
    const previousQuarterYear = currentQuarter === 1 ? currentYear - 1 : currentYear;

    // Dates des trimestres
    const currentQuarterDates = getQuarterDates(currentQuarter, currentYear);
    const previousQuarterDates = getQuarterDates(previousQuarter, previousQuarterYear);

    // Filtrer les transactions par trimestre
    const currentQuarterTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= currentQuarterDates.start && date <= currentQuarterDates.end;
    });

    const previousQuarterTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= previousQuarterDates.start && date <= previousQuarterDates.end;
    });

    // Calculer les dépenses (débits)
    const currentQuarterExpenses = currentQuarterTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const previousQuarterExpenses = previousQuarterTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculer les salaires
    const currentQuarterSalaries = currentQuarterTransactions
        .filter(t => t.type === 'debit' && t.employeeId)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const previousQuarterSalaries = previousQuarterTransactions
        .filter(t => t.type === 'debit' && t.employeeId)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculer les variations
    const expensesVariation = previousQuarterExpenses > 0 
        ? ((currentQuarterExpenses - previousQuarterExpenses) / previousQuarterExpenses * 100).toFixed(1)
        : 0;

    const salariesVariation = previousQuarterSalaries > 0
        ? ((currentQuarterSalaries - previousQuarterSalaries) / previousQuarterSalaries * 100).toFixed(1)
        : 0;

    // Statistiques des employés
    const drivers = employees.filter(e => e.role === 'chauffeur').length;
    const admin = employees.filter(e => e.role !== 'chauffeur').length;

    return {
        currentQuarterExpenses,
        previousQuarterExpenses,
        expensesVariation,
        currentQuarterSalaries,
        previousQuarterSalaries,
        salariesVariation,
        totalEmployees: employees.length,
        drivers,
        admin,
        employees,
        payslips,
        transactions: currentQuarterTransactions
    };
}

// Afficher les statistiques
function renderStatistics() {
    const stats = calculateStatistics();

    // Mettre à jour les cartes de résumé
    document.getElementById('totalExpenses').textContent = formatAmount(stats.currentQuarterExpenses);
    document.getElementById('currentQuarterExpenses').textContent = formatAmount(stats.currentQuarterExpenses);
    document.getElementById('previousQuarterExpenses').textContent = formatAmount(stats.previousQuarterExpenses);
    
    const expensesVar = document.getElementById('expensesVariation');
    expensesVar.textContent = `${stats.expensesVariation > 0 ? '+' : ''}${stats.expensesVariation}%`;
    expensesVar.className = `variation ${stats.expensesVariation >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('totalSalaries').textContent = formatAmount(stats.currentQuarterSalaries);
    document.getElementById('currentQuarterSalaries').textContent = formatAmount(stats.currentQuarterSalaries);
    document.getElementById('previousQuarterSalaries').textContent = formatAmount(stats.previousQuarterSalaries);
    
    const salariesVar = document.getElementById('salariesVariation');
    salariesVar.textContent = `${stats.salariesVariation > 0 ? '+' : ''}${stats.salariesVariation}%`;
    salariesVar.className = `variation ${stats.salariesVariation >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('totalEmployees').textContent = stats.totalEmployees;
    document.getElementById('totalDrivers').textContent = stats.drivers;
    document.getElementById('totalAdmin').textContent = stats.admin;
    document.getElementById('totalStaff').textContent = stats.totalEmployees;

    // Remplir les tableaux
    renderOverviewTable(stats);
    renderSalariesTable(stats);
    renderEmployeesTable(stats);
    renderTransactionsTable(stats);
}

// Afficher le tableau Vue d'ensemble
function renderOverviewTable(stats) {
    const tbody = document.getElementById('overviewTableBody');
    if (!tbody) return;

    const totalExpenses = stats.currentQuarterExpenses;
    const totalSalaries = stats.currentQuarterSalaries;
    const otherExpenses = totalExpenses - totalSalaries;

    tbody.innerHTML = `
        <tr>
            <td><strong>Salaires</strong></td>
            <td>${formatAmount(stats.currentQuarterSalaries)}</td>
            <td>${formatAmount(stats.previousQuarterSalaries)}</td>
            <td class="${stats.salariesVariation >= 0 ? 'positive' : 'negative'}">
                ${stats.salariesVariation > 0 ? '+' : ''}${stats.salariesVariation}%
            </td>
        </tr>
        <tr>
            <td><strong>Autres dépenses</strong></td>
            <td>${formatAmount(otherExpenses)}</td>
            <td>${formatAmount(stats.previousQuarterExpenses - stats.previousQuarterSalaries)}</td>
            <td>-</td>
        </tr>
        <tr>
            <td><strong>Total dépenses</strong></td>
            <td><strong>${formatAmount(totalExpenses)}</strong></td>
            <td><strong>${formatAmount(stats.previousQuarterExpenses)}</strong></td>
            <td class="${stats.expensesVariation >= 0 ? 'positive' : 'negative'}">
                <strong>${stats.expensesVariation > 0 ? '+' : ''}${stats.expensesVariation}%</strong>
            </td>
        </tr>
    `;
}

// Afficher le tableau des salaires
function renderSalariesTable(stats) {
    const tbody = document.getElementById('salariesTableBody');
    if (!tbody) return;

    if (stats.payslips.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucune fiche de paie disponible</td></tr>';
        return;
    }

    // Trier par date (plus récent en premier)
    const sortedPayslips = [...stats.payslips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = sortedPayslips.slice(0, 20).map(payslip => {
        const employee = stats.employees.find(e => e.id === payslip.employeeId);
        const periodDate = new Date(payslip.period + '-01');
        const periodLabel = periodDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        return `
            <tr>
                <td>${payslip.employeeName}</td>
                <td>${employee ? getRoleLabel(employee.role) : '-'}</td>
                <td>${periodLabel}</td>
                <td>${formatAmount(payslip.grossSalary)}</td>
                <td><strong>${formatAmount(payslip.netSalary)}</strong></td>
            </tr>
        `;
    }).join('');
}

// Afficher le tableau par employé
function renderEmployeesTable(stats) {
    const tbody = document.getElementById('employeesTableBody');
    if (!tbody) return;

    if (stats.employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun employé</td></tr>';
        return;
    }

    tbody.innerHTML = stats.employees.map(employee => {
        const employeePayslips = stats.payslips.filter(p => p.employeeId === employee.id);
        const totalReceived = employeePayslips.reduce((sum, p) => sum + parseFloat(p.netSalary), 0);

        return `
            <tr>
                <td><strong>${employee.firstName} ${employee.lastName}</strong></td>
                <td>${getRoleLabel(employee.role)}</td>
                <td>${formatAmount(employee.balance)}</td>
                <td>${formatAmount(totalReceived)}</td>
                <td>${employeePayslips.length}</td>
            </tr>
        `;
    }).join('');
}

// Afficher le tableau des transactions
function renderTransactionsTable(stats) {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;

    if (stats.transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Aucune transaction ce trimestre</td></tr>';
        return;
    }

    // Trier par date (plus récent en premier)
    const sortedTransactions = [...stats.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sortedTransactions.slice(0, 30).map(transaction => {
        let typeLabel = 'Transaction';
        if (transaction.type === 'debit' && transaction.employeeId) {
            typeLabel = 'Salaire';
        } else if (transaction.type === 'transfer') {
            typeLabel = 'Transfert';
        } else if (transaction.type === 'credit') {
            typeLabel = 'Dépôt';
        }

        return `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td>${typeLabel}</td>
                <td class="${transaction.type === 'credit' ? 'positive' : 'negative'}">
                    ${transaction.type === 'credit' ? '+' : '-'}${formatAmount(Math.abs(transaction.amount))}
                </td>
                <td>${transaction.description || '-'}</td>
            </tr>
        `;
    }).join('');
}

// Obtenir le label du rôle
function getRoleLabel(roleValue) {
    const roles = AppData.getRoles();
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
}

// Gestion des onglets
document.querySelectorAll('.report-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Désactiver tous les onglets
        document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.report-tab-content').forEach(c => c.classList.remove('active'));
        
        // Activer l'onglet sélectionné
        tab.classList.add('active');
        document.getElementById(tabName + 'Tab').classList.add('active');
    });
});

// Gestion de la période
document.querySelectorAll('.report-period .btn-outline').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.report-period .btn-outline').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderStatistics();
    });
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderStatistics();
});

