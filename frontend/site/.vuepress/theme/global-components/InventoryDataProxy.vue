<template />

<script>
import axios from "axios";

export default {
  name: "InventoryDataProxy",
  props: ["fields", "statuses"],
  mounted() {
    axios.get(`${this.$themeConfig.apiUrl}/inventaire`).then((res) => {
      const datasets = this.tranformRecords(res.data.records);

      const lastModified = res.data.records
        .map((r) => r.fields["Last Modified"])
        .sort((a, b) => b.localeCompare(a))[0]; // Un peu sale mais évite d'embarquer lodash ou autre
      this.$emit("input", { datasets, lastModified });
    });
  },
  methods: {
    tranformRecords(records) {
      const _this = this;

      return records.map((record) => {
        const row = {};

        Object.entries(this.fields).forEach(([field, column]) => {
          row[column] = record.fields[field];
        });

        row.raw = record.fields;
        row.status = this.statuses.find(
          (s) => s.label == row["Statut d’ouverture"]
        );
        row.visible = true;

        return row;
      });
    },
  },
};
</script>
