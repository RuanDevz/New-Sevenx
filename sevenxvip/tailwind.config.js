export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Asian theme
    'from-purple-500', 'to-purple-600', 'from-purple-600', 'to-purple-700',
    'hover:from-purple-600', 'hover:to-purple-700',
    'hover:shadow-purple-500/20', 'bg-purple-500/10', 'border-purple-500/30',
    'text-purple-400', 'from-purple-400', 'to-purple-500',

    // Western theme
    'from-orange-500', 'to-orange-600', 'from-orange-600', 'to-orange-700',
    'hover:from-orange-600', 'hover:to-orange-700',
    'hover:shadow-orange-500/20', 'bg-orange-500/10', 'border-orange-500/30',
    'text-orange-400', 'from-orange-400', 'to-orange-500',

    // VIP theme
    'from-yellow-500', 'to-yellow-600', 'from-yellow-600', 'to-yellow-700',
    'hover:from-yellow-600', 'hover:to-yellow-700',
    'hover:shadow-yellow-500/20', 'bg-yellow-500/10', 'border-yellow-500/30',
    'text-yellow-400', 'from-yellow-400', 'to-yellow-500',

    // Banned theme
    'from-red-500', 'to-red-600', 'from-red-600', 'to-red-700',
    'hover:from-red-600', 'hover:to-red-700',
    'hover:shadow-red-500/20', 'bg-red-500/10', 'border-red-500/30',
    'text-red-400', 'from-red-400', 'to-red-500',

    // Unknown theme (minimalist)
    'from-slate-500', 'to-slate-600', 'from-slate-600', 'to-slate-700',
    'hover:from-slate-600', 'hover:to-slate-700',
    'hover:shadow-slate-500/20', 'bg-slate-500/10', 'border-slate-500/30',
    'text-slate-400', 'from-slate-400', 'to-slate-500',
    'bg-slate-800/60', 'hover:bg-slate-700/80', 'border-slate-700/50', 'hover:border-slate-500/50',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Asian theme (purple)
        'asian-primary': '#8A4DFF',
        'asian-secondary': '#E3C4FF',
        'asian-accent': '#6A11CB',
        
        // Western theme (orange)
        'western-primary': '#fca94d',
        'western-secondary': '#ffddab',
        'western-accent': '#F57C00',
        
        // VIP theme (gold)
        'vip-primary': '#FFC107',
        'vip-secondary': '#ffca2c',
        'vip-accent': '#FFA000',
        
        // Base colors
        'bg-primary': '#111015',
        'bg-secondary': '#1C1B22',
        'bg-tertiary': '#2C2A35',
        'text-primary': '#EAEAEA',
        'text-secondary': '#9E9E9E',
        'border-color': '#33313D',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      animation: {
        'fly-crown': 'fly-crown 1s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'fly-crown': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '30%': { transform: 'translate(calc(50vw - 50px), 10vh) scale(1.5)', opacity: '1' },
          '100%': { transform: 'translate(calc(100vw - 100px), 0) scale(0.5)', opacity: '0' },
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
      },
    },
  },
  plugins: [],
};
