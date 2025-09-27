/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Travel Social Platform Color Palette
        forest: '#5D8736', // Deep forest green
        sage: '#809D3C', // Sage green
        lime: '#A9C46C', // Light lime green
        cream: '#F4FFC3', // Cream/off-white
        coral: '#DD0303', // Coral red
        sunset: '#FAB12F', // Sunset orange
        amber: '#FA812F', // Amber orange
        earth: '#8B4513', // Earth brown
        sky: '#87CEEB', // Sky blue
        sand: '#F5E6D3', // Sand beige
        charcoal: '#2C2C2C', // Dark charcoal
        stone: '#6B7280', // Medium gray
        mist: '#F3F4F6', // Light gray

        // Semantic color mappings
        primary: {
          DEFAULT: '#5D8736',
          50: '#F4FFC3',
          100: '#A9C46C',
          200: '#809D3C',
          300: '#5D8736',
          400: '#4A6B2A',
          500: '#3D5A1F',
          600: '#304914',
          700: '#23380A',
          800: '#162700',
          900: '#0A1600',
        },
        secondary: {
          DEFAULT: '#809D3C',
          50: '#F4FFC3',
          100: '#A9C46C',
          200: '#809D3C',
          300: '#5D8736',
          400: '#4A6B2A',
          500: '#3D5A1F',
          600: '#304914',
          700: '#23380A',
          800: '#162700',
          900: '#0A1600',
        },
        accent: {
          DEFAULT: '#DD0303',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DD0303',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        warm: {
          DEFAULT: '#FAB12F',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FAB12F',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        travel: ['Inter', 'system-ui', 'sans-serif'],
        playful: ['Comic Neue', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-travel':
          'linear-gradient(135deg, #5D8736 0%, #809D3C 50%, #A9C46C 100%)',
        'gradient-sunset':
          'linear-gradient(135deg, #FAB12F 0%, #FA812F 50%, #DD0303 100%)',
        'gradient-earth':
          'linear-gradient(135deg, #8B4513 0%, #5D8736 50%, #87CEEB 100%)',
      },
    },
  },
  plugins: [],
};
