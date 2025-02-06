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
        small: 'clamp(0.5rem, 2vw, .9rem)',  
        medium: 'clamp(.9rem, 3vw, 1.2rem)',
        large: 'clamp(1rem,4vw,1.4rem)',
        big: 'clamp(1.2rem, 4vw, 1.8rem)',     
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

