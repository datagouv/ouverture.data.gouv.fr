<template />

<script>
import axios from "axios";

export default {
  name: "InventoryDataAirtable",
  props: ["fields", "statuses"],
  data() {
    return {
      api: "https://api.airtable.com/v0/",
      base: "appISQqfvRPMg6CH3/Suivi",
      key: "",
    };
  },
  mounted() {
    axios({
      url: `${this.api}${this.base}`,
      headers: {
        Authorization: `Bearer ${this.key}`,
      },
    }).then((res) => {
      const datasets = this.tranformRecords(res.data.records);
      this.$emit("input", datasets);
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
