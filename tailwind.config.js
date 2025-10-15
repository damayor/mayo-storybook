module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  // Toggle dark-mode based on .dark class or data-mode="dark"
  darkMode: ['class', '[data-mode="dark"]'], 
  safelist: [
    "text-primary",
    "text-secondary",
    "text-accent",
    "text-neutral",
    "text-info",
    "btn-primary",
    "btn-secondary",
    "btn-accent",
    "btn-neutral",
    "btn-info",
    "btn-success",
    "btn-warning",
    "btn-error",
    "badge-primary",
    "badge-secondary",
    "badge-accent",
    "badge-neutral",
    "badge-info",

  ],
  plugins: [
    import("daisyui")
  ],
  daisyui: {
    themes: ["light", "dark"], 
  },
};