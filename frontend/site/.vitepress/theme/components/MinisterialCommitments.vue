<template>
    <div>
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
            <Select class="fr-col-12 fr-col-sm-6" name="select-department" placeholder="Tous les ministères" label="Ministère" :options="departments" v-model="filters.department"/>
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
                    <th>Ministère</th>
                    <th>Statut</th>
                    <th>Date estimée</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="commitment in filteredCommitments">
                        <td><a :href="commitment['URL']">{{ commitment['TITRE'] }}</a></td>
                        <td>{{ commitment['PRODUCTEUR'] }}</td>
                        <td>
                            <p class="fr-badge fr-badge--sm fr-badge--no-icon" :class="{
                                'fr-badge--success': commitment['STATUT'] == 'Disponible sur data.gouv.fr',
                                'fr-badge--info': commitment['STATUT'] == 'Disponible',
                                'fr-badge--error': commitment['STATUT'] == 'Non disponible',
                                'fr-badge--warning': commitment['STATUT'] == 'Planifié',
                            }">{{ commitment['STATUT'] }}</p>
                        </td>
                        <td>{{ commitment['DATE ESTIMÉE'] }}</td>
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
        department: null,
        status: null,
    }
})

const loading = ref<'loading' | 'failed' | 'done'>('loading')
const commitments = ref<Array<{
    'TITRE': string;
    'URL': string;
    'STATUT': string;
    'PRODUCTEUR': string;
    'DATE ESTIMÉE': string;
}>>([])

const departments = computed(() => Array.from(new Set(commitments.value.map((commitment) => commitment['PRODUCTEUR']))));
const statuses = computed(() => Array.from(new Set(commitments.value.map((commitment) => commitment['STATUT']))));

const filteredCommitments = computed(() => commitments.value.filter((commitment) => {
    if (filters.department && filters.department !== commitment['PRODUCTEUR']) return false
    if (filters.status && filters.status !== commitment['STATUT']) return false

    return true
}))

const load = async () => {
    const { theme } = useData();
    const { apiUrl } = theme.value;

    try {
        const response = await fetch(`${apiUrl}/ministerial_commitments`)
        commitments.value = await response.json()
        loading.value = 'done'
    } catch (e) {
        console.error(e)
        loading.value = 'failed'
    }
}

onMounted(() => load())
</script>