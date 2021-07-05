<template>
  <div v-if="!loading">
    <div>
      <ul class="fr-tags-group">
        <li v-for="s in statuses">
          <a
            href="#"
            class="fr-tag"
            :class="[!s.visible ? '' : s._class]"
            @click="toggle(s.key)"
          >
            {{ counters[s.key] }} {{ s.labelExtended }}
          </a>
        </li>
      </ul>

      <label class="fr-label" for="table-filter">Filtrer le tableau</label>
      <input
        id="table-filter"
        v-model="query"
        name="table-filter"
        type="text"
        class="fr-input fr-mb-2w"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />

      <table class="fr-table fr-table--no-caption">
        <caption>
          Tableau des jeux de données concernés par le CITP
        </caption>
        <thead>
          <tr>
            <th v-for="column in columns">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dataset in filteredSortedDatasets">
            <td v-for="column in columns" v-html="display(dataset, column)" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else>
    <em>Données en cours de chargement...</em>
  </div>
</template>

<script>
import axios from 'axios';

// Les colonnes à afficher ainsi que leur titre
const fields = {
  'Données, API ou code source': 'Type',
  'Données, API, Codes sources concernés': 'Titre',
  Ministère: 'Organisation',
  "Etat d'avancement": 'Statut d’ouverture',
  'Échéance annoncée par les ministères': 'Date estimée de publication'
}

// Formattage des cellules
const format = {
  'Statut d’ouverture': (cell, row) =>
    `<span class="fr-tag ${row.status._class}">${cell}</a>`,
  Titre: (cell, row) =>
    row.raw.URL ? `<a href="${row.raw.URL}">${cell}</a>` : cell
}

export default {
  name: 'Inventory',
  data () {
    return {
      api: 'https://api.airtable.com/v0/',
      base: 'appISQqfvRPMg6CH3/Suivi',
      key: '',
      statuses: [
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
      ],
      loading: true,
      query: '',
      datasets: [],
      columns: Object.values(fields)
    }
  },
  computed: {
    filteredDatasets() {
      let datasets = this.datasets;

      datasets = datasets.filter( d => d.status.visible == true )

      if (this.query.length < 3) return datasets;
      return datasets.filter(dataset => {
        return Object.keys(dataset).some(field => {
          if (!dataset[field] || !dataset[field].toLowerCase) return false;
          return dataset[field]
            .toLowerCase()
            .includes(this.query.toLowerCase());
        })
      });
    },
    filteredSortedDatasets() {
      return this.filteredDatasets.sort((a, b) => {
        const ta =
          a['Date estimée de publication'].split(' ')[1] +
          a['Date estimée de publication'].split(' ')[0]
        const tb =
          b['Date estimée de publication'].split(' ')[1] +
          b['Date estimée de publication'].split(' ')[0]
        return ta.localeCompare(tb);
      })
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
    }
  },
  mounted () {
    this.fetchProxy()
  },
  methods: {
    fetchData() {
      axios({
        url: `${this.api}${this.base}`,
        headers: {
          Authorization: `Bearer ${this.key}`
        }
      }).then(res => {
        this.datasets = this.tranformRecords(res.data.records)
      });
    },
    fetchProxy() {
      axios.get(`${this.$themeConfig.apiUrl}/inventaire`).then(res => {
        this.datasets = this.tranformRecords(res.data.records);
        this.loading = false;
      });
    },
    tranformRecords(records) {
      return records.map(record => {
        const row = {};

        Object.entries(fields).forEach(([field, column]) => {
          row[column] = record.fields[field]
        });

        row.raw = record.fields
        row.status = this.statuses.find(
          s => s.label == row['Statut d’ouverture']
        )
        row.visible = true

        return row
      });
    },
    toggle (badge) {
      const status = this.statuses.find(s => s.key == badge)
      status.visible = !status.visible
    },
    display (row, column) {
      if (format[column]) {
        return format[column](row[column], row)
      } else {
        return row[column]
      }
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
