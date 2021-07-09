<template>
  <div>
    <div v-html="html" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DatagouvfrDatasetCard",
  props: ["id"],
  data() {
    return {
      base: "https://www.data.gouv.fr/",
      api: "https://www.data.gouv.fr/api/1/oembed",
      html: "",
    };
  },
  mounted() {
    axios.get(this.api, { params: { url: this.url() } }).then((res) => {
      this.html = res.data.html;
    });
  },
  methods: {
    url() {
      return `${this.base}fr/datasets/${this.id}/`;
    },
  },
};
</script>
