<template>
  <v-app dark >
    <Navigation v-if="this.$route.path.indexOf('login') === -1"/>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
  }
}
</script>
