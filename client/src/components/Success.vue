<template>
  <v-snackbar v-model="show" color="success" top>{{ message }}</v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  props: ['message'],
  /*created() {
    this.$store.watch(
      state => state.success,
      () => {
        const msg = this.$store.state.success;
        console.log("Success: "+msg)
        if (msg !== "") {
          this.show = true;
          this.message = msg
        }
      }
    );
  }*/
};
</script>

<style>
</style>
