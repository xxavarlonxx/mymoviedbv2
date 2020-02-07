<template>
    <v-dialog scrollable max-width="600px" v-model="dialog">
        <!--v-btn fab absolute bottom left >
            <v-icon>add</v-icon>
        </v-btn-->
        <v-btn rounded color="primary" slot="activator">
            New Movie
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
                       <v-flex xs12 v-if="errorMessage != null">
                           <v-alert :value="errorMessage" dismissible type="error" class="mb-3">{{ errorMessage }}</v-alert>
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
                            :items="mediums"
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
            currentItem: -1,
            searchResults: [],
            errorMessage: null
        }
    },
    computed: {
        
        mediums() {
            return this.$store.getters.mediums
        },
        
    },
    methods: {
        async searchTmdb(){
            this.loading = true;
            this.errorMessage = null
            this.currentItem = -1;
            this.select = ''
            let formData = new FormData()
            formData.append('query', this.searchText)
            try{
                const response = await this.$http.post('/movies/search', formData)
                this.searchResults = response.data
            }catch(e){
                if(e.response.status == 401){
                    this.$router.push('/login')
                }
                this.errorMessage = 'An internal error occured. Try it later again'
            }finally{
                this.loading = false
            }
        },
        async save(){
            this.saveloading = true
            
            let selectedMovie = this.searchResults[this.currentItem]
            let type = this.mediums.indexOf(this.select)
            let formData = new FormData()
            formData.append('tmdb_id', selectedMovie.tmdb_id)
            formData.append('type', type)
            try{
                await this.$http.post('/movie', formData)
                this.$store.commit('setSuccessMessage', "Added '"+selectedMovie.title+"' successfully")
                this.dialog = false
                this.searchText = ''
                this.select = ''
                this.currentItem = -1
                this.saveloading = false
                this.$emit('moviesaved')
            }catch(e){
                if(e.response.status == 401){
                    this.$router.push('/login')
                }
                this.errorMessage = 'An internal error occured. Try it later again'
            }finally{
                this.saveloading = false
            }
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
