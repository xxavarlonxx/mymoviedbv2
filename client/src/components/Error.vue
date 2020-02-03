<template>
  <v-alert :value="message" dismissible type="error">{{message}}</v-alert>
</template>

<script>
export default {
  name: "Error",
  props: {
    message: {
      required: true,
      default: 'An unknown error occured. Please contact the system administrator'
    }
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    }
  }
};
</script>

<style>
</style>
