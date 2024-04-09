import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        Clockmaker: ["Clockmaker"],
        poppins: ["Poppins"],
      },
      colors: {
        primary: "#2B4896",
        "btn-hover": "#1F336B",
        "primary-hover": "#182853",
        "text-primary": "#202124",
        "text-secondary": "#6A6A6C",
        "text-white": "#FDFCFB",
        success: "#43A048",
        blur: "#0D0E0F99",
      },
    },
  },
  plugins: [],
};
export default config;
