// Système d'authentification FL Banking

const AuthSystem = {
    // Initialiser le système d'authentification
    init() {
        if (!localStorage.getItem('fl_users')) {
            // Créer l'utilisateur admin par défaut
            const adminUser = {
                id: 'ADMIN001',
                employeeId: 'ADMIN001',
                username: 'admin',
                password: this.hashPassword('admin123'), // Mot de passe par défaut
                role: 'directeur_general',
                email: 'admin@francelogistique.fr',
                firstName: 'Admin',
                lastName: 'System',
                createdAt: new Date().toISOString(),
                isAdmin: true
            };

            const users = [adminUser];
            localStorage.setItem('fl_users', JSON.stringify(users));
        }

        if (!localStorage.getItem('fl_temp_codes')) {
            localStorage.setItem('fl_temp_codes', JSON.stringify([]));
        }
    },

    // Hasher un mot de passe (simple hash pour démo, utiliser bcrypt en production)
    hashPassword(password) {
        // Hash simple pour démo - À remplacer par un vrai hash en production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    },

    // Vérifier un mot de passe
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    },

    // Connexion
    login(username, password) {
        const users = this.getUsers();
        
        // Chercher par username ou employeeId
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            u.employeeId === username.toUpperCase()
        );

        if (!user) {
            return false;
        }

        // Vérifier le mot de passe
        if (!this.verifyPassword(password, user.password)) {
            return false;
        }

        // Mettre à jour l'utilisateur actuel
        AppData.setCurrentUser({
            id: user.id,
            employeeId: user.employeeId,
            username: user.username,
            role: user.role,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin || false
        });

        // Mettre à jour la session
        sessionStorage.setItem('fl_session', JSON.stringify({
            userId: user.id,
            loginTime: new Date().toISOString()
        }));

        return true;
    },

    // Déconnexion
    logout() {
        AppData.setCurrentUser(null);
        sessionStorage.removeItem('fl_session');
        window.location.href = 'login.html';
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        const session = sessionStorage.getItem('fl_session');
        const currentUser = AppData.getCurrentUser();
        return session && currentUser && currentUser.id;
    },

    // Obtenir tous les utilisateurs
    getUsers() {
        return JSON.parse(localStorage.getItem('fl_users') || '[]');
    },

    // Obtenir un utilisateur par ID
    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id || u.employeeId === id);
    },

    // Créer un utilisateur (lors de l'ajout d'un employé)
    createUser(employeeData, password) {
        const users = this.getUsers();
        const employee = AppData.getEmployeeById(employeeData.employeeId);

        if (!employee) {
            throw new Error('Employé non trouvé');
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = users.find(u => u.employeeId === employeeData.employeeId);
        if (existingUser) {
            throw new Error('Un compte existe déjà pour cet employé');
        }

        const newUser = {
            id: `USER_${Date.now()}`,
            employeeId: employeeData.employeeId,
            username: `${employee.firstName.toLowerCase()}.${employee.lastName.toLowerCase()}`,
            password: this.hashPassword(password),
            role: employee.role,
            email: employee.email || `${employee.firstName.toLowerCase()}.${employee.lastName.toLowerCase()}@francelogistique.fr`,
            firstName: employee.firstName,
            lastName: employee.lastName,
            createdAt: new Date().toISOString(),
            isAdmin: false
        };

        users.push(newUser);
        localStorage.setItem('fl_users', JSON.stringify(users));
        return newUser;
    },

    // Générer un code provisoire
    generateTempCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let code = '';
        for (let i = 0; i < 12; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },

    // Demander un code de récupération
    requestPasswordReset(identifier) {
        const users = this.getUsers();
        const user = users.find(u => 
            u.username.toLowerCase() === identifier.toLowerCase() ||
            u.employeeId === identifier.toUpperCase() ||
            u.email.toLowerCase() === identifier.toLowerCase()
        );

        if (!user) {
            return { success: false, message: 'Aucun compte trouvé avec ces identifiants.' };
        }

        // Générer un code provisoire
        const tempCode = this.generateTempCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expire dans 10 minutes

        // Sauvegarder le code temporaire
        const tempCodes = JSON.parse(localStorage.getItem('fl_temp_codes') || '[]');
        tempCodes.push({
            userId: user.id,
            code: this.hashPassword(tempCode),
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('fl_temp_codes', JSON.stringify(tempCodes));

        // Simuler l'envoi d'email (en production, utiliser un vrai service d'email)
        console.log(`Email envoyé à ${user.email} avec le code: ${tempCode}`);
        
        // Pour la démo, on stocke aussi le code en clair dans le localStorage (à ne PAS faire en production)
        sessionStorage.setItem(`temp_code_${user.id}`, tempCode);

        return {
            success: true,
            message: `Un code provisoire a été envoyé à ${user.email}. Il expire dans 10 minutes.`,
            code: tempCode // Pour la démo uniquement
        };
    },

    // Vérifier et utiliser le code provisoire
    verifyTempCode(identifier, code, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => 
            u.username.toLowerCase() === identifier.toLowerCase() ||
            u.employeeId === identifier.toUpperCase() ||
            u.email.toLowerCase() === identifier.toLowerCase()
        );

        if (!user) {
            return { success: false, message: 'Aucun compte trouvé.' };
        }

        // Vérifier le code (pour la démo, on vérifie aussi le code en clair)
        const tempCode = sessionStorage.getItem(`temp_code_${user.id}`);
        const tempCodes = JSON.parse(localStorage.getItem('fl_temp_codes') || '[]');
        
        const validCode = tempCodes.find(tc => 
            tc.userId === user.id &&
            (this.verifyPassword(code, tc.code) || code === tempCode) &&
            new Date(tc.expiresAt) > new Date()
        );

        if (!validCode) {
            return { success: false, message: 'Code invalide ou expiré.' };
        }

        // Mettre à jour le mot de passe
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].password = this.hashPassword(newPassword);
            localStorage.setItem('fl_users', JSON.stringify(users));
        }

        // Supprimer le code temporaire
        const updatedTempCodes = tempCodes.filter(tc => tc.userId !== user.id);
        localStorage.setItem('fl_temp_codes', JSON.stringify(updatedTempCodes));
        sessionStorage.removeItem(`temp_code_${user.id}`);

        return { success: true, message: 'Mot de passe mis à jour avec succès !' };
    },

    // Mettre à jour le mot de passe d'un utilisateur
    updatePassword(userId, oldPassword, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return { success: false, message: 'Utilisateur non trouvé.' };
        }

        if (!this.verifyPassword(oldPassword, user.password)) {
            return { success: false, message: 'Ancien mot de passe incorrect.' };
        }

        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex].password = this.hashPassword(newPassword);
        localStorage.setItem('fl_users', JSON.stringify(users));

        return { success: true, message: 'Mot de passe mis à jour avec succès !' };
    }
};

// Initialiser au chargement
if (typeof window !== 'undefined') {
    AuthSystem.init();
}

