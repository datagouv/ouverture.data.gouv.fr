<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
    <div class="fr-col-3">
      <label class="fr-label" for="select-status">
        Statut
      </label>
      <select v-model="status" class="fr-select" name="select-status" id="select-status" @mousedown="onSelect($event, status)">
        <option value="" selected disabled hidden>Selectionnez un status</option>
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

    <div class="fr-col-6">
      <label class="fr-label" for="select-org">
        Organisation
      </label>
      <select v-model="org" class="fr-select" name="select-org" id="select-org" @mousedown="onSelect($event, org)">
        <option value="" selected disabled hidden>Selectionnez une organisation</option>
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
  props: ["statuses", "organizations", "trimesters"],
  data () {
    return {
      status: "",
      org: "",
      trimester: ""
    }
  },
  watch: {
    status(){ this.$emit('input', this.value) },
    org(){ this.$emit('input', this.value) },
    trimester(){ this.$emit('input', this.value) }

  },
  computed: {
    value () {
      return { status: this.status, trimester: this.trimester, org: this.org }
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
