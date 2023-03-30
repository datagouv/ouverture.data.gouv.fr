<script setup>
import { useData } from "vitepress";
import HeaderComponent from "./components/Header.vue";
import FooterComponent from "./components/Footer.vue";

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
  <HeaderComponent :title="site.title" :description="site.description" />
  <main class="fr-container fr-py-6w">
    <Content />
  </main>
  <FooterComponent />
</template>
