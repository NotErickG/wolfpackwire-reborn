/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nc-red': '#CC0000',
        'nc-red-dark': '#990000',
        'nc-red-light': '#FF3333',
        'wolfpack-gray': '#595959',
        'wolfpack-silver': '#C0C0C0',
      },
      fontFamily: {
        'nc-state': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};