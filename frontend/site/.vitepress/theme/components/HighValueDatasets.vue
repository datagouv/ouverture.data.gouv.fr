<template>
    <Table :filters endpoint="high_value_datasets" :filtersSorts>
        <template #thead>
            <th>Titre</th>
            <th>Ensemble de données</th>
            <th>Thématique</th>
            <th>Type</th>
            <th>Ministère de tutelle</th>
            <th>Producteur</th>
            <th>Statut</th>
        </template>
        <template #row="{ line: dataset }">
            <td class="cell-padding">{{ dataset['TITRE'] }}</td>
            <td class="cell-padding">{{ dataset['ENSEMBLE DE DONNÉES'] }}</td>
            <td class="cell-padding">{{ dataset['THÉMATIQUE'] }}</td>

            <td :class="{
                'cell-no-padding': dataset['TYPE'].length > 1
            }">
                <div v-for="(value, index) in dataset['TYPE']" :key="index" :class="{
                    'half-cell-border': index == 0 && dataset['TYPE'].length > 1,
                    'half-cell': true

                }">
                    <span class="fr-badge fr-badge--sm fr-badge--no-icon" :class="{
                        'fr-badge--green-menthe': value == 'API',
                        'fr-badge--blue-ecume': value == 'Téléchargement',
                    }">
                        {{ value }}
                    </span>
                </div>
            </td>
            <td :class="{
                'cell-no-padding': dataset['TYPE'].length > 1
            }">
                <div v-for="(value, index) in dataset['MINISTÈRE DE TUTELLE']" :key="index" :class="{
                    'half-cell-border': index == 0 && dataset['MINISTÈRE DE TUTELLE'].length > 1,
                    'half-cell': true

                }">{{ value }}</div>
            </td>
            <td :class="{
                'cell-no-padding': dataset['TYPE'].length > 1
            }">
                <div v-for="(value, index) in dataset['PRODUCTEUR']" :key="index" :class="{
                    'half-cell-border': index == 0 && dataset['PRODUCTEUR'].length > 1,
                    'half-cell': true

                }">{{ value }}</div>
            </td>
            <td style="min-width: 200px;" :class="{
                'cell-no-padding': dataset['TYPE'].length > 1
            }">
                <div v-for="(value, index) in dataset['STATUT']" :key="index" :class="{
                    'half-cell-border': index == 0 && dataset['STATUT'].length > 1,
                    'half-cell': true

                }">
                    <span class="fr-badge fr-badge--sm fr-badge--no-icon" :class="{
                        'fr-badge--success': value == 'Disponible sur data.gouv.fr',
                        'fr-badge--new': value == 'Partiellement disponible',
                        'fr-badge--info': value == 'Disponible',
                        'fr-badge--error': value == 'Non disponible',
                        'fr-badge--warning': value == 'Planifié',
                    }">
                        <span v-if="value == 'Disponible sur data.gouv.fr' || value == 'Disponible'">
                            <a :href="dataset['URL'][index] || null" target="_blank" rel="noopener external">{{ value }}</a>
                        </span>
                        <span v-else>
                            {{ value }}
                        </span>
                    </span>
                    
                </div>
            </td>

        </template>
    </Table>
</template>
<script setup lang="ts">
import Table from './Table.vue'

const filters = [
    { slug: 'category', key_in_api: 'ENSEMBLE DE DONNÉES', placeholder: 'Tous les ensemble de données', label: 'Ensemble de données' },
    { slug: 'theme', key_in_api: 'THÉMATIQUE', placeholder: 'Toutes les thématiques', label: 'Thématique' },
    { slug: 'type', key_in_api: 'TYPE', placeholder: 'Tous les types de données', label: 'Type de données' },
    { slug: 'department', key_in_api: 'MINISTÈRE DE TUTELLE', placeholder: 'Tous les ministères', label: 'Ministère de tutelle' },
    { slug: 'producer', key_in_api: 'PRODUCTEUR', placeholder: 'Tous les producteurs', label: 'Producteur' },
    { slug: 'status', key_in_api: 'STATUT', placeholder: 'Tous les statuts', label: 'Statut' },
]

const filtersSorts = {
    'theme': {
        "Données géospatiales": 1,
        "Observation de la Terre et environnement": 2,
        "Météorologie": 3,
        "Statistiques": 4,
        "Entreprises et propriétés d'entreprises": 5,
        "Mobilité": 6,
    },
}
</script>

<style scoped>
@media screen and (min-width: 70em) {
    .cell-no-padding{
        height: 18rem;
    }
}

@media screen and (max-width: 70em) {
    .cell-no-padding{
        height: 23rem;
    }
}

td{
    padding: 0px;
}

.cell-no-padding{
    padding: 0px;
}
.cell-padding{
    padding: 20px;
}

.half-cell-border{
    height: 50%;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #DDDDDD;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
}
.half-cell{
    height: 50%;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
}
</style>
