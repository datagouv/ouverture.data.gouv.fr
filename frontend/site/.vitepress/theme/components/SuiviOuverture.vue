<template>
    <Table :filters endpoint="suivi_ouverture">
        <template #thead>
            <th>Titre</th>
            <th>Producteur</th>
            <th>Source de la demande</th>
            <th>Thématique</th>
            <th>Statut</th>
        </template>

        <template #row="{ line: ouverture }">
            <td class="cell-padding">{{ ouverture['TITRE'] }}</td>
            <td class="cell-padding">{{ ouverture['producteur'] }}</td>
            <td class="cell-padding">{{ ouverture['source_demande'] }}</td>
            <td class="cell-padding">{{ ouverture['thematique'] }}</td>
            <td class="cell-padding">{{ ouverture['statut'] }}</td>

        </template>
    </Table>
</template>
<script setup lang="ts">
import Table from './Table.vue'

const filters = [
    { slug: 'producteur', key_in_api: 'producteur', placeholder: 'Toutes les organisations', label: 'Organisations' },
    { slug: 'thematique', key_in_api: 'thematique', placeholder: 'Toutes les thématiques de données', label: 'Thématique de données' },
    { slug: 'statut', key_in_api: 'statut', placeholder: 'Tous les statuts', label: 'Statut' },
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
