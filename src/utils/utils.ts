export function getTheme() {
    const raw = localStorage.getItem('theme-storage-caretrack');
    try {
        const parsed = raw ? JSON.parse(raw) : null;
        const theme = parsed?.state?.theme;

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        // fallback if JSON is broken
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }
}