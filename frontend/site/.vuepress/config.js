module.exports = {
  dest: '../dist',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "Tableau de suivi des ouvertures de données, codes sources et API publics",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: "",

  markdown: {
    anchor: { permalink: false }
  },

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ],
    ['link', { rel: 'icon', href: '/assets/favicons/favicon.ico' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    subdomain: 'economiecirculaire',
    apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [],
    sidebar: {}
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: []
}
