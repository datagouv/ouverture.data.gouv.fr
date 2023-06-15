// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue';
import "@gouvfr/dsfr/dist/dsfr.min.css";
import matomo from "@conciergerie.dev/vitepress-plugin-matomo";

/** @type {import("vitepress").Theme} */
export default {
  Layout,
  async enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      await import('@gouvfr/dsfr/dist/dsfr.module');
    }
    matomo({
      router,
      siteID: 189,
      trackerUrl: "https://stats.data.gouv.fr/",
    });
  }
};
