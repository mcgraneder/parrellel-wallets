const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["PlusJakartaSans", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        blink: "pusle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        widthi: "widthin 1s forwards",
        widtho: "widthout 1s backwards",
      },
      keyframes: {
        pusle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        widthin: {
          "0%": { left: "150%" },
          "100%": { left: "0%" },
        },
        widthout: {
          "0%": { left: "0%" },
          "100%": { left: "150%" },
        },
      },
      transitionProperty: {
        width: "width",
      },
      colors: {
        primary: "#2CC995",
        secondary: "#245E49",
        accent: "#DD3F7D",
        white: "#FAFAFA",
        navigationblue: "#236EA4",
        danger: "#FF3C4F",
        warning: "#F7CA60",
        error: "#EB4487",
        "black-900": "#111318",
        "black-800": "#1C1D21",
        "black-700": "#25272C",
        "black-600": "#333333",
        "grey-600": "#4B4E58",
        "grey-500": "#666666",
        "grey-450": "#7A7A7A",
        "grey-400": "#A3A3A3",
      },
      spacing: {
        "630px": "630px",
        "550px": "550px",
      },
      screens: {
        xs: "400px",
      },
      borderRadius: {
        "32px": "32px",
      },
    },
  },
  safelist: ["bg-warning", "bg-error", "text-warning", "text-error"],
  plugins: [],
};
