<template>
    <Table :filters endpoint="ministerial_commitments">
        <template #thead>
            <th>Titre</th>
            <th>Type</th>
            <th>Ministère</th>
            <th>Statut</th>
            <th>Date estimée</th>
        </template>

        <template #row="{ line: commitment }">
            <td class="cell-padding">{{ commitment['TITRE'] }}</td>

            <td :class="{
                'cell-no-padding': commitment['TYPE'].length > 1
            }">
                <div v-for="(value, index) in commitment['TYPE']" :key="index" :class="{
                    'half-cell-border': index == 0 && commitment['TYPE'].length > 1,
                    'half-cell': true

                }">
                    <span class="fr-badge fr-badge--sm fr-badge--no-icon" :class="{
                        'fr-badge--green-menthe': value == 'API',
                        'fr-badge--blue-ecume': value == 'Téléchargement',
                        'fr-badge--purple-glycine': value == 'Code source',
                    }">
                        {{ value }}
                    </span>
                </div>
            </td>
            <td :class="{
                'cell-no-padding': commitment['TYPE'].length > 1
            }">
                <div v-for="(value, index) in commitment['PRODUCTEUR']" :key="index" :class="{
                    'half-cell-border': index == 0 && commitment['PRODUCTEUR'].length > 1,
                    'half-cell': true

                }">{{ value }}</div>
            </td>
            <td :class="{
                'cell-no-padding': commitment['TYPE'].length > 1
            }">
                <div v-for="(value, index) in commitment['STATUT']" :key="index" :class="{
                    'half-cell-border': index == 0 && commitment['STATUT'].length > 1,
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
                            <a :href="commitment['URL'][index] || null" target="_blank" rel="noopener external">{{ value }}</a>
                        </span>
                        <span v-else>
                            {{ value }}
                        </span>
                    </span>
                </div>
            </td>
            <td :class="{
                'cell-no-padding': commitment['TYPE'].length > 1
            }">
                <div v-for="(value, index) in commitment['DATE ESTIMÉE']" :key="index" :class="{
                    'half-cell-border': index == 0 && commitment['DATE ESTIMÉE'].length > 1,
                    'half-cell': true

                }">{{ value }}</div>
            </td>

        </template>
    </Table>
</template>
<script setup lang="ts">
import Table from './Table.vue'

const filters = [
    { slug: 'department', key_in_api: 'PRODUCTEUR', placeholder: 'Tous les ministères', label: 'Ministère' },
    { slug: 'type', key_in_api: 'TYPE', placeholder: 'Tous les types de données', label: 'Type de données' },
    { slug: 'status', key_in_api: 'STATUT', placeholder: 'Tous les statuts', label: 'Statut' },
]
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
