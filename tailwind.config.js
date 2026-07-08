/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand accent — a warm, appetizing terracotta/red used across the app.
        // Refined from the old flat red into a richer, food-forward scale so the
        // whole UI can be re-themed from one place.
        brand: {
          "50": "#fef4f2", "100": "#fee5e0", "200": "#fdcfc5", "300": "#fbab9b",
          "400": "#f67a62", "500": "#ec4f35", "600": "#d93518", "700": "#b62912",
          "800": "#962515", "900": "#7c2418", "950": "#430d07"
        },
        // Secondary accent — warm saffron/amber for highlights, ratings, chips.
        accent: {
          "50": "#fffaeb", "100": "#fdf0c8", "200": "#fbdf8c", "300": "#f9c94f",
          "400": "#f7b12a", "500": "#f18f11", "600": "#d56b0b", "700": "#b14a0d",
          "800": "#903a11", "900": "#763012", "950": "#441605"
        },
        // Warm neutral "sand" scale used for surfaces, borders and text instead of
        // cold grays — gives the whole product a cohesive editorial warmth.
        sand: {
          "50": "#faf8f5", "100": "#f4f0ea", "200": "#e9e2d7", "300": "#d8ccbb",
          "400": "#bfae97", "500": "#a8927a", "600": "#8f7862", "700": "#756251",
          "800": "#615247", "900": "#52463e", "950": "#2b231e"
        },
        // Existing primary (blue) scale, retained for compatibility.
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        // Soft, layered elevation with a subtle warm tint.
        'xs': '0 1px 2px 0 rgba(43, 35, 30, 0.05)',
        'soft': '0 1px 2px rgba(43,35,30,0.04), 0 4px 12px -2px rgba(43,35,30,0.06)',
        'card': '0 1px 3px rgba(43,35,30,0.05), 0 8px 24px -6px rgba(43,35,30,0.10)',
        'lift': '0 2px 6px rgba(43,35,30,0.06), 0 20px 40px -12px rgba(43,35,30,0.18)',
        'glow': '0 8px 30px -8px rgba(236,79,53,0.45)',
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(60% 80% at 15% 10%, rgba(247,177,42,0.20), transparent 60%), radial-gradient(50% 60% at 90% 20%, rgba(236,79,53,0.22), transparent 60%), radial-gradient(80% 80% at 50% 120%, rgba(217,53,24,0.18), transparent 60%)',
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(1rem)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "fade-out": "fade-out 150ms ease-in",
        "fade-up": "fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 150ms ease-out",
        "slide-in-right": "slide-in-right 200ms ease-out",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
