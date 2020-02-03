<template>
  <v-content>
    <v-container fluid>
      <Error/>
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
        <v-menu offset-y v-if="!searchVisible && items.length > 0" transition="slide-y-transition">
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
        <v-flex xs4 sm3 md2 xl1 v-for="item in items" :key="item.id" pa-1>
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
        <v-flex xs4 sm3 md2 xl1 v-for="item in filteredItems" :key="item.id" pa-1>
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
    <Success />
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
      currentSort: { title: "Title", icon: "title", prop: "title" },
      // filterby: [{title: 'DVD', icon: 'album'},
      //         {title: 'Blu-ray', icon: 'hd'},
      //         {title: 'iTunes', icon: 'video_label'},
      //         {title: 'None', icon:'close'}],
      loading: false,
      filteredItems: []
    };
  },
  computed: {
    movies() {
      return this.$store.getters.movies
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
      this.filteredItems = this.filteredItems.filter(item => {
        return item.title.toLowerCase().includes(this.searchText.toLowerCase());
      });
    },
    async fetch() {
      this.loading = true;
      try{
        const response = await this.$http.get('/movies')
        this.$store.commit('setMovies', response.data)
        this.items = response.data
        this.filteredItems = response.data
        sortBy(this.currentSort)
      }catch(e){
        this.handleHttpError(e.response)
      }finally{
        this.loading = false
      }
    },
    sortBy(selectedItem) {
      this.currentSort = selectedItem
      this.items.sort((a, b) => a[selectedItem.prop] < b[selectedItem.prop] ? -1 : 1)
      this.filteredItems.sort((a, b) => a[selectedItem.prop] < b[selectedItem.prop] ? -1 : 1)
    },
    onItemClicked(id) {
      if(this.searchVisible){
        this.$store.commit('setPreviousSearchText', this.searchText)
      }
      this.$router.push("/movie/" + id);
    },
    handleHttpError(response){
      let status = response.status
      if(status === 401){
        this.$router.push('login')
      }
    }
  },
  created() {
    if(this.searchVisible){
      this.searchText = this.previousSearchText
      this.search()
    }

     this.fetch();
  }
};
</script>
