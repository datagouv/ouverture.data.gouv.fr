<template>
  <div>
    <div v-if="rows.length > 0">
      <InventoryFilter
        @change="updateFilters"
        :organizations="organizations"
        :statuses="statuses"
        :trimesters="trimesters"
        :types="types"
        ref="filtersComponent"
      />
      <div class="fr-table fr-table--no-caption">
        <InventoryTable :rows="filteredSortedRows" :columns="mapping" />
        <p v-if="nextCursor" class="fr-mt-2w">
          <button @click="loadMore" class="fr-btn fr-btn--sm">Charger plus de résultats</button>
        </p>
      </div>

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
import useDataProxy from "../composables/dataProxy";
import InventoryFilter from "./InventoryFilter.vue";
import InventoryTable from "./InventoryTable.vue";

dayjs.extend(quarterOfYear);

/**
 * @type {Array<import("../types").Column>}
 */
const mapping = [
  {
    key: "type",
    label: "Type",
  },
  {
    key: "title",
    label: "Titre",
    format: (cell, row) =>
      row.url ? `<a href="${row.url}">${cell}</a>` : cell,
  },
  {
    key: "organization",
    label: "Ministère",
  },
  {
    key: "status",
    label: "Statut d’ouverture",
    format: (cell, row) =>
      `<span class="fr-badge fr-badge--no-icon ${row.status._class}">${cell.label}</a>`,
    width: "12em",
  },
  {
    key: "date",
    label: "Date estimée de publication",
    format: (cell, row) => {
      const date = row.date;
      if(!date) {
        return "";
      }
      const [trimester, year ] = date.split(" ");
      const now = dayjs();

      if (
        row.status.key != "open" &&
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

const { rows, lastModified, nextCursor, getData } = useDataProxy(mapping, statuses);

const query = ref("");

/** @type {import("vue").Ref<InstanceType<typeof import("./InventoryFilter.vue")> | null>} */
const filtersComponent = ref(null);

/** @type {import("vue").UnwrapNestedRefs<import("../types").Filters>} */
const filters = reactive({
  organization: "",
  status: "",
  trimester: "",
  type: "",
});

const filteredRows = computed(() => {
  let filtered = rows
    .filter((d) => !filters.type || d.type == filters.type)
    .filter(
      (d) => !filters.status || d.status.label == filters.status
    )
    .filter((d) => !filters.organization || d.organization == filters.organization)
    .filter(
      (d) => !filters.trimester || d.date == filters.trimester
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
  const organizationNames = rows.map((row) => row.organization);
  const orgs = Array.from(new Set(organizationNames))
    .map((name) => ({
      label: name,
      key: name,
      count: filteredRows.value.filter((/** @type {import("../types").Row} */ row) => row.organization == name).length,
    }));
  orgs.sort((a, b) => b.count - a.count);
  return orgs;
});

const trimesters = computed(() => {
  const trimesters = Array.from(new Set(
      rows
        .sort(compareTrimesters)
        .map((/** @type {import("../types").Row} */ row) => row.date)
    ));
  return trimesters.map((trimester) => ({ label: trimester, key: trimester }));
});

/** @type {import("vue").ComputedRef<Array<import("../types").Option>>} */
const types = computed(() => {
  const types = Array.from(new Set(rows.map((/** @type {import("../types").Row} */ row) => row.type)));
  return types.map((type) => ({ label: type, key: type }));
});

/**
 * Format two trimesters for comparison and compare them
 * @param {import("../types").Row} a 
 * @param {import("../types").Row} b
 * @returns {number}
 */
function compareTrimesters(a, b) {
  const ta = a.date ? a.date.split(" ")[1] + a.date.split(" ")[0] : "";
  const tb = b.date ? b.date.split(" ")[1] + b.date.split(" ")[0] : "";
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
  filters.trimester = newFilters.trimester;
  filters.type = newFilters.type;
}

function loadMore() {
  getData(nextCursor.value);
  if(filtersComponent.value) {
    filtersComponent.value.reset();
  }
}
</script>
