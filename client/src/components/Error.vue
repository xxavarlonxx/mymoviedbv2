<template>
  <v-alert :value="error" dismissible type="error">{{error}}</v-alert>
</template>

<script>
export default {
  name: "Error",
  computed: {
    error() {
      return this.$store.getters.error;
    }
  },
  methods: {
    onClose() {
      this.$store.commit("clearError");
    }
  }
};
</script>

<style>
</style>
