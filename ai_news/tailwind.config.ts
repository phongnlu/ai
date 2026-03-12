import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        category: {
          research: 'var(--category-research)',
          product: 'var(--category-product)',
          policy: 'var(--category-policy)',
          'open-source': 'var(--category-open-source)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
