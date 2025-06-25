/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': "radial-gradient(circle farthest-corner at -24.7% -47.3%, rgba(6,130,165,1) 0%, rgba(34,48,86,1) 66.8%, rgba(15,23,42,1) 100.2%)",
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      colors: {
        'neon-green': '#00FF00',
      },
    },
  },
  plugins: [],
}

