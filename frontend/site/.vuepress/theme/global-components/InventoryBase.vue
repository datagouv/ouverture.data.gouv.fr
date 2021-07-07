<template>
  <div>
    <InventoryDataProxy
      @input="datasets = $event.datasets; lastModified = $event.lastModified; "
      :fields="fields"
      :statuses="statuses"
    />

    <div v-if="datasets.length > 0">
      <InventoryFilter
        v-model="filters"
        :statuses="statuses"
        :trimesters="trimesters"
        :organizations="organizations"
      />

      <InventoryTable
        :datasets="filteredSortedDatasets"
        :format="format"
        :columns="columns"
      />
       
      <p>Dernière modification : {{ formatDate(lastModified) }}</p>
    </div>
    <div v-else>
      <em>Données en cours de chargement...</em>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

// Les colonnes à afficher ainsi que leur titre
const fields = {
  'Données, API ou code source': 'Type',
  'Données, API, Codes sources concernés': 'Titre',
  Ministère: 'Organisation',
  "État d'avancement": 'Statut d’ouverture',
  'Échéance annoncée par les ministères': 'Date estimée de publication'
}

// Formattage des cellules
const format = {
  'Statut d’ouverture': (cell, row) =>
    `<span class="fr-tag ${row.status._class}">${cell}</a>`,
  Titre: (cell, row) =>
    row.raw.URL ? `<a href="${row.raw.URL}">${cell}</a>` : cell
}

const statuses = [
  {
    label: "Disponible",
    key: "open",
    visible: true,
    _class: "green",
    labelExtended: "disponbiles"
  },
  {
    label: "Planifié",
    key: "opening",
    visible: true,
    _class: "yellow",
    labelExtended: "planifiés"
  }
]

export default {
  name: 'InventoryBase',
  data () {
    return {
      statuses,
      loading: true,
      query: '',
      datasets: [],
      lastModified: null,
      columns: Object.values(fields),
      filters: {}
      fields,
      format
    }
  },
  computed: {
    filteredDatasets() {
      let datasets = this.datasets;

      datasets = datasets
        .filter(d => d.status.visible == true)
        .filter(d => !this.filters.status || d["Statut d’ouverture"] == this.filters.status)
        .filter(d => !this.filters.org || d["Organisation"] == this.filters.org)
        .filter(d => !this.filters.trimester || d["Date estimée de publication"] == this.filters.trimester);

      if (this.query.length < 3) return datasets;

      datasets = datasets.filter(dataset => {
        return Object.keys(dataset).some(field => {

          if (!dataset[field] || !dataset[field].toLowerCase) return false;

          return dataset[field]
            .toLowerCase()
            .includes(this.query.toLowerCase());
        })
      });

      return datasets
    },
    filteredSortedDatasets() {
      return this.filteredDatasets.sort(this.compareTrimesters)
    },
    counters() {
      const count = {
        closed: 0,
        opening: 0,
        preview: 0,
        open: 0
      };
      this.filteredDatasets.forEach(dataset => {
        const value = dataset["Statut d’ouverture"];
        const status = this.statuses.find(s => s.label == value);
        if (status) {
          count[status.key] += 1;
        }
      });
      return count;
    },
    organizations () {
      let orgs = this.datasets.map(dataset => dataset['Organisation'])
      orgs = [...new Set(orgs)]
      orgs = orgs.map(o => ({
        label: o,
        key: o,
        count: this.filteredDatasets.filter(d => d['Organisation'] == o).length
      }))
      orgs.sort((a,b) => b.count - a.count)
      return orgs
    },
    trimesters () {
      let trimesters = [
        ...new Set(
          this.datasets
            .sort(this.compareTrimesters)
            .map(dataset => dataset["Date estimée de publication"])
          )
      ]
      return trimesters.map(t => ({ label: t, key: t }))
    }
  },
  mounted () {},
  methods: {
    compareTrimesters(a,b) {
      const ta =
        a['Date estimée de publication'].split(' ')[1] +
        a['Date estimée de publication'].split(' ')[0]
      const tb =
        b['Date estimée de publication'].split(' ')[1] +
        b['Date estimée de publication'].split(' ')[0]
      return ta.localeCompare(tb);
    },
    toggle (badge) {
      const status = this.statuses.find(s => s.key == badge)
      status.visible = !status.visible
    },
    formatDate (str) {
      return moment(str).format("DD/MM/YYYY")
    }
  }
}
</script>

<style>
.fr-tag.green {
  background-color: #00ac8c;
}
.fr-tag.yellow {
  background-color: #ffe800;
}
</style>
