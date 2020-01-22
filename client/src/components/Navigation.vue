<template>
  <v-toolbar extended>
    <v-btn @click="onBack" large icon v-if="$route.name === 'movie' || searchVisible">
      <v-icon large>arrow_back</v-icon>
    </v-btn>
    <v-btn @click="onEditMovie" fab absolute bottom left color="primary" v-if="$route.name == 'movie'">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-btn @click="onDeleteMovie" fab absolute bottom right color="error" v-if="$route.name == 'movie'">
      <v-icon>delete</v-icon>
    </v-btn>
    <v-toolbar-title class="orange--text">
      <span class="orange--text">My</span>
      <span class="white--text text--darken-3">Movie</span>
      <span class="orange--text">DB</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <NewMovie v-if="!searchVisible && $route.name !== 'movie'" @moviesaved="refresh"/>
    <v-btn icon v-if="!searchVisible && $route.name !== 'movie'" large @click="toggleSearch">
      <v-icon large>search</v-icon>
    </v-btn>
    <v-btn icon v-if="!searchVisible && $route.name !== 'movie'" large @click="refresh">
      <v-icon large>autorenew</v-icon>
    </v-btn>
    <v-btn icon large @click="logout">
      <v-icon large>input</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import NewMovie from "./NewMovie";
export default {
  name: "Navigation",
  components: { NewMovie },
  computed: {
    searchVisible() {
      return this.$store.getters.isSearchVisible;
    },
    currentMovie(){
      return this.$store.getters.movie
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    toggleSearch() {
      this.$store.commit("toggleSearch");
    },
    refresh() {
      this.$store.dispatch("loadAllMovies").catch(err => {
        console.log(err);
      });
    },
    onDeleteMovie(){
      if(this.currentMovie !== null){
          this.$store.commit("toggleConfirmDialog");
      }
    },
    onEditMovie(){
      if(this.currentMovie !== null){
        this.$store.commit('toggleEditDialog')
      }
    },
    onBack() {
      if (this.$route.name === "movie") {
         window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/home')
      }
      else if (this.searchVisible) {
        this.$store.commit("toggleSearch");
      }

      
    }
  }
};
</script>