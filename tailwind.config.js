/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        coolGray: '#DDE1E6',
        gray: '#697077',
        gray2: '#F2F4F8',

        white: '#FFFFFF',
        white2: '#fcfcfc',

        black: '#101010',
        black2: '#21272A',

        primaryGreen: '#57BE6C',
      },
      spacing: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',

        '10px': '10px',
        '48px': '48px',
        '50px': '50px',
        '80px': '80px',

        '150px': '150px',
        '165px': '165px',

        '250px': '250px',

        '300px': '300px',

        '530px': '530px',
        '560px': '560px',

        '720px': '720px',

        '1032px': '1032px',
      },
      maxWidth: {
        '1032px': '1032px',
      },
      boxShadow: {
        xl: '4px 0px 24px 0px rgba(0, 39, 0, 0.10)',
        lg: '0px 4px 24px 0px rgba(0, 0, 0, 0.10)',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        '42px': ['42px', '50px'],
      },
    },
  },
  plugins: [],
};
