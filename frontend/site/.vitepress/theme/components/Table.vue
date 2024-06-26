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
            <div
                class="fr-table fr-table--no-caption fr-table"
                :class="{'fr-table--layout-fixed': !filteredLines.length}"
            >
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
            const values = lines.value
                .filter(Boolean)
                .flatMap(line => {
                    const value = line[filter.key_in_api];
                    return Array.isArray(value) ? value : [value];
                })
                .filter(value => value !== "" && value !== null);
            // Supprimez les doublons
            const uniqueValues = Array.from(new Set(values));

            if (filter.slug in props.filtersSorts) {
                // Sort with the value provided, if the value is missing for this filter, put at the end with `Infinity`.
                uniqueValues.sort((a, b) => (props.filtersSorts[filter.slug][a] ?? Infinity) - (props.filtersSorts[filter.slug][b] ?? Infinity));
            } else {
                // Default to alphabetical sort
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
            if (selectedFilters[filter.slug] && !line[filter.key_in_api].includes(selectedFilters[filter.slug])) return false
        }

        return true
    })

    // Put the undefined titles at the end of the table
    const fixTitle = (title) => title === 'A venir' ? 'zzzz' : title; 

    results.sort((a, b) => fixTitle(a['TITRE']).localeCompare(fixTitle(b['TITRE'])))

    return results
})


const loading = ref<'loading' | 'failed' | 'done'>('loading')
const load = async () => {
    const { theme } = useData();
    try {
        let url =""
        if (props.endpoint === 'high_value_datasets') {
            url = theme.value.hvdApiUrl
        }
        if (props.endpoint === 'ministerial_commitments') {
            url = theme.value.engagementApiUrl
        }

        const response = await fetch(url)
        const results = await response.json()
        lines.value = results.records.map((item) => {
            let obj = {}
            obj["TITRE"] = item["fields"]["Titre"]
            obj["STATUT"] = item["fields"]["Statut"]
            
            if (props.endpoint === 'high_value_datasets') {
                obj["THÉMATIQUE"] = item["fields"]["Thematique"]
                
                obj["TYPE"] = item["fields"]["Type"].slice(1);
                obj["ENSEMBLE DE DONNÉES"] = item["fields"]["Ensemble_de_donnees"]

                obj["MINISTÈRE DE TUTELLE"] = [item["fields"]["Ministere_de_tutelle_Telechargement"], item["fields"]["Ministere_de_tutelle_API"]].filter(value => value !== null && value !== "");
                obj["PRODUCTEUR"] = [item["fields"]["Producteur_Telechargement"], item["fields"]["Producteur_API"]].filter(value => value !== null && value !== "");
                obj["STATUT"] = [item["fields"]["Statut_Telechargement"], item["fields"]["Statut_API"]].filter(value => value !== null && value !== "");
                obj["URL"] = [item["fields"]["URL_Telechargement"], item["fields"]["URL_API"]].filter(value => value !== null && value !== "");
            }
            if (props.endpoint === 'ministerial_commitments') {
                console.log(item["fields"])
                obj["PRODUCTEUR"] = item["fields"]["Producteur"]
                
                obj["TYPE"] = item["fields"]["Type"].slice(1);

                obj["PRODUCTEUR"] = [item["fields"]["Producteur_Telechargement"], item["fields"]["Producteur_API"], item["fields"]["Producteur_Code_Source"]].filter(value => value !== null && value !== "");
                obj["STATUT"] = [item["fields"]["Statut_Telechargement"], item["fields"]["Statut_API"], item["fields"]["Statut_Code_Source"]].filter(value => value !== null && value !== "");
                obj["URL"] = [item["fields"]["URL_Telechargement"], item["fields"]["URL_API"], item["fields"]["URL_Code_Source"]].filter(value => value !== null && value !== "");
                obj["DATE ESTIMÉE"] = [item["fields"]["Date_estimee_Telechargement"], item["fields"]["Date_estimee_API"], item["fields"]["Date_estimee_Code_Source"]].filter(value => value !== null && value !== "");

            }
            return obj
        })
        loading.value = 'done'
    } catch (e) {
        console.error(e)
        loading.value = 'failed'
    }
}

onMounted(() => load())
</script>
