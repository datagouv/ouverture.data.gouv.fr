<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
    <div class="fr-col-2">
      <label class="fr-label" for="select-type">
        Type
      </label>
      <select v-model="type" class="fr-select" name="select-type" id="select-type" @mousedown="onSelect($event, type)">
        <option value="" selected disabled hidden>Selectionnez un type</option>
        <option v-for="type of types" :value="type.label">
          {{ type.label }}
        </option>
      </select>
    </div>

    <div class="fr-col-3">
      <label class="fr-label" for="select-status">
        Statut d'ouverture
      </label>
      <select v-model="status" class="fr-select" name="select-status" id="select-status" @mousedown="onSelect($event, status)">
        <option value="" selected disabled hidden>Selectionnez un statut</option>
        <option v-for="status of statuses" :value="status.label">
          {{ status.label }}
        </option>
      </select>
    </div>

    <div class="fr-col-3">
      <label class="fr-label" for="select-trimester">
        Trimestre
      </label>
      <select v-model="trimester" class="fr-select" name="select-trimester" id="select-trimester" @mousedown="onSelect($event, trimester)">
        <option value="" selected disabled hidden>Selectionnez un trimestre</option>
        <option v-for="t of trimesters" :value="t.key">
          {{ t.label }}
        </option>
      </select>
    </div>

    <div class="fr-col-4">
      <label class="fr-label" for="select-org">
        Ministère
      </label>
      <select v-model="org" class="fr-select" name="select-org" id="select-org" @mousedown="onSelect($event, org)">
        <option value="" selected disabled hidden>Selectionnez une ministère</option>
        <option v-for="org of organizations" :value="org.label">
          {{ org.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "IventoryFilter",
  props: ["statuses", "organizations", "trimesters", "types"],
  data () {
    return {
      status: "",
      org: "",
      trimester: "",
      type: ""
    }
  },
  watch: {
    status(){ this.$emit('input', this.value) },
    org(){ this.$emit('input', this.value) },
    trimester(){ this.$emit('input', this.value) },
    type(){ this.$emit('input', this.value) }
  },
  computed: {
    value () {
      return { status: this.status, trimester: this.trimester, org: this.org, type: this.type }
    }
  },
  methods: {
    onSelect (e, item) {
      const parent = e.target.parentElement;
      if(e.target.value == item) {
        parent.value = "";
        parent.dispatchEvent(new Event("change"));
      }
    }
  }
}
</script>
