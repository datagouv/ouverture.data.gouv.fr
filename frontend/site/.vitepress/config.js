import { defineConfigWithTheme } from 'vitepress'
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

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
    config: (md) => {
      // use more markdown-it plugins!
      md.renderer.rules.table_open  = function () { return '<div class="fr-table fr-table--no-caption"><table>'; };
      md.renderer.rules.table_close  = function () { return '</table></div>'; };
    }
  },
  themeConfig: {
    yoyo: "tutu",
    hvdApiUrl: process.env.VUE_APP_HVD_API_URL,
    engagementApiUrl: process.env.VUE_APP_ENGAGEMENT_API_URL,
    huhuh: "nubn"
  }
});
