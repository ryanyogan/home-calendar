/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,ts,js}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        cards: "repeat(auto-fit, minmax(250px, 1fr))",
      },
      gridTemplateRows: {
        "auto-french": "auto 1fr",
      },
    },
  },
  plugins: [],
};
