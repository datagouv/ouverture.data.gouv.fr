<script setup>
defineProps({
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  République
                  <br />Française
                </p>
              </div>
              <div class="fr-header__navbar">
                <button class="fr-btn--menu fr-btn" data-fr-opened="false" aria-controls="modal-833" aria-haspopup="menu" title="Menu">
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <a href="/">
                <p class="fr-header__service-title">{{ title }}</p>
              </a>
              <p class="fr-header__service-tagline">{{ description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-header__menu fr-modal" id="modal-833" aria-labelledby="button-834">
      <div class="fr-container">
        <button class="fr-link--close fr-link" aria-controls="modal-833">Fermer</button>
        <div class="fr-header__menu-links"></div>
        <nav class="fr-nav" id="navigation-832" role="navigation" aria-label="Menu principal">
          <ul class="fr-nav__list">
            <li class="fr-nav__item">
              <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/datasets" target="_self">Données</a>
            </li>
            <li class="fr-nav__item">
              <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/dataservices" target="_self">API</a>
            </li>
            <li class="fr-nav__item">
              <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/reuses" target="_self">Réutilisations</a>
            </li>
            <li class="fr-nav__item">
              <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/organizations" target="_self">Organisations</a>
            </li>
            <li class="fr-nav__item">
              <button class="fr-nav__btn" aria-expanded="false" aria-controls="Commencer sur data.gouv.fr">Commencer sur data.gouv.fr</button>
              <div class="fr-collapse fr-menu" id="Commencer sur data.gouv.fr">
                  <ul class="fr-menu__list">
                      <li>
                          <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/pages/about/a-propos_data-gouv/" target="_self">Qu'est-ce que data.gouv.fr ?</a>
                      </li>
                      <li>
                          <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/pages/onboarding/producteurs/" target="_self">Comment publier des données ?</a>
                      </li>
                      <li>
                          <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/pages/onboarding/reutilisateurs/" target="_self">Comment exploiter des données ?</a>
                      </li>
                  </ul>
              </div>
          </li>
            <li class="fr-nav__item">
              <a class="fr-nav__link" href="https://www.data.gouv.fr/fr/posts" target="_self">Actualités</a>
            </li>
            <li class="fr-nav__item">
              <a class="fr-nav__link" href="https://support.data.gouv.fr/" target="_self">Nous contacter</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>
