<template>
  <div>
    <p>
      <template v-if="lastModified">Dernière modification : {{ formatDate(lastModified) }}. </template>
      <a href="https://www.data.gouv.fr/fr/datasets/tableau-de-suivi-des-ouvertures-de-donnees-codes-sources-et-api-publics">Voir le jeu de données sur data.gouv.fr</a>.
    </p>
    <div v-if="rows.length > 0">
      <InventoryFilter
        @change="updateFiltersAndUrl"
        @reset="resetFiltersAndUrl"
        :categories="categories"
        :filters="filters"
        :organizations="organizations"
        :statuses="statuses"
        :supervisors="supervisors"
        :types="types"
      />
      <div class="fr-table fr-table--no-caption" :class="{'fr-table--layout-fixed': !filteredSortedRows.length}">
        <InventoryTable :rows="filteredSortedRows" :columns="mappingWithLabels" />
      </div>
    </div>
    <div v-else>
      <em v-if="hasError">Impossible de récupérer les données, veuillez réessayer ultérieurement.</em>
      <em v-else>Données en cours de chargement...</em>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { computed, onMounted, watchEffect } from "vue";
import useDataProxy from "../composables/dataProxy";
import InventoryFilter from "./InventoryFilter.vue";
import InventoryTable from "./InventoryTable.vue";
import useFilters from "../composables/useFilters";
import useUpdateUrl from "../composables/useUpdateUrl";

dayjs.extend(quarterOfYear);

/**
 * @type {Array<import("../types").Column>}
 */
const mapping = [
  {
    key: "TYPE",
    label: "Type",
  },
  {
    key: "CATEGORIE",
    label: "Catégorie",
  },
  {
    key: "LIEN",
  },
  {
    key: "TITRE",
    label: "Titre",
    format: (cell, row) =>
      row.LIEN ? `<a href="${row.LIEN}">${cell}</a>` : cell,
  },
  {
    key: "PRODUCTEUR",
    label: "Producteur",
  },
  {
    key: "MINISTÈRE DE TUTELLE",
    label: "Ministère de tutelle",
  },
  {
    key: "STATUT D'OUVERTURE",
    label: "Statut",
    format: (cell, row) =>
      `<span class="fr-badge fr-badge--no-icon ${row.status?._class ?? ""}">${cell}</a>`,
    width: "12em",
  },
  {
    key: "DATE ESTIMÉE",
    label: "Date estimée",
    format: (cell, row) => {
      const date = cell;
      if(!date) {
        return "";
      }
      const [trimester, year ] = date.split(" ");
      const now = dayjs();

      if (
        row.status?.key != "open" &&
        now.year() >= parseInt(year) &&
        now.quarter() > parseInt(trimester[1])
      ) {
        return `T${now.quarter()} ${now.year()}`;
      } else {
        return date;
      }
    },
  },
];

const mappingWithLabels = mapping.filter(column => column.label);

/**
 * @type {Array<import("../types").Status>}
 */
const statuses = [
{
    label: "Disponible sur data.gouv.fr",
    key: "open-on-site",
    _class: "fr-badge--success",
  },
  {
    label: "Disponible",
    key: "open",
    _class: "fr-badge--info",
  },
  {
    label: "Planifié",
    key: "opening",
    _class: "fr-badge--new",
  },
  {
    label: "Non disponible",
    key: "notopen",
    _class: "fr-badge--error",
  },
  {
    label: "À déterminer",
    key: "todefine",
    _class: "",
  },
];

const { hasError, rows, lastModified, nextCursor, getData } = useDataProxy(mapping, statuses);

const { filters, filteredRows, resetFilters, updateFilters, updateFiltersFromMap, categories, organizations, supervisors, types } = useFilters(rows);

const { DONT_SAVE_TO_HISTORY, getSearchParams, updateUrl } = useUpdateUrl(filters);

/**
 * Update Filters and save them in URL as query parameters
 * @param {Record<string, string>} newFilters 
 */
function updateFiltersAndUrl(newFilters) {
  updateFilters(newFilters);
  updateUrl();
}

/**
 * Reset Filters and remove them from URL
 */
 function resetFiltersAndUrl() {
  resetFilters();
  updateUrl();
}

/**
 * Format two trimesters for comparison and compare them
 * @param {import("../types").Row} a 
 * @param {import("../types").Row} b
 * @returns {number}
 */
function compareTrimesters(a, b) {
  const ta = a["DATE ESTIMÉE"] ? a["DATE ESTIMÉE"].split(" ")[1] + a["DATE ESTIMÉE"].split(" ")[0] : "";
  const tb = b["DATE ESTIMÉE"] ? b["DATE ESTIMÉE"].split(" ")[1] + b["DATE ESTIMÉE"].split(" ")[0] : "";
  return ta.localeCompare(tb);
}

/**
 * Parse string as date and format it
 * @param {string} str 
 */
function formatDate(str) {
  return dayjs(str).format("DD/MM/YYYY");
}

async function loadMore() {
  await getData(nextCursor.value);
  updateUrl();
}

const filteredSortedRows = computed(() => {
  return filteredRows.value.slice().sort(compareTrimesters);
});

watchEffect(() => {
  if(!nextCursor.value) {
    return;
  }
  loadMore();
});

onMounted(() => {
  const params = getSearchParams();
  updateFiltersFromMap(params);
  getData(nextCursor.value);
  
  addEventListener('popstate', () => {
    const params = getSearchParams();
    updateFiltersFromMap(params);
    updateUrl(DONT_SAVE_TO_HISTORY);
  });
}); 
</script>
