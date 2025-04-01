module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        accent: '#93C5FD'
      },
      boxShadow: {
        bubble: '0 2px 8px -1px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
} 