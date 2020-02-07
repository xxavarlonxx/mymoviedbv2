<template>
  <v-content>
    <v-container fluid>
      <Error v-if="errorMessage" :message="errorMessage"/>
      <v-layout row wrap justify-center v-if="searchVisible">
        <v-flex xs12 lg6 xl4>
          <v-text-field
            outline
            autofocus
            prepend-inner-icon="search"
            label="Search"
            color="white"
            v-model="searchText"
            @keyup.enter="search"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row mb-2 justify-end>
        <v-menu offset-y v-if="!searchVisible && movies.length > 0" transition="slide-y-transition">
          <v-btn color="primary" slot="activator" dark small fab>
            <v-icon>sort</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile v-for="(item, index) in sortby" :key="index" @click="sortBy(item)" avatar>
              <v-list-tile-avatar>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-layout>
      <!-- <v-divider></v-divider> -->
      <v-layout row wrap mt-2 v-if="!searchVisible">
        <v-flex xs4 sm3 md2 xl1 v-for="item in movies" :key="item.id" pa-1>
          <v-tooltip bottom>
            <v-card
              color="grey lighten-2"
              slot="activator"
              style="cursor: pointer"
              @click="onItemClicked(item.id)"
            >
              <v-img :src="item.thumbnail_image_url" :aspect_ratio="0.65"></v-img>
            </v-card>
            <span>{{ item.title+' ('+ new Date(item.release_date).getFullYear()+') - '+ mediums[item.type]}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-subheader v-if="searchVisible">Search results</v-subheader>
      <v-layout row wrap mt-2 v-if="searchVisible">
        <v-flex xs4 sm3 md2 xl1 v-for="item in filterResults" :key="item.id" pa-1>
          <v-tooltip bottom>
            <v-card
              color="grey lighten-2"
              slot="activator"
              style="cursor: pointer"
              @click="onItemClicked(item.id)"
            >
              <v-img :src="item.thumbnail_image_url" :aspect_ratio="0.65"></v-img>
            </v-card>
            <span>{{ item.title+' ('+ new Date(item.release_date).getFullYear()+') - DVD'}}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <Loading :value="loading" message="Loading library..."/>
    <Success :message="successMessage" v-if="successMessage != null"/>
  </v-content>
</template>

<script>
import Loading from "../components/Loading";
import Error from "../components/Error";
import Success from "../components/Success";
export default {
  components: { Loading, Error, Success },
  data() {
    return {
      searchText: "",
      sortby: [
        { title: "Title", icon: "title", prop: "title" },
        { title: "Release", icon: "date_range", prop: "release_date" },
        { title: "Added", icon: "add_box", prop: "created_at" }
      ],
      //currentSort: { title: "Title", icon: "title", prop: "title" },
      filterResults: [],
      //loading: false,
      //filteredItems: []
    };
  },
  computed: {
    movies() {
      return this.$store.getters.movies
    },
    filteredMovies(){
      return this.$store.getters.filteredMovies
    },
    errorMessage(){
      return this.$store.getters.errorMessage
    },
    successMessage(){
      return this.$store.getters.successMessage
    },
    loading(){
      return this.$store.getters.loading
    },
    searchVisible() {
      return this.$store.getters.isSearchVisible;
    },
    mediums() {
      return this.$store.getters.mediums;
    },
    previousSearchText(){
      return this.$store.getters.previousSearchText
    }
  },
  methods: {
    search() {
      this.filterResults = this.filteredMovies.filter(item => {
        return item.title.toLowerCase().includes(this.searchText.toLowerCase());
      });
    },
    fetch() {
      this.$store.dispatch('fetchMovies')
    },
    sortBy(selectedItem) {
      this.$store.commit('sortBy', selectedItem)
    },
    onItemClicked(id) {
      if(this.searchVisible){
        this.$store.commit('setPreviousSearchText', this.searchText)
      }
      this.$router.push("/movie/" + id);
    },
  },
  created() {
    console.log('created')
    if(this.searchVisible){
      this.searchText = this.previousSearchText
      this.search()
    }
     this.fetch();
  }
};
</script>
