<template></template>

<script setup>
import axios from "axios";
import { useData } from "vitepress";
import { onMounted } from "vue";

const props = defineProps({
  mapping: {
    /** @type {import("vue").PropType<Array<import("./types").Column>>} */
    type: Object,
    required: true,
  },
  statuses: {
    /** @type {import("vue").PropType<Array<import("./types").Status>>} */
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['input']);

const { theme } = useData();
const { apiUrl } = theme.value;

/**
 * Transform records from API keys to mapped keys
 * @param {Array} records Records from API
 */
function tranformRecords(records) {
  return records.map((record) => {
    const row = {};

    props.mapping.forEach((col) => {
      row[col.key] = record.fields[col.source];
    });

    row.raw = record.fields;
    row.status = props.statuses.find((s) => s.label == row.status);
    row.visible = true;

    return row;
  });
}

onMounted(() => {
  axios.get(`${apiUrl}/inventaire`).then((res) => {
    /** @type {Array} */
    const records = res.data.records;
    const datasets = tranformRecords(records);

    const lastModified = records
      .map((r) => r.fields["Last Modified"])
      .sort((a, b) => b.localeCompare(a))
      .pop();
    emit("input", { datasets, lastModified });
  });
});
</script>
