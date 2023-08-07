import { defineConfigWithTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
/**
 * @typedef {{apiUrl: string}} OuvertureThemeConfig
 */

/** @type {import("vitepress").UserConfig<OuvertureThemeConfig>} */
export default defineConfigWithTheme({
  outDir: "../../dist",
  title: "Ouverture data.gouv.fr",
  description: "Tableau de suivi des ouvertures de données, codes sources et API publics",
  cleanUrls: true,
  head: [
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest', crossorigin: 'use-credentials' }],
  ],
  markdown: {
    externalLinks: { target: "" },
  },
  themeConfig: {
    apiUrl: process.env.VUE_APP_API_URL || "http://localhost:5000/api",
  }
});
