<template>
  <table>
    <caption>
      Ce tableau permet de suivre et de rendre compte de l’ouverture des jeux de données, algorithmes, codes sources et API publics.
    </caption>
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :style="column.width ? `width: ${column.width}` : ''"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows">
        <td
          v-for="column in columns"
          :key="`record-${index}-${column.key}`"
          v-html="display(row, column)"
        ></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  rows: {
    /** @type {import("vue").PropType<Array<import("../types").Row>>} */
    type: Array,
    required: true,
  },
  columns: {
    /** @type {import("vue").PropType<Array<import("../types").Column>>} */
    type: Array,
    required: true,
  },
});

/**
 * 
 * @param {object} row 
 * @param {import("../types").Column} column 
 * @returns {string}
 */
function display(row, column) {
  const format = column.format;
  if (format) {
    return format(row[column.key], row);
  } else {
    return row[column.key];
  }
}
</script>

<style scoped>
table {
  width: 100%;
}
</style>
