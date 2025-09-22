import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'spring-gradient': 'linear-gradient(135deg, #8BC34A 0%, #CDDC39 100%)',
        'summer-gradient': 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
        'autumn-gradient': 'linear-gradient(135deg, #FFB74D 0%, #8D6E63 100%)',
        'winter-gradient': 'linear-gradient(135deg, #03A9F4 0%, #E1F5FE 100%)'
      }
    }
  },
  plugins: []
};

export default config;
