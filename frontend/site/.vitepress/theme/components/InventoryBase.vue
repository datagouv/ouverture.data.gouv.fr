<template>
  <div>
    <p>
      <template v-if="lastModified">Dernière modification : {{ formatDate(lastModified) }}. </template>
      <a href="https://www.data.gouv.fr/fr/datasets/tableau-de-suivi-des-ouvertures-de-donnees-codes-sources-et-api-publics">Voir le jeu de données sur data.gouv.fr</a>.
    </p>
    <div v-if="rows.length > 0">
      <InventoryFilter
        @change="updateFilters"
        :categories="categories"
        :organizations="organizations"
        :statuses="statuses"
        :types="types"
        ref="filtersComponent"
      />
      <div class="fr-table fr-table--no-caption" :class="{'fr-table--layout-fixed': !filteredSortedRows.length}">
        <InventoryTable :rows="filteredSortedRows" :columns="mappingWithLabels" />
        <p v-if="nextCursor" class="fr-mt-2w">
          <button @click="loadMore" class="fr-btn fr-btn--sm">Charger plus de résultats</button>
        </p>
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
import { computed, reactive, ref } from "vue";
import useDataProxy from "../composables/dataProxy";
import InventoryFilter from "./InventoryFilter.vue";
import InventoryTable from "./InventoryTable.vue";

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
    key: "STATUT D'OUVERTURE",
    label: "Statut",
    format: (cell, row) =>
      `<span class="fr-badge fr-badge--no-icon ${row.status?._class}">${cell}</a>`,
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
    label: "Disponible",
    key: "open",
    _class: "fr-badge--success",
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
];

const { hasError, rows, lastModified, nextCursor, getData } = useDataProxy(mapping, statuses);

const query = ref("");

/** @type {import("vue").Ref<InstanceType<typeof import("./InventoryFilter.vue")> | null>} */
const filtersComponent = ref(null);

/** @type {import("vue").UnwrapNestedRefs<import("../types").Filters>} */
const filters = reactive({
  organization: "",
  status: "",
  category: "",
  type: "",
});

const filteredRows = computed(() => {
  let filtered = rows
    .filter((d) => !filters.type || d.TYPE == filters.type)
    .filter(
      (d) => !filters.status || d.status.label == filters.status
    )
    .filter((d) => !filters.organization || d.PRODUCTEUR == filters.organization)
    .filter(
      (d) => !filters.category || d.CATEGORIE == filters.category
    );

  if (query.value.length < 3) return filtered;

  filtered = filtered.filter((row) => {
    return Object.keys(mapping).some((field) => {
      if (!row[field] || !row[field].toLowerCase) return false;

      return row[field]
        .toLowerCase()
        .includes(query.value.toLowerCase());
    });
  });

  return filtered;
});

const filteredSortedRows = computed(() => {
  return filteredRows.value.slice().sort(compareTrimesters);
});

const organizations = computed(() => {
  const organizationNames = rows.map((row) => row.PRODUCTEUR);
  const orgs = Array.from(new Set(organizationNames))
    .map((name) => ({
      label: name,
      key: name,
      count: filteredRows.value.filter((/** @type {import("../types").Row} */ row) => row.PRODUCTEUR == name).length,
    }));
  orgs.sort((a, b) => b.count - a.count);
  return orgs;
});

const categories = computed(() => {
  const categories = Array.from(new Set(rows.map((/** @type {import("../types").Row} */ row) => row.CATEGORIE)));
  return categories.map((type) => ({ label: type, key: type }));
});

/** @type {import("vue").ComputedRef<Array<import("../types").Option>>} */
const types = computed(() => {
  const types = Array.from(new Set(rows.map((/** @type {import("../types").Row} */ row) => row.TYPE)));
  return types.map((type) => ({ label: type, key: type }));
});

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

/**
 * Update filters after select event
 * @param {import("../types").Filters} newFilters 
 */
function updateFilters(newFilters) {
  filters.organization = newFilters.organization;
  filters.status = newFilters.status;
  filters.category = newFilters.category;
  filters.type = newFilters.type;
}

function loadMore() {
  getData(nextCursor.value);
  if(filtersComponent.value) {
    filtersComponent.value.reset();
  }
}
</script>
