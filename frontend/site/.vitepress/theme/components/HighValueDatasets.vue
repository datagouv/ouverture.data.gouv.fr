<template>
    <div>
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
            <Select class="fr-col-12 fr-col-sm-6" name="select-category" placeholder="Tous les ensemble de données" label="Ensemble de données" :options="categories" v-model="filters.category"/>
            <Select class="fr-col-12 fr-col-sm-6" name="select-theme" placeholder="Toutes les thématique" label="Thématique" :options="themes" v-model="filters.theme"/>
            <Select class="fr-col-12 fr-col-sm-6" name="select-department" placeholder="Tous les ministères" label="Ministère de tutelle" :options="departments" v-model="filters.department"/>
            <Select class="fr-col-12 fr-col-sm-6" name="select-producer" placeholder="Tous les producteurs" label="Producteur des données" :options="producers" v-model="filters.producer"/>
            <Select class="fr-col-12 fr-col-sm-6" name="select-status" placeholder="Tous les statuts" label="Statut" :options="statuses" v-model="filters.status"/>
        </div>
        <div class="fr-table fr-table--no-caption fr-table fr-table--layout-fixed" v-show="loading == 'done'">
            <table>
                <caption>
                    Ce tableau permet de suivre et de rendre compte de l’ouverture des jeux de données, algorithmes, codes sources et API publics.
                </caption>
                <thead>
                <tr>
                    <th>Titre</th>
                    <th>Ensemble de données</th>
                    <th>Thématique</th>
                    <th>Ministère de tutelle</th>
                    <th>Producteur</th>
                    <th>Statut</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="dataset in filteredDatasets">
                        <td><a :href="dataset['URL']">{{ dataset['TITRE'] }}</a></td>
                        <td>{{ dataset['ENSEMBLE DE DONNÉES'] }}</td>
                        <td>{{ dataset['THÉMATIQUE'] }}</td>
                        <td>{{ dataset['MINISTÈRE DE TUTELLE'] }}</td>
                        <td>{{ dataset['PRODUCTEUR'] }}</td>
                        <td>
                            <p class="fr-badge fr-badge--sm fr-badge--no-icon" :class="{
                                'fr-badge--success': dataset['STATUT'] == 'Disponible sur data.gouv.fr',
                                'fr-badge--info': dataset['STATUT'] == 'Disponible',
                                'fr-badge--error': dataset['STATUT'] == 'Non disponible',
                                'fr-badge--warning': dataset['STATUT'] == 'Planifié',
                            }">{{ dataset['STATUT'] }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <em v-show="loading == 'failed'">Impossible de récupérer les données, veuillez réessayer ultérieurement.</em>
        <em v-show="loading == 'loading'">Données en cours de chargement...</em>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Select from './Select.vue'
import { useData } from 'vitepress';
import { useUrlSearchParams } from '@vueuse/core'

const filters = useUrlSearchParams('history', {
    initialValue: {
        category: null,
        theme: null,
        department: null,
        producer: null,
        status: null,
    }
})

const loading = ref<'loading' | 'failed' | 'done'>('loading')
const datasets = ref<Array<{
    "TITRE": string;
    "STATUT": string;
    "URL": string;
    "PRODUCTEUR": string;
    "ENSEMBLE DE DONNÉES": string;
    "MINISTÈRE DE TUTELLE": string;
    "THÉMATIQUE": string;
}>>([])

const categories = computed(() => Array.from(new Set(datasets.value.map((dataset) => dataset['ENSEMBLE DE DONNÉES']))));
const themes = computed(() => Array.from(new Set(datasets.value.map((dataset) => dataset['THÉMATIQUE']))));
const departments = computed(() => Array.from(new Set(datasets.value.map((dataset) => dataset['MINISTÈRE DE TUTELLE']))));
const producers = computed(() => Array.from(new Set(datasets.value.map((dataset) => dataset['PRODUCTEUR']))));
const statuses = computed(() => Array.from(new Set(datasets.value.map((dataset) => dataset['STATUT']))));

const filteredDatasets = computed(() => datasets.value.filter((dataset) => {
    if (filters.category && filters.category !== dataset['ENSEMBLE DE DONNÉES']) return false
    if (filters.theme && filters.theme !== dataset['THÉMATIQUE']) return false
    if (filters.department && filters.department !== dataset['MINISTÈRE DE TUTELLE']) return false
    if (filters.producer && filters.producer !== dataset['PRODUCTEUR']) return false
    if (filters.status && filters.status !== dataset['STATUT']) return false

    return true
}))

const load = async () => {
    const { theme } = useData();
    const { apiUrl } = theme.value;

    try {
        const response = await fetch(`${apiUrl}/high_value_datasets`)
        datasets.value = await response.json()
        loading.value = 'done'
    } catch (e) {
        console.error(e)
        loading.value = 'failed'
    }
}

onMounted(() => load())
</script>