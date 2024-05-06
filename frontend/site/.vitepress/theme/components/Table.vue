<template>
    <div>
        <div class="fr-mb-2w">
            <div class="fr-grid-row fr-grid-row--gutters">
                <Select v-for="filter in filters" :key="filter.slug" class="fr-col-12 fr-col-sm-6" :name="`select-${filter.slug}`" :placeholder="filter.placeholder" :label="filter.label" :options="allValues[filter.slug].value" v-model="selectedFilters[filter.slug]"/>
            </div>
            <div v-show="hasFilters" class="fr-grid-row fr-grid-row--right fr-mt-1w">
                <div class="fr-col-auto">
                    <button
                        class="fr-btn fr-btn--tertiary fr-btn--sm"
                        type="button"
                        @click="resetFilters"
                    >
                        Ré-initialiser tous les filtres
                    </button>
                </div>
            </div>
        </div>
        <div class="fr-table fr-table--no-caption fr-table fr-table--layout-fixed" v-show="loading == 'done'">
            <table>
                <caption>
                    Ce tableau permet de suivre et de rendre compte de l’ouverture des jeux de données, algorithmes, codes sources et API publics.
                </caption>
                <thead>
                <tr>
                    <slot name="thead" />
                </tr>
                </thead>
                <tbody>
                    <tr v-for="line in filteredLines">
                        <slot name="row" :line="line" />
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

const props = defineProps<{
    endpoint: 'high_value_datasets' | 'ministerial_commitments';
    filters: Array<{
        slug: string;
        key_in_api: string;
        label: string;
        placeholder: string;
    }>
}>()

const defaultFilters = () => Object.fromEntries(props.filters.map((filter) => [filter.slug, null]))

const selectedFilters = useUrlSearchParams('history', {
    initialValue: defaultFilters(),
})

const resetFilters = () => {
    for (const key in defaultFilters()) {
        selectedFilters[key] = null
    }
}

const hasFilters = computed(() => {
    for (const key in defaultFilters()) {
        if (selectedFilters[key] !== null) return true
    }
    return false
})

const loading = ref<'loading' | 'failed' | 'done'>('loading')
const lines = ref<Array<any>>([])

const allValues = Object.fromEntries(
    props.filters.map((filter) => [
        filter.slug,
        computed(() => Array.from(new Set(lines.value.map((line) => line[filter.key_in_api])))),
    ])
)

const filteredLines = computed(() => lines.value.filter((line) => {
    for (let filter of props.filters) {
        if (selectedFilters[filter.slug] && selectedFilters[filter.slug] !== line[filter.key_in_api]) return false
    }

    return true
}))

const load = async () => {
    const { theme } = useData();
    const { apiUrl } = theme.value;

    try {
        const response = await fetch(`${apiUrl}/${props.endpoint}`)
        lines.value = await response.json()
        loading.value = 'done'
    } catch (e) {
        console.error(e)
        loading.value = 'failed'
    }
}

onMounted(() => load())
</script>