<template>
    <Table :filters="filters" endpoint="ministerial_commitments">
        <template #thead>
            <th>Titre</th>
            <th>Ministère</th>
            <th>Statut</th>
            <th>Date estimée</th>
        </template>

        <template #row="{ line: commitment }">
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
        </template>
    </Table>
</template>
<script setup lang="ts">
import Table from './Table.vue'

const filters = [
    { slug: 'department', key_in_api: 'PRODUCTEUR', placeholder: 'Tous les ministères', label: 'Ministère' },
    { slug: 'status', key_in_api: 'STATUT', placeholder: 'Tous les statuts', label: 'Statut' },
]
</script>