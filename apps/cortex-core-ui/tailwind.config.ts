import type { Config } from 'tailwindcss';
import utilityStylesTailwindConfig from '@harnessio/ui/tailwind-design-system';

export default {
  presets: [utilityStylesTailwindConfig],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config;
