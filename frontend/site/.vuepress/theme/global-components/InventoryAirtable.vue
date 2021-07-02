<template>
  <div>

    <h1 class="fr-mt-4w">Inventaire des données à ouvrir</h1>

    <ul class="fr-tags-group">
      <li v-for="s in statuses">
        <a href="#" @click="toggle(s.key)" class="fr-tag" :class="[!s.visible ? 'disabled' : '', s._class]">
          {{ counters[s.key] }} {{ s.labelExtended }}
        </a>
      </li>
    </ul>

    <label class="fr-label" for="table-filter">Filtrer le tableau</label>
    <input v-model="query" id="table-filter" name="table-filter" type="text" class="fr-input fr-mb-2w" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">

    <table class="fr-table fr-table--no-caption">
      <caption>Tableau des jeux de données concernés par le CITP</caption>
      <thead>
        <tr>
          <th v-for="column in columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dataset in filteredSortedDatasets">
          <td v-for="column in columns" v-html='display(dataset, column)' />
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import axios from 'axios'

// Les colonnes à afficher ainsi que leur titre
const fields = {
  'Données, API ou code source': 'Type',
  'Données, API, Codes sources concernés' : 'Titre',
  'Ministère' : 'Organisation',
  'Etat d\'avancement': 'Statut d’ouverture',
  'Échéance annoncée par les ministères': 'Date estimée de publication'
}

// Formattage des cellules
const format = {
  'Statut d’ouverture': (cell, row) => `<span class="fr-tag ${row.status._class}">${ cell }</a>`,
  'Titre': (cell, row) => (row.raw.URL) ? `<a href="${ row.raw.URL }">${ cell }</a>` : cell
}

export default {
  name: 'Inventory',
  data () {
    return {
      api: 'https://api.airtable.com/v0/',
      base: 'appISQqfvRPMg6CH3/Suivi',
      key: '',
      statuses: [
        {label: "Disponible", key: "open", visible: true, _class: "green", labelExtended: "disponbiles"},
        {label: "Planifié", key: "opening", visible: true, _class: "yellow", labelExtended: "planifiés"},
      ],
      loading: true,
      query: '',
      datasets: [],
      columns: Object.values(fields)
    }
  },
  methods: {
    fetchData(){
      axios({
        url: `${this.api}${this.base}`,
        headers: {
          'Authorization': `Bearer ${this.key}`
        }
      }).then((res) => {
        this.datasets = this.tranformRecords(res.data.records)
      })
    },
    fetchProxy(){
      axios.get(`${this.$themeConfig.apiUrl}/inventaire`).then((res) => {
        this.datasets = this.tranformRecords(res.data.records)
      })
    },
    tranformRecords(records){
      return records.map(record => {
        let row = {}

        Object.entries(fields).forEach(([field, column]) => {
          row[column] = record.fields[field]
        })

        row.raw = record.fields
        row.status = this.statuses.find(s => s.label == row['Statut d’ouverture'])
        row.visible = true

        return row
      })
    },
    toggle (badge) {
      const status = this.statuses.find(s => s.key == badge)
      status.visible = !status.visible
    },
    display (row, column) {
      if(format[column]){
        return format[column](row[column], row)
      } else {
        return row[column]
      }
    }
  },
  mounted () {
    this.fetchProxy()
  },
  computed: {
    filteredDatasets () {
      if (this.query.length < 3) return this.datasets
      return this.datasets.filter(dataset => {
        return Object.keys(dataset).some(field => {
          if (!dataset[field] || !dataset[field].toLowerCase) return false
          return dataset[field].toLowerCase().includes(this.query.toLowerCase())
        })
      })
    },
    filteredSortedDatasets () {
      return this.filteredDatasets.sort((a,b) => {
        let ta = a['Date estimée de publication'].split(' ')[1]+a['Date estimée de publication'].split(' ')[0]
        let tb = b['Date estimée de publication'].split(' ')[1]+b['Date estimée de publication'].split(' ')[0]
        return ta.localeCompare(tb)
      })
    },
    counters () {
      const count = {
        'closed': 0,
        'opening': 0,
        'preview': 0,
        'open': 0
      }
      this.filteredDatasets.forEach(dataset => {
        const value = dataset['Statut d’ouverture']
        const status = this.statuses.find(s => s.label == value)
        if (status) {
          count[status.key] += 1
        }
      })
      return count
    }
  }
}
</script>

<style>
.fr-tag.green {
  background-color: #00AC8C;
}
.fr-tag.yellow {
  background-color: #FFE800;
}
</style>
