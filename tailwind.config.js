/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'theme-bg': 'var(--color-bg)',
        'theme-bg-dark': 'var(--color-bgDark)',
        'theme-accent': 'var(--color-accent)',
        'theme-primary': 'var(--color-primary)',
        'theme-secondary': 'var(--color-secondary)',
        'theme-text': 'var(--color-text)',
        'theme-text-muted': 'var(--color-textMuted)',
        'theme-border': 'var(--color-border)',
        'theme-success': 'var(--color-success)',
        'theme-danger': 'var(--color-danger)',
      },
    },
  },
  plugins: [],
}
