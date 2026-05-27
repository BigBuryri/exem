/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /banquet-(wine|gold|peach|cream|red|green|ink|muted|blush)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oswald', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h2: ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h3: ['18px', { lineHeight: '1.35' }],
        body: ['16px', { lineHeight: '1.6' }],
        aux: ['12px', { lineHeight: '1.45' }],
      },
      colors: {
        banquet: {
          gold: '#DAA520',
          peach: '#FFDAB9',
          cream: '#FFFDD0',
          red: '#DC143C',
          green: '#006400',
          wine: '#DC143C',
          ink: '#000000',
          muted: '#006400',
          blush: '#FFDAB9',
          sand: '#FFDAB9',
          ivory: '#FFFDD0',
          sage: '#006400',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(218, 165, 32, 0.18), 0 2px 8px -2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 32px -8px rgba(218, 165, 32, 0.28), 0 4px 12px -4px rgba(0, 0, 0, 0.08)',
        header: '0 1px 0 rgba(218, 165, 32, 0.25), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
