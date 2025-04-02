/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    safelist: ["font-nanum"],
    theme: {
      extend: {
        fontFamily: {
          nanum: ['NanumSquare', 'sans-serif'],
        },
        colors: {
          slate: {
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            800: "#1E293B",
            900: "#0F172A",
          },
          violet: {
            100: "#EDE9FE",
            600: "#7C3AED",
          },
          rose: {
            500: "#F43F5E",
            600: "#E11D48",
          },
          lime: {
            300: "#BEF264",
          },
          amber: {
            800: "#92400E",
          },
        },
      },
    },
    plugins: [],
  };
  