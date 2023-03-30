// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue';
import "@gouvfr/dsfr/dist/dsfr.min.css";
import '@gouvfr/dsfr/dist/dsfr.module';
import { LoadingPlugin } from "vue-loading-overlay";
import 'vue-loading-overlay/dist/css/index.css';

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.use(LoadingPlugin);
  }
};
