/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation:{
        'pulse-glow': "pulseGlow 2s infinite",
      },
      keyframes:{
        pulseGlow:{
          '0%,100%': {
            boxShadow:'0 0 0 0 rgba(99,102,241,0.5)',
          },
          '50%':{
            boxShadow:'0 0 10px 4px rgba(99,102,241,0.7)'
          },
        },
      },
    },
  },
  plugins: [],
};
