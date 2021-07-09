module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["vuepress", "plugin:vue/essential", "standard", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {},
};
