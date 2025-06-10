// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // NOTE: Update this to include the paths to all of your component files.
//   content: ["./App.tsx", "./src/components/**/*.{js,jsx,ts,tsx}","./src/screens/**/*.{js,jsx,ts,tsx}",],
//   presets: [require("nativewind/preset")],

//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./src/components/**/*.{js,jsx,ts,tsx}","./src/screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
   theme: {
    extend: {
      colors: {
        primary:{
          100:"",
          200:"",
          300:"",
          400:"#FF652E",
          500:"#E85C2A",
          600:"",
        },
        gray:{
          100:"#DEE0E4",
          200:"#777777"
        },
        dark:{
          100:"#23334A",
          500:"#23334A"
        },
        secondary: '#F59E0B',
        background: '#F9FAFB',
        dark: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        display: ['Poppins', 'System'],
      },
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 20,
        xl: 24,
        '2xl': 30,
      },
    },
  },
  plugins: [],
}