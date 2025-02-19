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
        'light-gray': '#adccbd'
      },
      fontSize: {
        supersmall: 'clamp(0.5rem, 2vw, 0.8rem)',  
        small: 'clamp(0.7rem, 2vw, 1rem)',  
        medium: 'clamp(.9rem, 3vw, 1.2rem)',
        large: 'clamp(1.1rem,4vw,1.4rem)',
        big: 'clamp(1.3rem, 4vw, 1.6rem)',     
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

