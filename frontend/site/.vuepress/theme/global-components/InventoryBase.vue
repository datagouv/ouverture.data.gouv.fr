<template>
  <div>
    <InventoryDataProxy
      v-model="datasets"
      :fields="fields"
      :statuses="statuses"
    />

    <div v-if="datasets.length > 0">
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

        <InventoryTable
          :datasets="filteredSortedDatasets"
          :format="format"
          :columns="columns"
        />
      </div>
    </div>
    <div v-else>
      <em>Données en cours de chargement...</em>
    </div>
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
  name: 'InventoryBase',
  data () {
    return {
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
      columns: Object.values(fields),
      fields: fields,
      format: format
    }
  },
  computed: {
    filteredDatasets() {
      let datasets = this.datasets;

      datasets = datasets.filter(d => d.status.visible == true);

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
  mounted () {},
  methods: {
    toggle (badge) {
      const status = this.statuses.find(s => s.key == badge)
      status.visible = !status.visible
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
