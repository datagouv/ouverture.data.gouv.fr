<template>
    <Table :filters endpoint="high_value_datasets" :filtersSorts>
        <template #thead>
            <th>Titre</th>
            <th>Ensemble de données</th>
            <th>Thématique</th>
            <th>Ministère de tutelle</th>
            <th>Producteur</th>
            <th>API</th>
            <th>Statut</th>
        </template>
        <template #row="{ line: dataset }">
            <td style="max-width: 200px;" class="cell-padding">
                <a :href="dataset['URL DATASET'] || null" target="_blank" rel="noopener external">{{ dataset['TITRE'] }}</a>
            </td>
            <td class="cell-padding">{{ dataset['ENSEMBLE DE DONNÉES'] }}</td>
            <td class="cell-padding">{{ dataset['THÉMATIQUE'] }}</td>
            <td class="cell-padding">{{ dataset['MINISTÈRE DE TUTELLE'] }}</td>
            <td class="cell-padding">{{ dataset['PRODUCTEUR'] }}</td>
            <td style="max-width: 200px;" class="cell-padding">
                <span class="fr-badge fr-badge--sm fr-badge--no-icon" :class="dataset['URL API'] ? 'fr-badge--info' : 'fr-badge--warning'">
                    <span v-if="dataset['URL API']">
                        <a :href="dataset['URL API'] || null" target="_blank" rel="noopener external">{{ dataset['TITRE API'] }}</a>
                    </span>
                    <span v-else>
                        {{ "Indisponible" }}
                    </span>
                </span>
            </td>
            <td class="cell-padding">
                <span class="fr-badge fr-badge--sm fr-badge--no-icon" :class="{
                        'fr-badge--success': dataset['STATUT'] == 'Disponible sur data.gouv.fr',
                        'fr-badge--new': dataset['STATUT'] == 'Partiellement disponible',
                        'fr-badge--info': dataset['STATUT'] == 'Disponible',
                        'fr-badge--error': dataset['STATUT'] == 'Non disponible',
                        'fr-badge--warning': dataset['STATUT'] == 'Planifié',
                    }">
                        {{ dataset['STATUT'] }}
                    </span>
            </td>
        </template>
    </Table>
</template>
<script setup lang="ts">
import Table from './Table.vue'

const filters = [
    { slug: 'category', key_in_api: 'ENSEMBLE DE DONNÉES', placeholder: 'Tous les ensemble de données', label: 'Ensemble de données' },
    { slug: 'theme', key_in_api: 'THÉMATIQUE', placeholder: 'Toutes les thématiques', label: 'Thématique' },
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
