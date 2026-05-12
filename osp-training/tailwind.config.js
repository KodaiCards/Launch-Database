/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ospnavy:   '#0b1d3a',
        ospsteel:  '#1f3a5f',
        ospamber:  '#f59e0b',
        ospgreen:  '#16a34a',
        osprust:   '#b45309',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
