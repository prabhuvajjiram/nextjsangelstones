/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d4af37", // Gold color for captions and accents
        secondary: "#262626", // Dark gray/black for backgrounds
        accent: "#555555", // Medium gray for text
        light: "#f8f8f8", // Light gray for backgrounds
      },
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        didact: ["var(--font-didact)"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"],
      },
      height: {
        "screen-90": "90vh",
        "screen-80": "80vh",
      },
      maxHeight: {
        "780": "780px",
      },
      minHeight: {
        "480": "480px",
      },
      zIndex: {
        "1000": "1000",
        "999": "999",
      },
      backgroundImage: {
        "gradient-overlay": "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
      },
      backdropFilter: {
        "blur-10": "blur(10px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
