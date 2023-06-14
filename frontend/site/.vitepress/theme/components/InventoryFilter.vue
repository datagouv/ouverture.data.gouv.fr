<template>
  <div class="fr-mb-2w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-3">
        <label class="fr-label" for="select-type"> Type </label>
        <select
          id="select-type"
          v-model="type"
          class="fr-select"
          name="select-type"
        >
          <option value="" selected disabled hidden>
            Tous les types
          </option>
          <option v-for="currentType of types" :value="currentType.label">
            {{ currentType.label }}
          </option>
        </select>
      </div>

      <div class="fr-col-3">
        <label class="fr-label" for="select-category"> Catégorie </label>
        <select
          id="select-category"
          v-model="category"
          class="fr-select"
          name="select-category"
        >
          <option value="" selected disabled hidden>
            Toutes les catégories
          </option>
          <option v-for="t of categories" :value="t.key">
            {{ t.label }}
          </option>
        </select>
      </div>

      <div class="fr-col-3">
        <label class="fr-label" for="select-org"> Producteur </label>
        <select
          id="select-org"
          v-model="organization"
          class="fr-select"
          name="select-org"
        >
          <option value="" selected disabled hidden>
            Tous les producteurs
          </option>
          <option v-for="organization of organizations" :value="organization.label">
            {{ organization.label }}
          </option>
        </select>
      </div>
      <div class="fr-col-3">
        <label class="fr-label" for="select-status"> Statut </label>
        <select
          id="select-status"
          v-model="status"
          class="fr-select"
          name="select-status"
        >
          <option value="" selected disabled hidden>
            Tous les statuts
          </option>
          <option v-for="status of statuses" :value="status.label">
            {{ status.label }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="filtered" class="fr-grid-row fr-grid-row--right fr-mt-1w">
      <div class="fr-col-auto">
        <button
          class="fr-btn fr-btn--tertiary fr-btn--sm"
          type="button"
          @click="reset"
        >
          Ré-initialiser tous les filtres
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  organizations: {
    /** @type {import("vue").PropType<Array<import("../types").Option>>} */
    type: Array,
    required: true,
  },
  statuses: {
    /** @type {import("vue").PropType<Array<import("../types").Option>>} */
    type: Array,
    required: true,
  },
  categories: {
    /** @type {import("vue").PropType<Array<import("../types").Option>>} */
    type: Array,
    required: true,
  },
  types: {
    /** @type {import("vue").PropType<Array<import("../types").Option>>} */
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["change"]);

const status = ref("");

const organization = ref("");

const category = ref("");

const type = ref("");

const value = computed(() => {
  return {
    status: status.value,
    category: category.value,
    organization: organization.value,
    type: type.value,
  };
});

const filtered = computed(() => Object.values(value.value).some(filter => filter !== ""));

watch(status, () => {
  emit("change", value.value);
});

watch(organization, () => {
  emit("change", value.value);
});

watch(category, () => {
  emit("change", value.value);
});

watch(type, () => {
  emit("change", value.value);
});

function reset() {
  status.value = "";
  organization.value = "";
  category.value = "";
  type.value = "";
}

defineExpose({reset});
</script>

<style scoped>
.reset a {
  color: #9c9c9c;
}
</style>
