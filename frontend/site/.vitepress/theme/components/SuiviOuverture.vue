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
            <td class="cell-padding">
                <div v-bind:key="item" v-for="item in ouverture['thematique']">
                    <div class="themes fr-badge--new">
                        {{  String(item).toUpperCase() }}
                    </div>
                </div>
            </td>
            <td class="cell-padding">

                <span class="fr-badge fr-badge--sm fr-badge--no-icon" :class="{
                    'fr-badge--success':  ouverture['statut'] == 'Ouverture réalisée' || ouverture['statut'] == 'Mise à jour réalisé',
                    'fr-badge--info':  ouverture['statut'] == 'En cours de mise à jour' || ouverture['statut'] == 'En cours d\'ouverture',
                    'fr-badge--new':  ouverture['statut'] == 'Mise à jour à demander',
                    'fr-badge--error':  ouverture['statut'] == 'À l\'arrêt',
                    'fr-badge--warning':  ouverture['statut'] == 'Ouverture à enclencher' || ouverture['statut'] == 'Mise à jour demandée' || ouverture['statut'] == 'Ouverture demandée',
                }">
                    <span v-if="ouverture['url'] != '' && (ouverture['statut'].includes('Mise à jour réalisé') || ouverture['statut'].includes('Ouverture réalisée') || ouverture['statut'].includes('Mise à jour demandée') || ouverture['statut'].includes('Mise à jour à demander')|| ouverture['statut'].includes('En cours de mise à jour'))">
                        <a :href="ouverture['url'] || null" target="_blank" rel="noopener external">{{ ouverture["statut"] }}</a>
                    </span>
                    <span v-else>{{ ouverture['statut'] }}</span>
                </span>
            </td>

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
.themes{
    margin-bottom: 5px;
    border-radius: 5px;
    padding-left: 5px;
    padding-right: 5px;
    font-weight: bold;
    font-size: 12px;
    
}
</style>
