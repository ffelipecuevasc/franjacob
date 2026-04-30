/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le dice a Tailwind qué archivos escanear para buscar clases
  content: ["./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- Paleta Original Modo Claro ---
        "on-primary-fixed": "#3c0028",
        "secondary-container": "#fc7dc3",
        "on-tertiary-fixed": "#3c0029",
        "surface-tint": "#b4017f",
        "secondary-fixed-dim": "#ffafd6",
        "secondary-fixed": "#ffd8e8",
        "tertiary-fixed": "#ffd8e9",
        "surface-container-highest": "#efdee6",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#ffafd6",
        "on-primary-fixed-variant": "#8a0060",
        "on-error": "#ffffff",
        "surface-dim": "#e6d6de",
        outline: "#8a707b",
        tertiary: "#963971",
        "error-container": "#ffdad6",
        "on-surface-variant": "#57404b",
        "tertiary-container": "#b4528b",
        "on-secondary": "#ffffff",
        "on-background": "#22191f",
        "surface-container-low": "#fff0f6",
        "outline-variant": "#ddbecb",
        "on-secondary-container": "#770853",
        "inverse-surface": "#372e34",
        "on-error-container": "#93000a",
        primary: "#b0007c",
        "on-secondary-fixed": "#3c0028",
        "on-surface": "#22191f",
        "primary-fixed": "#ffd8e8",
        "on-secondary-fixed-variant": "#83165d",
        "surface-container-high": "#f4e4ec",
        background: "#fff7f9",
        "tertiary-fixed-dim": "#ffafd7",
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed-variant": "#7c235b",
        error: "#ba1a1a",
        "on-primary": "#ffffff",
        "on-primary-container": "#fffbff",
        "surface-container": "#fae9f1",
        "surface-bright": "#fff7f9",
        "inverse-on-surface": "#fdecf4",
        "on-tertiary": "#ffffff",
        surface: "#fff7f9",
        "primary-fixed-dim": "#ffafd6",
        secondary: "#a23276",
        "primary-container": "#d22b97",
        "surface-variant": "#efdee6",

        // --- Paleta Estricta Modo Oscuro Solicitada ---
        "dark-surface": "#260318",
        "dark-on-surface": "#FDECF4",
        "dark-primary": "#F05FB5",
        "dark-on-primary": "#260318",
        "dark-surface-variant": "#631345",
        "dark-on-surface-variant": "#F9CFE4",
        "dark-primary-container": "#DE37A1",
        "dark-surface-container-low": "#3B0728",
        "dark-secondary": "#F59FCC",
        "dark-surface-container-lowest": "#260318",
        "dark-outline": "#B62B82",
        "dark-secondary-container": "#8C1F64",
        "dark-on-secondary-container": "#FDECF4",
        "dark-surface-container-high": "#631345",
        "dark-outline-variant": "#8C1F64",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      fontFamily: {
        headline: ["Newsreader", "serif"], // Añadida fuente de respaldo 'serif'
        body: ["Manrope", "sans-serif"],   // Añadida fuente de respaldo 'sans-serif'
        label: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        "soft-layered":
            "0 2px 5px rgba(60, 0, 40, 0.02), 0 6px 15px rgba(60, 0, 40, 0.03), 0 12px 30px rgba(60, 0, 40, 0.04), 0 24px 60px rgba(60, 0, 40, 0.05)",
        "soft-layered-hover":
            "0 4px 10px rgba(60, 0, 40, 0.03), 0 10px 25px rgba(60, 0, 40, 0.04), 0 20px 50px rgba(60, 0, 40, 0.06), 0 40px 80px rgba(60, 0, 40, 0.08)",
        "neon-glow":
            "0 0 10px rgba(240, 95, 181, 0.3), 0 0 20px rgba(240, 95, 181, 0.2), 0 0 30px rgba(240, 95, 181, 0.1), inset 0 0 2px rgba(240, 95, 181, 0.3)",
        "inner-dark":
            "inset 0 4px 10px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 2px rgba(240, 95, 181, 0.15)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
};