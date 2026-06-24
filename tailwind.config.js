/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IBIEA 2026 — Deep Navy + Metallic Gold luxury palette (brochure-aligned)
        navy: {
          DEFAULT: '#0B1438',   // primary background
          900: '#08122F',
          800: '#0B1438',
          700: '#101D4A',
          600: '#142352',
          500: '#1B2C63',
        },
        gold: {
          DEFAULT: '#D4AF37',   // primary metallic gold accent
          dark: '#C89B1D',
          light: '#E0C05A',
          deep: '#C89B1D',      // legacy alias
          bright: '#D4AF37',    // legacy alias
        },
        cream: '#F5F1E6',       // ivory white text
        charcoal: '#1E1E1E',
        'dark-grey': '#2A2A2A',
        // legacy aliases (kept so older pages don't break before re-theme)
        ivory: '#F5F1E6',
        sand: { DEFAULT: '#101D4A', light: '#142352', dark: '#1B2C63' },
        umber: '#F5F1E6',
        'umber-light': '#B9C0D8',
      },
      fontFamily: {
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #08122F 0%, #0B1438 50%, #142352 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C89B1D 0%, #E0C05A 50%, #C89B1D 100%)',
        'gold-text': 'linear-gradient(135deg, #E0C05A 0%, #D4AF37 50%, #C89B1D 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'gold-glow': 'goldGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(34px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        goldGlow: {
          '0%,100%': { boxShadow: '0 0 18px rgba(212,175,55,0.25)' },
          '50%': { boxShadow: '0 0 32px rgba(212,175,55,0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(212,175,55,0.25)',
        'gold-lg': '0 10px 44px rgba(212,175,55,0.4)',
        'card': '0 8px 30px rgba(0,0,0,0.35)',
        'card-hover': '0 16px 50px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
