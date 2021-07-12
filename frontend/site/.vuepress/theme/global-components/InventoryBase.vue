<template>
  <div>
    <InventoryDataProxy
      :mapping="mapping"
      :statuses="statuses"
      @input="
        datasets = $event.datasets;
        lastModified = $event.lastModified;
      "
    />

    <div v-if="datasets.length > 0">
      <InventoryFilter
        v-model="filters"
        :types="types"
        :statuses="statuses"
        :trimesters="trimesters"
        :organizations="organizations"
      />

      <InventoryTable :datasets="filteredSortedDatasets" :columns="columns" />

      <p>Dernière modification : {{ formatDate(lastModified) }}</p>
    </div>
    <div v-else>
      <em>Données en cours de chargement...</em>
    </div>
  </div>
</template>

<script>
import moment from "moment";

const mapping = {
  type: {
    label: "Type",
    source: "Données, API ou code source",
  },
  title: {
    label: "Titre",
    source: "Données, API, Codes sources concernés",
    format: (cell, row) =>
      row.raw.URL ? `<a href="${row.raw.URL}">${cell}</a>` : cell,
  },
  organization: {
    label: "Ministère",
    source: "Ministère",
  },
  status: {
    label: "Statut d’ouverture",
    source: "État d'avancement",
    format: (cell, row) =>
      `<span class="fr-tag ${row.status._class}">${cell.label}</a>`,
    width: "12em",
  },
  date: {
    label: "Date estimée de publication",
    source: "Échéance annoncée par les ministères",
  },
};

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

export default {
  name: "InventoryBase",
  data() {
    return {
      statuses,
      loading: true,
      query: "",
      datasets: [],
      lastModified: null,
      mapping,
      columns: Object.values(
        Object.entries(mapping).map((r) => ({ key: r[0], ...r[1] }))
      ),
      filters: {},
    };
  },
  computed: {
    filteredDatasets() {
      let datasets = this.datasets.slice();

      datasets = datasets
        .filter((d) => d.status.visible == true)
        .filter((d) => !this.filters.type || d.type == this.filters.type)
        .filter(
          (d) => !this.filters.status || d.status.label == this.filters.status
        )
        .filter((d) => !this.filters.org || d.organization == this.filters.org)
        .filter(
          (d) => !this.filters.trimester || d.date == this.filters.trimester
        );

      if (this.query.length < 3) return datasets;

      datasets = datasets.filter((dataset) => {
        return Object.keys(mapping).some((field) => {
          if (!dataset[field] || !dataset[field].toLowerCase) return false;

          return dataset[field]
            .toLowerCase()
            .includes(this.query.toLowerCase());
        });
      });

      return datasets;
    },
    filteredSortedDatasets() {
      return this.filteredDatasets.slice().sort(this.compareTrimesters);
    },
    counters() {
      const count = {
        closed: 0,
        opening: 0,
        preview: 0,
        open: 0,
        notopen: 0,
      };
      this.filteredDatasets.forEach((dataset) => {
        const value = dataset.status;
        const status = this.statuses.find((s) => s.label == value);
        if (status) {
          count[status.key] += 1;
        }
      });
      return count;
    },
    organizations() {
      let orgs = this.datasets.map((dataset) => dataset.organization);
      orgs = [...new Set(orgs)];
      orgs = orgs.map((o) => ({
        label: o,
        key: o,
        count: this.filteredDatasets.filter((d) => d.organization == o).length,
      }));
      orgs.sort((a, b) => b.count - a.count);
      return orgs;
    },
    trimesters() {
      const trimesters = [
        ...new Set(
          this.datasets
            .sort(this.compareTrimesters)
            .map((dataset) => dataset.date)
        ),
      ];
      return trimesters.map((t) => ({ label: t, key: t }));
    },
    types() {
      const types = [...new Set(this.datasets.map((dataset) => dataset.type))];
      return types.map((t) => ({ label: t, key: t }));
    },
  },
  mounted() {},
  methods: {
    compareTrimesters(a, b) {
      const ta = a.date.split(" ")[1] + a.date.split(" ")[0];
      const tb = b.date.split(" ")[1] + b.date.split(" ")[0];
      return ta.localeCompare(tb);
    },
    toggle(badge) {
      const status = this.statuses.find((s) => s.key == badge);
      status.visible = !status.visible;
    },
    formatDate(str) {
      return moment(str).format("DD/MM/YYYY");
    },
  },
};
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
