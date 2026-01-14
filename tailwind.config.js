/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "320px",  // Mobile nhỏ
      sm: "480px",  // Điện thoại lớn
      md: "768px",  // Tablet
      lg: "1024px", // Laptop
      xl: "1280px", // Màn hình lớn
      "2xl": "1536px", // Màn hình cực lớn
    },
    extend: {
      colors: {
        'primary': "var(--primary-color)",
        'secondary': "var(--secondary-color)",
        'background': "var(--background-color)",
        'foreground': "var(--font-color)",
        'footer': "var(--footer-bg)",
      }
    },
  },
  plugins: [],
}