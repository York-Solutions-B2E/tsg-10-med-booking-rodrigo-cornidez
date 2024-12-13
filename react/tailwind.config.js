/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          colors: {
            backgroundLight: '#F3F4F6',
            backgroundDark: '#1F2937',
            textLight: '#ffffff',
            textDark: '#333333',
            primary: '#1a73e8',
            secondary: '#ff4081',
          },
          keyframes: {
            marquee: {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
          },
          animation: {
            marquee: 'marquee 30s linear infinite',
          },
        },
      },
      darkMode: 'class',
    };