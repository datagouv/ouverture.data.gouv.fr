import { defineConfigWithTheme, loadEnv } from 'vitepress'

// https://vitepress.dev/reference/site-config
/**
 * @typedef {{hvdApiUrl: string, engagementApiUrl:string, ouvertureCrmApiUrl:string, ouvertureCrmApiUrlProducers:string}} OuvertureThemeConfig
 */

const env = loadEnv('', process.cwd())

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
    config: (md) => {
      // use more markdown-it plugins!
      md.renderer.rules.table_open  = function () { return '<div class="fr-table fr-table--no-caption"><table>'; };
      md.renderer.rules.table_close  = function () { return '</table></div>'; };
    }
  },
  themeConfig: {
    hvdApiUrl: env.VITE_HVD_API_URL ?? "",
    engagementApiUrl: env.VITE_ENGAGEMENT_API_URL ?? "",
    ouvertureCrmApiUrl: env.VITE_OUVERTURE_CRM_API_URL ?? "",
    ouvertureCrmApiUrlProducers: env.VITE_OUVERTURE_CRM_API_URL_PRODUCERS ?? "",
  }
})
