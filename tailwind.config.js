/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          hot: "#ff3b30",
          ember: "#ff7a18",
          mustard: "#fbbf24"
        }
      }
    },
  },
  plugins: [],
};

