<template>
  <v-snackbar v-model="show" color="success" bottom>{{ message }}</v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  props: ['message'],
  watch: {
    show(newValue){
      if(!newValue){
        this.$store.commit('setSuccessMessage', null)
      }
    }
  }
};
</script>

<style>
</style>
