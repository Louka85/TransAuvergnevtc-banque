// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeButtons = document.querySelectorAll('.theme-toggle');
    if (themeButtons && themeButtons.length) {
        themeButtons.forEach(btn => {
            const lightIcon = btn.querySelector('.light-icon');
            const darkIcon = btn.querySelector('.dark-icon');
            if (lightIcon && darkIcon) {
                if (theme === 'light') {
                    lightIcon.style.display = 'block';
                    darkIcon.style.display = 'none';
                } else {
                    lightIcon.style.display = 'none';
                    darkIcon.style.display = 'block';
                }
            }
        });
    }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    updateThemeIcon(savedTheme);
    
    // Add click handler to theme toggle buttons
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(button => {
        button.addEventListener('click', toggleTheme);
    });
});