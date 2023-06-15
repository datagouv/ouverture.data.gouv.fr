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
  markdown: {
    externalLinks: { target: "" },
  },
  themeConfig: {
    apiUrl: process.env.VUE_APP_API_URL || "http://localhost:5000/api",
  }
});
