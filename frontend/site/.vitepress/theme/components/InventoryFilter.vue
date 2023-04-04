<template>
  <div class="fr-mb-2w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-2">
        <label class="fr-label" for="select-type"> Type </label>
        <select
          id="select-type"
          v-model="type"
          class="fr-select"
          name="select-type"
        >
          <option value="" selected disabled hidden>
            Selectionnez un type
          </option>
          <option v-for="currentType of types" :value="currentType.label">
            {{ currentType.label }}
          </option>
        </select>
      </div>

      <div class="fr-col-3">
        <label class="fr-label" for="select-status"> Statut d'ouverture </label>
        <select
          id="select-status"
          v-model="status"
          class="fr-select"
          name="select-status"
        >
          <option value="" selected disabled hidden>
            Selectionnez un statut
          </option>
          <option v-for="status of statuses" :value="status.label">
            {{ status.label }}
          </option>
        </select>
      </div>

      <div class="fr-col-3">
        <label class="fr-label" for="select-trimester"> Trimestre </label>
        <select
          id="select-trimester"
          v-model="trimester"
          class="fr-select"
          name="select-trimester"
        >
          <option value="" selected disabled hidden>
            Selectionnez un trimestre
          </option>
          <option v-for="t of trimesters" :value="t.key">
            {{ t.label }}
          </option>
        </select>
      </div>

      <div class="fr-col-4">
        <label class="fr-label" for="select-org"> Ministère </label>
        <select
          id="select-org"
          v-model="organization"
          class="fr-select"
          name="select-org"
        >
          <option value="" selected disabled hidden>
            Selectionnez un ministère
          </option>
          <option v-for="organization of organizations" :value="organization.label">
            {{ organization.label }}
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
  trimesters: {
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

const trimester = ref("");

const type = ref("");

const value = computed(() => {
  return {
    status: status.value,
    trimester: trimester.value,
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

watch(trimester, () => {
  emit("change", value.value);
});

watch(type, () => {
  emit("change", value.value);
});

function reset() {
  status.value = "";
  organization.value = "";
  trimester.value = "";
  type.value = "";
}

defineExpose({reset});
</script>

<style scoped>
.reset a {
  color: #9c9c9c;
}
</style>
