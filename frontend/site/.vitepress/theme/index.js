// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue';
import "@gouvfr/dsfr/dist/dsfr.min.css";

/** @type {import("vitepress").Theme} */
export default {
  Layout,
  async enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      await import('@gouvfr/dsfr/dist/dsfr.module');
    }
  }
};
