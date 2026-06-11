/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F1E3C",
        emerald: { DEFAULT: "#10B981", light: "#D1FAE5", dark: "#059669" },
      },
    },
  },
  plugins: [],
};
