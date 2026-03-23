import type { Config } from 'tailwindcss';
import utilityStylesTailwindConfig from '@harnessio/ui/tailwind-design-system';

export default {
  presets: [utilityStylesTailwindConfig],
  darkMode: 'class', // Enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
} satisfies Config;
