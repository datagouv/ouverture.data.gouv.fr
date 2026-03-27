<template>
  <section class="hero-banner">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-6 hero-content">
          <h1 class="hero-title">Suivre les ouvertures de données publiques</h1>
          <p class="hero-subtitle">
            Les données ouvertes (open data) sont des données accessibles librement, gratuitement et réutilisables par toutes et tous.<br>
            <br>
            Ce site permet de suivre les ouvertures de données publiques annoncées ou les demandes en cours.
          </p>
        </div>
        <div class="fr-col-12 fr-col-md-6 hero-image">
          <img src="/list.svg" alt="Illustration" class="hide-on-mobile">
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  width: 100%;
  background-color: #E6EEFE;
  color: #3558A2;
  padding: 2.5rem 0;
}

.hero-content {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-title {
  font-size: 2.6rem;
  margin-bottom: 2rem;
  font-weight: 800;
  color: #3558A2;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 80%;
  height: auto;
}

/* Cacher l'image sur mobile */
@media (max-width: 768px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>

<script setup>
// Aucun script spécifique requis ici
</script>