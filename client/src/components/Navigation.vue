<template>
  <v-toolbar>
    <v-btn @click="onBack" large icon v-if="$route.name === 'movie' || searchVisible">
      <v-icon large>arrow_back</v-icon>
    </v-btn>
    <v-toolbar-title class="orange--text">
      <span class="orange--text">My</span>
      <span class="white--text text--darken-3">Movie</span>
      <span class="orange--text">DB</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <NewMovie v-if="!searchVisible && $route.name !== 'movie'" @moviesaved="refresh"/>
    <v-btn icon  @click="onEditMovie"  v-if="$route.name == 'movie'">
      <v-icon >edit</v-icon>  
    </v-btn>
    <v-btn icon @click="onDeleteMovie" v-if="$route.name == 'movie'">
      <v-icon color="error">delete</v-icon>  
    </v-btn>
    <v-btn icon v-if="!searchVisible && $route.name !== 'movie'"  @click="toggleSearch">
      <v-icon >search</v-icon>
    </v-btn>
    <v-menu offset-y v-if="!searchVisible && $route.name !== 'movie'" transition="slide-y-transition">
      <v-btn slot="activator"  icon  >
        <v-icon >more_vert</v-icon>
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
      this.$store.commit('destroyAccessToken')
      this.$router.push("/login");
    },
    toggleSearch() {
      this.$store.commit("toggleSearch");
    },
    refresh() {
      this.$store.dispatch("fetchMovies")
    },
    onDeleteMovie(){
     this.$store.commit("toggleConfirmDialog");
    },
    onEditMovie(){
      this.$store.commit('toggleEditDialog')
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