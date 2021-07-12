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
          @mousedown="onSelect($event, type)"
        >
          <option value="" selected disabled hidden>
            Selectionnez un type
          </option>
          <option v-for="type of types" :value="type.label">
            {{ type.label }}
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
          @mousedown="onSelect($event, status)"
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
          @mousedown="onSelect($event, trimester)"
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
          v-model="org"
          class="fr-select"
          name="select-org"
          @mousedown="onSelect($event, org)"
        >
          <option value="" selected disabled hidden>
            Selectionnez une ministère
          </option>
          <option v-for="org of organizations" :value="org.label">
            {{ org.label }}
          </option>
        </select>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--right fr-text--sm reset">
      <div class="fr-col-2">
        <a href="#" @click="reset($event)">Ré-initialiser tous les filtres</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InventoryFilter",
  props: ["statuses", "organizations", "trimesters", "types"],
  data() {
    return {
      status: "",
      org: "",
      trimester: "",
      type: "",
    };
  },
  computed: {
    value() {
      return {
        status: this.status,
        trimester: this.trimester,
        org: this.org,
        type: this.type,
      };
    },
  },
  watch: {
    status() {
      this.$emit("input", this.value);
    },
    org() {
      this.$emit("input", this.value);
    },
    trimester() {
      this.$emit("input", this.value);
    },
    type() {
      this.$emit("input", this.value);
    },
  },
  methods: {
    onSelect(e, item) {
      const parent = e.target.parentElement;
      if (e.target.value == item) {
        parent.value = "";
        parent.dispatchEvent(new Event("change"));
      }
    },
    reset(e) {
      e.preventDefault();

      const selects = this.$el.getElementsByTagName("select");
      selects.forEach((select) => {
        select.value = "";
        select.dispatchEvent(new Event("change"));
      });
    },
  },
};
</script>

<style scoped>
.reset {
  text-align: right;
}
.reset a {
  color: #9c9c9c;
}
</style>
