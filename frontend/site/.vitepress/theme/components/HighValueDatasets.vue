<template>
    <Table :filters endpoint="high_value_datasets" :filtersSorts>
        <template #thead>
            <th>Titre</th>
            <th>Ensemble de données</th>
            <th>Thématique</th>
            <th>Ministère de tutelle</th>
            <th>Producteur</th>
            <th>Statut</th>
        </template>

        <template #row="{ line: dataset }">
            <td><a :href="dataset['URL'] || null">{{ dataset['TITRE'] }}</a></td>
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
        </template>
    </Table>
</template>
<script setup lang="ts">
import Table from './Table.vue'

const filters = [
    { slug: 'category', key_in_api: 'ENSEMBLE DE DONNÉES', placeholder: 'Tous les ensemble de données', label: 'Ensemble de données' },
    { slug: 'theme', key_in_api: 'THÉMATIQUE', placeholder: 'Toutes les thématiques', label: 'Thématique' },
    { slug: 'department', key_in_api: 'MINISTÈRE DE TUTELLE', placeholder: 'Tous les ministères', label: 'Ministère de tutelle' },
    { slug: 'producer', key_in_api: 'PRODUCTEUR', placeholder: 'Tous les producteurs', label: 'Producteur des données' },
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