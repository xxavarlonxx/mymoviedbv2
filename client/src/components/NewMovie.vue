<template>
    <v-dialog scrollable max-width="600px" v-model="dialog">
        <v-btn fab absolute bottom left color="primary" slot="activator">
            <v-icon>add</v-icon>
        </v-btn>
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title>Add New Movie</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-divider inset vertical></v-divider>
                <v-btn icon @click="dialog = false"><v-icon large>close</v-icon></v-btn>
            </v-toolbar>
            <v-card-text>
               <v-container fluid>
                   <v-layout column wrap>
                       <v-flex xs12>
                           <v-alert :value="error" dismissible type="error" class="mb-3">{{ error }}</v-alert>
                       </v-flex>
                       <v-flex xs12>
                           <v-text-field :disabled="loading" outline autofocus append-icon="search" label="Search" color="white" v-model="searchText" @keyup.enter='searchTmdb'></v-text-field>
                       </v-flex>
                       <v-flex xs12 v-if="searchResults.length > 0">
                           <v-subheader class="pl-0">Search results</v-subheader>
                       </v-flex>
                       <v-layout column justify-center align-center v-if="loading">
                        <v-progress-circular indeterminate :size="70" :width="7" color="orange"></v-progress-circular>
                         <h1>Search Items...</h1>
                        </v-layout>
                       <v-flex xs12 style="max-height: 300px" v-if="!loading">
                           <v-card flat style="cursor: pointer" :color="currentItem === i ? 'primary' : 'transparent'" v-for="(item, i) in searchResults" v-bind:key="item.tmdb_id" @click="currentItem = i" class="pa-2">
                                <v-layout row wrap >
                                    <v-flex xs2 sm1>
                                        <v-img :src="item.cover_url"></v-img>
                                    </v-flex>
                                    <v-flex xs10 sm11 class="px-2">
                                        <div class="title text-truncate font-weight-bold mb-2">{{ item.title }}</div>
                                        <div class="body-2 font-weight-light">{{ new Date(item.release_date).getFullYear() }}</div>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                       </v-flex>
                   </v-layout>
               </v-container>
            </v-card-text>
            <v-divider dark></v-divider>
            <v-card-actions v-if="currentItem !== -1">
                <v-combobox
                    v-model="select"
                            :items="items"
                            label="Select a medium"
                            required></v-combobox>
                <v-spacer></v-spacer>
                <v-btn large color="primary" :loading="saveloading" :disabled="select === ''" @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data(){
        return {
            dialog: false,
            loading: false,
            saveloading: false,
            searchText: '',
            select: '',
            currentItem: -1
        }
    },
    computed: {
        searchResults() {
            return this.$store.getters.getSearchItems
        },
        items() {
            return this.$store.getters.mediums
        },
        error(){
            return this.$store.getters.error
        }
    },
    methods: {
        searchTmdb(){
            this.loading = true;
            this.currentItem = -1;
            this.select = ''
            this.$store.dispatch('searchTmdb', this.searchText).then(()=>{
                this.loading = false
            }).catch(unauthorized => {
                this.loading = false
                if(unauthorized){
                    this.$router.push('/login')
                }
            })
        },
        save(tmdb_id){
            this.saveloading = true
            
            let selectedMovie = this.searchResults[this.currentItem]
            let type = this.items.indexOf(this.select)
            this.$store.dispatch('addMovie', {tmdb_id: selectedMovie.tmdb_id, type: type}).then(()=> {
                this.dialog = false
                this.searchText = ''
                this.select = ''
                this.currentItem = -1
                this.saveloading = false
                this.$emit('moviesaved')
            }).catch(unauthorized => {
                this.saveloading = false
                if(unauthorized){
                    this.$router.push('/login')
                }
            })
        }
    }
}
</script>

<style>
.centered-dialog
 {
    background: #282c2dad;
    box-shadow: none;
    border-radius: 6px;
    width: auto;
    color: whitesmoke;
  }
</style>
