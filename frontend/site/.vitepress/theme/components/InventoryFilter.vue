<template>
  <div class="fr-mb-2w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-2">
        <label class="fr-label" for="select-type"> Type </label>
        <select
          id="select-type"
          class="fr-select"
          name="select-type"
          :value="value.type"
          @change="(value) => change('type', value)"
        >
          <option value="" selected disabled hidden>
            Tous les types
          </option>
          <option v-for="currentType of types" :value="currentType.label">
            {{ currentType.label }}
          </option>
        </select>
      </div>

      <div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-2">
        <label class="fr-label" for="select-category"> Catégorie </label>
        <select
          id="select-category"
          class="fr-select"
          name="select-category"
          :value="value.category"
          @change="(value) => change('category', value)"
        >
          <option value="" selected disabled hidden>
            Toutes les catégories
          </option>
          <option v-for="t of categories" :value="t.key">
            {{ t.label }}
          </option>
        </select>
      </div>

      <div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
        <label class="fr-label" for="select-org"> Producteur </label>
        <select
          id="select-org"
          class="fr-select"
          name="select-org"
          :value="value.organization"
          @change="(value) => change('organization', value)"
        >
          <option value="" selected disabled hidden>
            Tous les producteurs
          </option>
          <option v-for="organization of organizations" :value="organization.label">
            {{ organization.label }}
          </option>
        </select>
      </div>
      <div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
        <label class="fr-label" for="select-supervisor"> Ministère de tutelle </label>
        <select
          id="select-supervisor"
          class="fr-select"
          name="select-supervisor"
          :value="value.supervisor"
          @change="(value) => change('supervisor', value)"
        >
          <option value="" selected disabled hidden>
            Tous les ministères
          </option>
          <option v-for="supervisor of supervisors" :value="supervisor.label">
            {{ supervisor.label }}
          </option>
        </select>
      </div>
      <div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-2">
        <label class="fr-label" for="select-status"> Statut </label>
        <select
          id="select-status"
          class="fr-select"
          name="select-status"
          :value="value.status"
          @change="(value) => change('status', value)"
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
import { computed } from 'vue';

const props = defineProps({
  categories: {
    /** @type {import("vue").PropType<Array<import("../types").Option>>} */
    type: Array,
    required: true,
  },
  filters: {
    /** @type {import("vue").PropType<import("vue").DeepReadonly<import("vue").UnwrapNestedRefs<import("../types").FiltersMap>>>} */
    type: Map,
    required: true,
  },
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
  supervisors: {
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

const emit = defineEmits(["change", "reset"]);

const filters = computed(() => /** @type {import("vue").DeepReadonly<import("vue").UnwrapNestedRefs<import("../types").FiltersMap>>} */(props.filters));

const value = computed(() => {
  return {
    status: filters.value.get("status"),
    category: filters.value.get("category"),
    organization: filters.value.get("organization"),
    supervisor: filters.value.get("supervisor"),
    type: filters.value.get("type"),
  };
});

const filtered = computed(() => Object.values(value.value).some(filter => filter !== ""));

/**
 * Change filters
 * @param {import("../types").Filters} key 
 * @param {Event} event 
 */
function change(key, event) {
  const target = /** @type {HTMLSelectElement | null} */(event.target);
  emit("change", {...value.value, [key]: target?.value});
}

function reset() {
  emit("reset");
}
</script>

<style scoped>
.reset a {
  color: #9c9c9c;
}
</style>
