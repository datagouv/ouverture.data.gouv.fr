<template>
  <div>
    <InventoryDataProxy
      :mapping="mapping"
      :statuses="statuses"
      @input="updateDatasets"
    />

    <div v-if="datasets.length > 0">
      <InventoryFilter
        @change="updateFilters"
        :organizations="organizations"
        :statuses="statuses"
        :trimesters="trimesters"
        :types="types"
      />

      <InventoryTable :datasets="filteredSortedDatasets" :columns="mapping" />

      <p v-if="lastModified">Dernière modification : {{ formatDate(lastModified) }}</p>
    </div>
    <div v-else>
      <em>Données en cours de chargement...</em>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { computed, reactive, ref } from "vue";
import InventoryDataProxy from "./InventoryDataProxy.vue";
import InventoryFilter from "./InventoryFilter.vue";
import InventoryTable from "./InventoryTable.vue";

dayjs.extend(quarterOfYear);

/**
 * @type {Array<import("./types").Column>}
 */
const mapping = [
  {
    key: "type",
    label: "Type",
    source: "Données, API ou code source",
  },
  {
    key: "title",
    label: "Titre",
    source: "Données, API, Codes sources concernés",
    format: (cell, row) =>
      row.raw.URL ? `<a href="${row.raw.URL}">${cell}</a>` : cell,
  },
  {
    key: "organization",
    label: "Ministère",
    source: "Ministère",
  },
  {
    key: "status",
    label: "Statut d’ouverture",
    source: "État d'avancement",
    format: (cell, row) =>
      `<span class="fr-tag ${row.status._class}">${cell.label}</a>`,
    width: "12em",
  },
  {
    key: "date",
    label: "Date estimée de publication",
    source: "Échéance annoncée par les ministères",
    format: (cell, row) => {
      const date = row.date;
      const [trimester, year] = date.split(" ");
      const now = dayjs();

      if (
        row.status.key != "open" &&
        now.year() >= parseInt(year) &&
        now.quarter() > parseInt(trimester[1])
      ) {
        return `T${now.quarter()} ${now.year()}`;
      } else {
        return `${trimester} ${year}`;
      }
    },
  },
];



/**
 * @type {Array<import("./types").Status>}
 */
const statuses = [
  {
    label: "Disponible",
    key: "open",
    visible: true,
    _class: "green",
    labelExtended: "disponbiles",
  },
  {
    label: "Planifié",
    key: "opening",
    visible: true,
    _class: "yellow",
    labelExtended: "planifiés",
  },
  {
    label: "Non disponible",
    key: "notopen",
    visible: true,
    _class: "red",
    labelExtended: "non disponibles",
  },
];

/** @type {import("vue").Ref<Array<import("./types").Dataset>>} */
const datasets = ref([]);

/** @type {import("vue").Ref<string | null>} */
const lastModified = ref(null);
const query = ref("");

/** @type {import("vue").UnwrapNestedRefs<import("./types").Filters>} */
const filters = reactive({
  organization: "",
  status: "",
  trimester: "",
  type: "",
});

const filteredDatasets = computed(() => {
  let filtered = datasets.value
    .filter((d) => d.status.visible == true)
    .filter((d) => !filters.type || d.type == filters.type)
    .filter(
      (d) => !filters.status || d.status.label == filters.status
    )
    .filter((d) => !filters.organization || d.organization == filters.organization)
    .filter(
      (d) => !filters.trimester || d.date == filters.trimester
    );

  if (query.value.length < 3) return filtered;

  filtered = filtered.filter((dataset) => {
    return Object.keys(mapping).some((field) => {
      if (!dataset[field] || !dataset[field].toLowerCase) return false;

      return dataset[field]
        .toLowerCase()
        .includes(query.value.toLowerCase());
    });
  });

  return filtered;
});

const filteredSortedDatasets = computed(() => {
  return filteredDatasets.value.slice().sort(compareTrimesters);
});

const counters = computed(() => {
  /** @type {{[key in import("./types").StatusKey]: number}} */
  const count = {
    closed: 0,
    opening: 0,
    preview: 0,
    open: 0,
    notopen: 0,
  };
  filteredDatasets.value.forEach((dataset) => {
    const value = dataset.status;
    const status = statuses.find((s) => s.label == value.label);
    if (status) {
      count[status.key] += 1;
    }
  });
  return count;
});

const organizations = computed(() => {
  const organizationNames = datasets.value.map((dataset) => dataset.organization);
  const orgs = Array.from(new Set(organizationNames))
    .map((name) => ({
      label: name,
      key: name,
      count: filteredDatasets.value.filter((dataset) => dataset.organization == name).length,
    }));
  orgs.sort((a, b) => b.count - a.count);
  return orgs;
});

const trimesters = computed(() => {
  const trimesters = Array.from(new Set(
      datasets.value
        .sort(compareTrimesters)
        .map((dataset) => dataset.date)
    ));
  return trimesters.map((trimester) => ({ label: trimester, key: trimester }));
});

/** @type {import("vue").ComputedRef<Array<import("./types").Option>>} */
const types = computed(() => {
  const types = Array.from(new Set(datasets.value.map((dataset) => dataset.type)));
  return types.map((type) => ({ label: type, key: type }));
});

/**
 * Format two trimesters for comparison and compare them
 * @param {import("./types").Dataset} a 
 * @param {import("./types").Dataset} b
 * @returns {number}
 */
function compareTrimesters(a, b) {
  const ta = a.date.split(" ")[1] + a.date.split(" ")[0];
  const tb = b.date.split(" ")[1] + b.date.split(" ")[0];
  return ta.localeCompare(tb);
}

/**
 * Toggle status visibility
 * @param {string} badge 
 */
function toggle(badge) {
  const status = statuses.find((status) => status.key == badge);
  if(status) {
    status.visible = !status.visible;
  }
}

/**
 * Parse string as date and format it
 * @param {string} str 
 */
function formatDate(str) {
  return dayjs(str).format("DD/MM/YYYY");
}

/**
 * Update Datasets from server request
 * @param {{datasets: Array<import("./types").Dataset>, lastModified: string}} event 
 */
function updateDatasets(event) {
  datasets.value = event.datasets;
  lastModified.value = event.lastModified;
}

/**
 * Update filters after select event
 * @param {import("./types").Filters} newFilters 
 */
function updateFilters(newFilters) {
  filters.organization = newFilters.organization;
  filters.status = newFilters.status;
  filters.trimester = newFilters.trimester;
  filters.type = newFilters.type;
}

</script>

<style>
.fr-tag.green {
  background-color: #00ac8c;
  color: white;
}
.fr-tag.yellow {
  background-color: #fdcf41;
}
.fr-tag.red {
  background-color: #ff6f4c;
}
</style>
