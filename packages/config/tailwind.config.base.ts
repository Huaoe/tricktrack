import type { Config } from 'tailwindcss';

/**
 * Base Tailwind CSS v4 configuration for TrickTrack monorepo
 *
 * Note: Tailwind v4 uses CSS-based configuration for theme values via @theme inline.
 * This config file is primarily for specifying content paths and plugins.
 *
 * Design tokens (colors, spacing, etc.) are defined in CSS files using @theme inline.
 * See packages/ui/src/styles/globals.css for the theme definition.
 */
const config: Config = {
  // Content paths should be overridden by consuming packages
  content: [],

  // Common settings
  theme: {
    extend: {
      // Mobile-first breakpoints
      screens: {
        'xs': '375px',  // iPhone SE
        'sm': '640px',  // Small tablets
        'md': '768px',  // Tablets
        'lg': '1024px', // Laptops
        'xl': '1280px', // Desktops
        '2xl': '1536px',
      },

      // Touch target sizing (minimum 44px for mobile)
      spacing: {
        'touch': '44px',
      },
    },
  },

  plugins: [],
};

export default config;
