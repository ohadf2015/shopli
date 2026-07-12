/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        shopli: {
          navy: 'oklch(22.5% 0.04 264)',
          'navy-light': 'oklch(30% 0.05 264)',
          orange: 'oklch(65% 0.18 45)',
          'orange-dark': 'oklch(55% 0.2 45)',
          teal: 'oklch(55% 0.14 185)',
          red: 'oklch(55% 0.22 25)',
        },
      },
      fontFamily: {
        hebrew: ['Assistant', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};