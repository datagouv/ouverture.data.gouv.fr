<script setup>
import { useData } from "vitepress";
import HeaderComponent from "./components/Header.vue";
import FooterComponent from "./components/Footer.vue";
import HeroComponent from "./components/HeroComponent.vue"; 

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
  <HeaderComponent :title="site.title" :description="site.description" />
  <HeroComponent v-if="frontmatter.home" />
  <main class="fr-container fr-py-6w">
    <Content />
  </main>
  <FooterComponent />
</template>

<style>
.fr-btn {
    --background-action-high-blue-france: var(--blue-cumulus-sun-368-moon-732);
    --background-action-high-blue-france-hover: var(--blue-cumulus-sun-368-moon-732-hover);
    --background-action-high-blue-france-active: var(--blue-cumulus-sun-368-moon-732-active);
    border-radius: 3em;
    font-size: 0.875rem;
}
</style>