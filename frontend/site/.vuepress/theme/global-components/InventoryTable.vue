<template>
  <table class="fr-table fr-table--no-caption">
    <caption>
      Tableau des jeux de données concernés par le CITP
    </caption>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="`col-${column.key}`"
          :style="column.width ? `width: ${column.width}` : ''"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(dataset, index) in datasets" :key="`record-${index}`">
        <td
          v-for="column in columns"
          :key="`record-${index}-${column.key}`"
          v-html="display(dataset, column)"
        />
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "InventoryTable",
  props: ["datasets", "columns"],
  methods: {
    display(row, column) {
      const format = column.format;
      if (format) {
        return format(row[column.key], row);
      } else {
        return row[column.key];
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
