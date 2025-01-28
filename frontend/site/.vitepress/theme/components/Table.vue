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
import { renderToString } from 'vue/server-renderer';

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

let lines = ref<Array<any>>([])

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
        if (props.endpoint === 'ministerial_commitments') {
            let url = theme.value.engagementApiUrl
            const response = await fetch(url)
            const results = await response.json()
            lines.value = results.records.map((item) => {
                let obj = {}
                obj["TITRE"] = item["fields"]["Titre"]
                obj["STATUT"] = item["fields"]["Statut"]
                obj["PRODUCTEUR"] = item["fields"]["Producteur"]
                obj["TYPE"] = item["fields"]["Type"].slice(1);
                obj["PRODUCTEUR"] = [item["fields"]["Producteur_Telechargement"], item["fields"]["Producteur_API"], item["fields"]["Producteur_Code_Source"]].filter(value => value !== null && value !== "");
                obj["STATUT"] = [item["fields"]["Statut_Telechargement"], item["fields"]["Statut_API"], item["fields"]["Statut_Code_Source"]].filter(value => value !== null && value !== "");
                obj["URL"] = [item["fields"]["URL_Telechargement"], item["fields"]["URL_API"], item["fields"]["URL_Code_Source"]].filter(value => value !== null && value !== "");
                obj["DATE ESTIMÉE"] = [item["fields"]["Date_estimee_Telechargement"], item["fields"]["Date_estimee_API"], item["fields"]["Date_estimee_Code_Source"]].filter(value => value !== null && value !== "");

                return obj
            })
        }
        else if (props.endpoint === 'high_value_datasets') {
            let url = theme.value.hvdApiUrl
            let url2 = theme.value.hvdApiUrlNonDispo
            let url3 = theme.value.ouvertureCrmApiUrlProducers
            let response = await fetch(url)
            let results = await response.json()
            lines.value = results.records.map((item) => {
                let obj = {}
                if (item["fields"]["title"]) {
                    obj["TITRE"] = item["fields"]["title"]
                } else {
                    obj["TITRE"] = ""
                }
                if (item["fields"]["hvd_category"]) {
                    obj["THÉMATIQUE"] = item["fields"]["hvd_category"].filter((record => !["L", "KO"].includes(record)))
                } else {
                    obj["THÉMATIQUE"] = []
                }
                if (item["fields"]["type"] &&  item["fields"]["type"].length > 1) {
                    obj["TYPE"] = item["fields"]["type"].slice(1);
                } else {
                    obj["TYPE"] = []
                }
                if(item["fields"]["hvd_name"]) {
                    obj["ENSEMBLE DE DONNÉES"] = item["fields"]["hvd_name"].filter((record => !["L", "KO"].includes(record)))
                } else {
                    obj["ENSEMBLE DE DONNÉES"] = []
                }
                if (item["fields"]["organization"]) {
                    obj["PRODUCTEUR"] = item["fields"]["organization"];
                } else {
                    obj["PRODUCTEUR"] = ""
                }
                if(item["fields"]["ministry"]) {
                    obj["MINISTÈRE DE TUTELLE"] = item["fields"]["ministry"]
                } else {
                    obj["MINISTÈRE DE TUTELLE"] = ""
                }
                obj["URL DATASET"] = item["fields"]["url"];
                obj["URL API"] = item["fields"]["api_web_datagouv"]

                if (item["fields"]["manual_status_telechargement"] && item["fields"]["manual_status_telechargement"] != "") {
                    obj["STATUT DATASET"] = item["fields"]["manual_status_telechargement"]
                } else {                    
                    obj["STATUT DATASET"] = item["fields"]["status_telechargement_automatique"]
                }

                if (item["fields"]["manual_status_api"] && item["fields"]["manual_status_api"] != "") {
                    obj["STATUT API"] = item["fields"]["manual_status_api"]
                } else {                    
                    obj["STATUT API"] = item["fields"]["status_api_automatique"]
                }

                if (item["fields"]["api_title_datagouv"]) {
                    obj["TITRE API"] = item["fields"]["api_title_datagouv"].slice(0, 15) + (item["fields"]["api_title_datagouv"].length > 15 ? '…' : '')
                } else {
                    obj["TITRE API"] = ""
                }
                return obj
            })
            response = await fetch(url2)
            results = await response.json()
            const lines2 = ref<Array<any>>([])
            lines2.value = results.records.filter(record => record.fields.source_demande.includes("HVD")).map((item) => {
                let obj = {}
                
                if (item["fields"]["nom_donnee"]) {
                    obj["TITRE"] = item["fields"]["nom_donnee"]
                } else {
                    obj["TITRE"] = ""
                }
                if (item["fields"]["hvd_thematique"]) {
                    obj["THÉMATIQUE"] = [item["fields"]["hvd_thematique"]]
                } else {
                    obj["THÉMATIQUE"] = []
                }
                
                obj["TYPE"] = []
                if (item["fields"]["nom_donnee"]) {
                    obj["ENSEMBLE DE DONNÉES"] = [item["fields"]["nom_donnee"]]
                } else {
                    obj["ENSEMBLE DE DONNÉES"] = []
                }
                
                if(item["fields"]["ministere_tutelle_hvd"]) {
                    obj["MINISTÈRE DE TUTELLE"] = item["fields"]["ministere_tutelle_hvd"]
                } else {
                    obj["MINISTÈRE DE TUTELLE"] = ""
                }
                
                if(item["fields"]["producteur"]){
                    obj["PRODUCTEUR"] = item["fields"]["producteur"][1].toString()
                } else {
                    obj["PRODUCTEUR"] = ""
                }
                obj["URL DATASET"] = ""
                obj["URL API"] = ""

                obj["STATUT DATASET"] = item["fields"]["statut"]
                obj["STATUT API"] = item["fields"]["statut"]

                obj["TITRE API"] = ""
                return obj
            })
            response = await fetch(url3)
            results = await response.json()
            let arrayProducers = []
            results.records.map((item) => {
                arrayProducers.push({"id": item["id"], "producer": item["fields"]["nom_producteur"]})
            })
            lines2.value.forEach(item => {
                let castValue = Number(item["PRODUCTEUR"])
                const result = arrayProducers.find(item => item.id === castValue);
                if (!isNaN(castValue) && result) {
                    item["PRODUCTEUR"] = result.producer.toString()
                } else {
                    item["PRODUCTEUR"] = ""
                }
                return item
            })
            
            lines.value = lines2.value.concat(lines.value)

        }
        else if (props.endpoint === 'suivi_ouverture') {
            let url = theme.value.ouvertureCrmApiUrl
            let url2 = theme.value.ouvertureCrmApiUrlProducers
            const response = await fetch(url)
            const results = await response.json()
            lines.value = results.records.map((item) => {
                let obj = {}
                if(item["fields"]["producteur"]){
                    obj["producteur"] = item["fields"]["producteur"][1].toString()
                } else {
                    obj["producteur"] = ""
                }
                obj["TITRE"] = item["fields"]["nom_donnee"]
                obj["url"] = item["fields"]["url"]
                if(item["fields"]["source_demande"]){
                    obj["source_demande"] = item["fields"]["source_demande"][1].toString()
                } else {
                    obj["source_demande"] = ""
                }
                if(item["fields"]["thematique"]){
                    obj["thematique"] = item["fields"]["thematique"]
                    if (obj["thematique"].length > 1){
                        obj["thematique"].shift()
                    }

                } else {
                    obj["thematique"] = []
                }
                obj["statut"] = item["fields"]["statut"]
                return obj
            });

            const response2 = await fetch(url2)
            const results2 = await response2.json()
            let arrayProducers = []
            results2.records.map((item) => {
                arrayProducers.push({"id": item["id"], "producer": item["fields"]["nom_producteur"]})
            })
            lines.value.forEach(item => {
                let castValue = Number(item["producteur"])
                const result = arrayProducers.find(item => item.id === castValue);
                if (!isNaN(castValue) && result) {
                    item["producteur"] = result.producer.toString()
                } else {
                    item["producteur"] = ""
                }
                return item
            })
        }
        loading.value = 'done'
    } catch (e) {
        console.error(e)
        loading.value = 'failed'
    }
}

onMounted(() => load())
</script>
