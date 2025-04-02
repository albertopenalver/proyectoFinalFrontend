module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
       themeamarillo: {
          "primary": "#FFC107", // Vibrant yellow for primary actions
          "secondary": "#FF5722", // Vibrant orange for secondary actions
          "accent": "#FF9800", // Orange accent for additional highlights
          "neutral": "#1F1F1F", // Dark gray background for cards and panels
          "base-100": "#2E2E2E", // Medium gray for the main background
          "info": "#03C03C", // Optional teal for informational elements
          "success": "#03C03C", // Soft green for success messages
          "warning": "#FFC107", // Yellow for warnings (reuse primary)
          "error": "#FF0000", // Light red for errors
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};

