<template />

<script>
import axios from "axios";

export default {
  name: "InventoryDataProxy",
  props: ["fields", "statuses"],
  mounted() {
    axios.get(`${this.$themeConfig.apiUrl}/inventaire`).then(res => {
      const datasets = this.tranformRecords(res.data.records);
      this.$emit('input', datasets)
    });
  },
  methods: {
    tranformRecords(records) {
      const _this = this;

      return records.map(record => {
        const row = {};

        Object.entries(this.fields).forEach(([field, column]) => {
          row[column] = record.fields[field];
        })

        row.raw = record.fields
        row.status = this.statuses.find(
          s => s.label == row["Statut d’ouverture"]
        );
        row.visible = true;

        return row;
      })
    }
  }
}
</script>
