/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: '#a3c9f9',
        pastelPink: '#f9a3c9',
        pastelGreen: '#a3f9c9',
        pastelYellow: '#f9f7a3',
        pastelPurple: '#c9a3f9',
      }
    },
  },
  plugins: [],
}