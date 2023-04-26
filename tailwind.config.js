/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'black':'#001219',
        'orange': '#EB5E28',
        'blue': {
          '50': '#90C0F1',
          '100': '#74B1ED',
          '200': '#59A1E9',
          '300': '#4B99E8',
          '400': '#3c91E6',
          '500': '#2B87E3',
          '600': '#1D7DDD',
          '700': '#1A72CA',
          '800': '#114981',
          '900': '#0A2A4A',
          '950': '#020A12'
        },
        'red': {
          '50': '#EC8697',
          '100': '#E4556D',
          '200': '#DD2543',
          '300': '#AE1B34',
          '400': '#66101F',
          '500': '#5E0F1C',
          '600': '#570E1A',
          '700': '#480B16',
          '800': '#3A0911',
          '900': '#33080F',
          '950': '#24060B',
        },
        'white': '#FFFCF2',
        'green': '#106557'
      },
      fontFamily: {
        'accent': ['Teko', 'sans-serif']
      },
    },
  },
  plugins: [
    require('prettier-plugin-tailwindcss'),
  ],
}

