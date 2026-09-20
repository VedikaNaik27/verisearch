/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          400: "#5b8def",
          500: "#3a6ee8",
          600: "#2c56c9",
          700: "#24449e",
        },
      },
    },
  },
  plugins: [],
};
