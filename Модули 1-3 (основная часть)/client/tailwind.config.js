/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /banquet-(wine|sand|ivory|ink|muted)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        banquet: {
          wine: '#7A3344',
          sand: '#E8E4E0',
          ivory: '#F5F5F5',
          ink: '#333333',
          muted: '#666666',
          red: '#7A3344',
          peach: '#E8E4E0',
          cream: '#F5F5F5',
          green: '#666666',
          gold: '#666666',
          blush: '#F5F5F5',
          sage: '#666666',
        },
      },
    },
  },
  plugins: [],
}
