<template>
  <main>
    <Header />
    <div class='fr-container'>
      <Content />
    </div>
    <Footer />
  </main>
</template>

<style>
main {
    display: flex;
    flex-direction: column;
}

main > div {
    flex-grow: 1;
}
</style>

<script>
import Header from '../components/Header'
import Footer from '../components/Footer'

export default {
  components: {
    Header, Footer
  }
}
</script>
