<template>
  <v-toolbar :extended="$route.name == 'movie'">
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
    <v-menu offset-y v-if="!searchVisible && $route.name !== 'movie'" transition="slide-y-transition">
      <v-btn slot="activator" fab depressed  >
        <v-icon  >more_vert</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile v-for="(item, index) in menuItems" :key="index" @click="onMore(index)" avatar>
          <v-list-tile-avatar>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import NewMovie from "./NewMovie";
export default {
  name: "Navigation",
  components: { NewMovie },
  data(){
    return {
      menuItems: [
        {
          icon: 'autorenew',
          title: 'Refresh'
        },
        {
          icon: 'input',
          title: 'Logout'
        }
      ]
    }
  },
  computed: {
    searchVisible() {
      return this.$store.getters.isSearchVisible;
    },
  },
  methods: {
    onMore(index){
      const clickedItem = this.menuItems[index]
      if(clickedItem.title === 'Refresh'){
        this.refresh()
      }
      if(clickedItem.title === 'Logout'){
        this.logout()
      }
    },
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    toggleSearch() {
      this.$store.commit("toggleSearch");
    },
    refresh() {
      this.$store.dispatch("fetchMovies")
    },
    onDeleteMovie(){
      //if(this.currentMovie !== null){
          this.$store.commit("toggleConfirmDialog");
      //}
    },
    onEditMovie(){
      //if(this.currentMovie !== null){
        this.$store.commit('toggleEditDialog')
      //}
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