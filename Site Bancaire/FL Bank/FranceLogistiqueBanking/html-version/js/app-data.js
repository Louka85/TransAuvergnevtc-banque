// Système de gestion des données FL Banking
// Utilise localStorage pour persister les données

const AppData = {
    // Initialisation des données
    init() {
        if (!localStorage.getItem('fl_employees')) {
            localStorage.setItem('fl_employees', JSON.stringify([]));
        }
        if (!localStorage.getItem('fl_account')) {
            // Compte France Logistique initialisé avec 10 millions
            localStorage.setItem('fl_account', JSON.stringify({
                balance: 10000000.00,
                transactions: []
            }));
        }
        if (!localStorage.getItem('fl_payslips')) {
            localStorage.setItem('fl_payslips', JSON.stringify([]));
        }
        if (!localStorage.getItem('fl_current_user')) {
            // Utilisateur par défaut (Admin)
            localStorage.setItem('fl_current_user', JSON.stringify({
                id: 'ADMIN001',
                firstName: 'Admin',
                lastName: 'System',
                role: 'directeur_general',
                email: 'admin@francelogistique.fr'
            }));
        }
    },

    // Gestion des employés
    getEmployees() {
        return JSON.parse(localStorage.getItem('fl_employees') || '[]');
    },

    addEmployee(employeeData) {
        const employees = this.getEmployees();
        const newId = this.generateEmployeeId();
        
        const newEmployee = {
            id: newId,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            birthDate: employeeData.birthDate,
            hireDate: employeeData.hireDate,
            role: employeeData.role,
            email: employeeData.email || `${employeeData.firstName.toLowerCase()}.${employeeData.lastName.toLowerCase()}@francelogistique.fr`,
            balance: parseFloat(employeeData.initialBalance) || 0.00,
            createdAt: new Date().toISOString()
        };

        employees.push(newEmployee);
        localStorage.setItem('fl_employees', JSON.stringify(employees));
        
        // Créer automatiquement un compte utilisateur avec un mot de passe par défaut
        if (typeof AuthSystem !== 'undefined') {
            try {
                const defaultPassword = 'FL' + newId.substring(2); // Ex: FL001 -> FL001
                AuthSystem.createUser({
                    employeeId: newId,
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    role: employeeData.role,
                    email: newEmployee.email
                }, defaultPassword);
            } catch (error) {
                console.error('Erreur lors de la création du compte utilisateur:', error);
            }
        }
        
        return newEmployee;
    },

    getEmployeeById(id) {
        const employees = this.getEmployees();
        return employees.find(emp => emp.id === id);
    },

    updateEmployee(id, updates) {
        const employees = this.getEmployees();
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
            // Mettre à jour les champs autorisés
            if (updates.firstName) employee.firstName = updates.firstName;
            if (updates.lastName) employee.lastName = updates.lastName;
            if (updates.email) employee.email = updates.email;
            if (updates.role) employee.role = updates.role;
            if (updates.birthDate) employee.birthDate = updates.birthDate;
            if (updates.hireDate) employee.hireDate = updates.hireDate;
            localStorage.setItem('fl_employees', JSON.stringify(employees));
            return employee;
        }
        return null;
    },

    updateEmployeeBalance(id, amount) {
        const employees = this.getEmployees();
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
            employee.balance = parseFloat(employee.balance) + parseFloat(amount);
            localStorage.setItem('fl_employees', JSON.stringify(employees));
        }
    },

    generateEmployeeId() {
        const employees = this.getEmployees();
        const nextNumber = employees.length + 1;
        return `FL${String(nextNumber).padStart(3, '0')}`;
    },

    // Gestion du compte France Logistique
    getFLAccount() {
        return JSON.parse(localStorage.getItem('fl_account') || '{"balance": 10000000.00, "transactions": []}');
    },

    updateFLAccount(amount, description, employeeId, employeeName) {
        const account = this.getFLAccount();
        account.balance = parseFloat(account.balance) - parseFloat(amount);
        localStorage.setItem('fl_account', JSON.stringify(account));
        return { amount: amount, description: description };
    },

    addToFLAccount(amount, description) {
        const account = this.getFLAccount();
        account.balance = parseFloat(account.balance) + parseFloat(amount);
        localStorage.setItem('fl_account', JSON.stringify(account));
        return { amount: amount, description: description };
    },

    resetAllData() {
        // Réinitialiser tous les comptes
        localStorage.setItem('fl_employees', JSON.stringify([]));
        localStorage.setItem('fl_account', JSON.stringify({
            balance: 10000000.00,
            transactions: []
        }));
        localStorage.setItem('fl_payslips', JSON.stringify([]));
    },

    // Gestion des fiches de paie
    getPayslips() {
        return JSON.parse(localStorage.getItem('fl_payslips') || '[]');
    },

    addPayslip(payslipData) {
        const payslips = this.getPayslips();
        const employee = this.getEmployeeById(payslipData.employeeId);
        
        const payslip = {
            id: Date.now().toString(),
            employeeId: payslipData.employeeId,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            period: payslipData.period,
            grossSalary: parseFloat(payslipData.grossSalary),
            bonuses: parseFloat(payslipData.bonuses) || 0,
            deductions: parseFloat(payslipData.deductions) || 0,
            netSalary: parseFloat(payslipData.grossSalary) + (parseFloat(payslipData.bonuses) || 0) - (parseFloat(payslipData.deductions) || 0),
            createdAt: new Date().toISOString()
        };

        payslips.push(payslip);
        localStorage.setItem('fl_payslips', JSON.stringify(payslips));
        return payslip;
    },

    // Gestion de l'utilisateur actuel
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('fl_current_user') || '{}');
    },

    setCurrentUser(user) {
        localStorage.setItem('fl_current_user', JSON.stringify(user));
    },

    // Vérification des permissions
    canViewEmployee(currentUserId, targetEmployeeId) {
        const currentUser = this.getCurrentUser();
        const targetEmployee = this.getEmployeeById(targetEmployeeId);
        
        if (!currentUser || !targetEmployee) return false;

        // L'utilisateur peut toujours voir ses propres informations
        if (currentUser.id === targetEmployeeId) return true;

        // Rôles avec accès complet
        const adminRoles = [
            'directeur_general',
            'directeur_rh',
            'ressources_humaines',
            'comptable'
        ];

        return adminRoles.includes(currentUser.role);
    },

    canViewAllEmployees() {
        const currentUser = this.getCurrentUser();
        const adminRoles = [
            'directeur_general',
            'directeur_rh',
            'ressources_humaines',
            'comptable',
            'equipe_media',
            'directeur_evenementiel'
        ];
        return adminRoles.includes(currentUser.role);
    },

    // Rôles disponibles
    getRoles() {
        return [
            { value: 'chauffeur', label: 'Chauffeur' },
            { value: 'directeur_general', label: 'Directeur Général' },
            { value: 'directeur_rh', label: 'Directeur Ressources Humaines' },
            { value: 'ressources_humaines', label: 'Ressources Humaines' },
            { value: 'equipe_media', label: 'Équipe Média' },
            { value: 'directeur_evenementiel', label: 'Directeur Événementiel' },
            { value: 'comptable', label: 'Comptable' },
            { value: 'formateur', label: 'Formateur' }
        ];
    },

    // Paiement de salaire
    paySalary(employeeId, amount, description, period) {
        const employee = this.getEmployeeById(employeeId);
        if (!employee) return false;

        // Débiter le compte FL
        this.updateFLAccount(amount, `${employee.firstName} ${employee.lastName} - ${description}`, employeeId, `${employee.firstName} ${employee.lastName}`);

        // Créditer le compte de l'employé
        this.updateEmployeeBalance(employeeId, amount);

        // Créer la fiche de paie
        this.addPayslip({
            employeeId: employeeId,
            period: period,
            grossSalary: amount,
            bonuses: 0,
            deductions: 0
        });

        return true;
    }
};

// Initialiser au chargement
if (typeof window !== 'undefined') {
    AppData.init();
}

