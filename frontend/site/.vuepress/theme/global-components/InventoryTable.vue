<template>
  <table class="fr-table fr-table--no-caption">
    <caption>
      Tableau des jeux de données concernés par le CITP
    </caption>
    <thead>
      <tr>
        <th v-for="column in columns">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="dataset in datasets">
        <td v-for="column in columns" v-html="display(dataset, column)" />
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "InventoryTable",
  props: ["datasets", "format", "columns"],
  methods: {
    display(row, column) {
      if (this.format && this.format[column]) {
        return this.format[column](row[column], row);
      } else {
        return row[column];
      }
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
}
</style>
