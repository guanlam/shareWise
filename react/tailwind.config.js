/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': '#1c312c',
        'light-mint': '#c0ebd7',
        'light-cyan': '#ebf6f7',
      },
      fontSize: {
        small: 'clamp(0.5rem, 2vw, .9rem)',  
        medium: 'clamp(1rem, 3vw, 1.5rem)', 
        big: 'clamp(1rem, 4vw, 2rem)',     
      },
    },
  },
  plugins: [],
}

