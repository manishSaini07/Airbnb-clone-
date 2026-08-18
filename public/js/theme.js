
        document.addEventListener('DOMContentLoaded', () => {
            const toggleBtn = document.getElementById('themeToggleBtn');
            const themeIcon = document.getElementById('themeIcon');
            const htmlElement = document.documentElement;

            function updateIcon(theme) {
                if (theme === 'dark') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }

            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            updateIcon(currentTheme);

            toggleBtn.addEventListener('click', () => {
                const activeTheme = htmlElement.getAttribute('data-bs-theme');
                let newTheme = 'light';

                if (activeTheme === 'light') {
                    newTheme = 'dark';
                }

                htmlElement.setAttribute('data-bs-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateIcon(newTheme);
            });
        });