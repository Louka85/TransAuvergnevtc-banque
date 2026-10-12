// Protection d'authentification pour toutes les pages

(function() {
    // Vérifier l'authentification au chargement de la page
    if (typeof AuthSystem !== 'undefined' && typeof AppData !== 'undefined') {
        // Ne pas vérifier sur la page de connexion
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('forgot-password.html')) {
            return;
        }

        // Vérifier si l'utilisateur est connecté
        if (!AuthSystem.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Mettre à jour le nom d'utilisateur dans l'interface
        const currentUser = AppData.getCurrentUser();
        if (currentUser) {
            const userNames = document.querySelectorAll('.user-name');
            userNames.forEach(el => {
                el.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            });
        }
    }
})();

