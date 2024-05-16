<template>
    <div>
        <div v-show="loading == 'done'">
            <div class="fr-mb-2w">
                <div class="fr-grid-row fr-grid-row--gutters">
                    <Select v-for="filter in filters" :key="filter.slug" class="fr-col-12 fr-col-md-6 fr-col-lg" :name="`select-${filter.slug}`" :placeholder="filter.placeholder" :label="filter.label" :options="allValues[filter.slug].value" v-model="selectedFilters[filter.slug]"/>
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
            <div class="fr-table fr-table--no-caption fr-table fr-table--layout-fixed">
                <table>
                    <thead>
                    <tr>
                        <slot name="thead" />
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(line, index) in filteredLines" :key="index">
                            <slot name="row" :line="line" />
                        </tr>
                    </tbody>
                </table>
            </div>
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

const props = withDefaults(defineProps<{
    endpoint: 'high_value_datasets' | 'ministerial_commitments';
    filters: Array<{
        slug: string;
        key_in_api: string;
        label: string;
        placeholder: string;
    }>;
    filtersSorts?: { [filterSlug: string] : { [filterValue: string] : number; } ; }
}>(), {
    filtersSorts: {}
})

// If the selected is not set, the value is undefined (the placeholder inside the `Select` has a `:value="undefined"` too)
const selectedFilters = useUrlSearchParams<{ string: string | undefined }>('history')

const resetFilters = () => {
    for (const filter of props.filters) {
        selectedFilters[filter.slug] = undefined
    }
}

const hasFilters = computed(() => {
    for (const filter of props.filters) {
        if (selectedFilters[filter.slug] !== undefined) return true
    }
    return false
})

const lines = ref<Array<any>>([])

// Build an object associating a filter slug with all the unique 
// values for this filter sorted by usage in the data.
const allValues = Object.fromEntries(
    props.filters.map((filter) => [
        filter.slug,
        computed(() => {
            const values: Array<string> = lines.value.filter(Boolean).map((line) => line[filter.key_in_api])
            const uniqueValues = Array.from(new Set(values))

            if (filter.slug in props.filtersSorts) {
                uniqueValues.sort((a, b) => (props.filtersSorts[filter.slug][a] ?? Infinity) - (props.filtersSorts[filter.slug][b] ?? Infinity));
            } else {
                uniqueValues.sort((a, b) => a.localeCompare(b));
            }

            return uniqueValues
        }),
    ])
)

const filteredLines = computed(() => {
    const results = lines.value.filter((line) => {
        // If one of the filters doesn't match, reject the line.
        for (let filter of props.filters) {
            if (selectedFilters[filter.slug] && selectedFilters[filter.slug] !== line[filter.key_in_api]) return false
        }

        return true
    })


    // Put the undefined title at the end of the table
    const fixTitle = (title) => title === 'A venir' ? 'zzzz' : title; 

    results.sort((a, b) => fixTitle(a['TITRE']).localeCompare(fixTitle(b['TITRE'])))

    return results
})

const loading = ref<'loading' | 'failed' | 'done'>('loading')
const load = async () => {
    const { theme } = useData();
    try {
        const response = await fetch(`${theme.value.apiUrl}/${props.endpoint}`)
        lines.value = await response.json()
        loading.value = 'done'
    } catch (e) {
        console.error(e)
        loading.value = 'failed'
    }
}

onMounted(() => load())
</script>