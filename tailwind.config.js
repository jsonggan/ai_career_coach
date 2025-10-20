/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fad9be',
          300: '#f6be92',
          400: '#f19964',
          500: '#ee7a42',
          600: '#F2622A',
          700: '#d2491f',
          800: '#a93c1e',
          900: '#86341d',
        },
      },
    },
  },
  plugins: [],
}