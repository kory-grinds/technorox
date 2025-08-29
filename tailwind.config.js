/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00FFF7',
        'neon-magenta': '#FF3EF5',
        'neon-purple': '#1A001F',
        'neon-gray': '#0A0A0F',
        'cyber-dark': '#0D0D0D',
        'cyber-light': '#1A1A1A'
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'tech': ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 247, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 62, 245, 0.5)',
        'cyber': '0 4px 20px rgba(0, 255, 247, 0.3)'
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'pulse-neon': {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 247, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 255, 247, 0.8)' }
        },
        'glow': {
          '0%': { textShadow: '0 0 10px rgba(0, 255, 247, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(0, 255, 247, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}
