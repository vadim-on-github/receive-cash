export function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)") ? 'dark' : 'light';
}
