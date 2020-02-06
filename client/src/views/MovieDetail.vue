<template>
  <v-content>
    <v-container v-if="movie !== null" mt-4>
      <Error class="mb-3" v-if="hasError"/>
      <v-layout row wrap mb-2>
        <v-flex xs12 sm4 md6 lg3 mb-0>
          <v-img :src="movie.cover_image_url" :aspect_ratio="0.65"></v-img>
        </v-flex>
        <v-flex xs12 sm8 md6 lg9>
          <v-container fluid style="background: transparent">
            <v-layout column wrap>
              <v-flex xs12 class="mb-4">
                <div
                  class="display-1 font-weight-bold text-truncate"
                  style="display: block"
                >{{ movie.title+' ('+ new Date(movie.release_date).getFullYear()+')' }}</div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Runtime:
                  <span class="white--text">{{ movie.runtime + ' min' }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Publisher:
                  <span class="white--text">{{ movie.production_company }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Directors:
                  <span class="white--text">{{ movie.directors.join(', ') }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Producers:
                  <span class="white--text">{{ movie.producers.join(', ') }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Genres:
                  <span class="white--text">{{ movie.genres.join(', ') }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Medium:
                  <span class="white--text">{{ mediums[movie.type] }}</span>
                </div>
              </v-flex>
              <v-flex xs12>
                <v-container fluid px-0 pt-0 pb-0>
                  <v-layout row wrap>
                    <v-flex xs12 md6 class="pr-3 mb-3">
                      <div class="body-1 grey--text">Cast</div>
                      <v-divider class="mb-1"></v-divider>
                      <div v-for="cast in movie.cast" :key="cast.name" class="body1">
                        {{ cast.name }}
                        <span class="grey--text">{{'('+cast.character+')'}}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 md6 class="pr-3 mb-3">
                      <div class="body-1 grey--text">Crew</div>
                      <v-divider class="mb-1"></v-divider>
                      <div v-for="crew in movie.crew" :key="crew.name" class="body1">
                        {{ crew.name }}
                        <span class="grey--text">{{'('+crew.job+')'}}</span>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
      <!-- <v-layout row wrap>
            <v-flex xs12 sm4 md6 lg3>
                <v-btn color="primary" class="ml-0 mr-2 mt-0">
                    <v-icon left>edit</v-icon>
                    <span>Edit</span>
                </v-btn>
                <v-btn color="error" class="ml-0 mt-0" @click="onDelete">
                    <v-icon left>delete</v-icon>
                    <span>Delete</span>
                </v-btn>
            </v-flex>
      </v-layout>-->
      <v-layout column wrap mt-2>
        <!-- <v-container fluid>
        <v-layout column wrap>-->
        <v-flex xs12>
          <h4 class="body-1 grey--text">Description</h4>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12>
          <p class="body-1">{{ movie.description}}</p>
        </v-flex>
        <!-- </v-layout>
        </v-container>-->
      </v-layout>
    </v-container>
    <Loading :value="loading" message="Loading details..."/>
    <ConfirmDialog title="Delete" text="Do you really want to delete the movie?" @confirmclicked="onDelete($event)" v-if="showConfirmDialog"/>
    <EditDialog :currentMedium="mediums[movie.type]" @onSave="onEdit($event)" v-if="showEditDialog"/>
    <Success v-if="hasSuccess" :message="successMessage"  />
  </v-content>
</template>

<script>
import Loading from "../components/Loading";
import Error from "../components/Error";
import ConfirmDialog from "../components/ConfirmDialog";
import EditDialog from '../components/EditDialog';
import Success from '../components/Success';

export default {
  components: { Loading, Error, ConfirmDialog, EditDialog, Success },
  data(){
    return {
      loading: false,
      movie: null,
      hasError: false,
      hasSuccess: false,
      successMessage: null,
    }
  },
  computed: {
    mediums() {
      return this.$store.getters.mediums;
    },
    showConfirmDialog() {
      return this.$store.getters.showConfirmDialog;
    },
    showEditDialog(){
      return this.$store.getters.showEditDialog;
    }
  },
  methods: {
    async onEdit(event){
      let type = this.mediums.indexOf(event)
      this.loading = true
      this.hasError = false
      let formData = new FormData()
      formData.append('type', type)
      try{
        await this.$http.put('/movie/'+this.movie.id, formData)
        await this.fetch()
        this.hasSuccess = true
        this.successMessage = "Saved!"
      }catch(e){
        this.hasError = true
      }finally{
        this.loading = false
        this.$store.commit('toggleEditDialog')
      }
    },
    async onDelete(event) {
      if (event) {
        this.loading = true
        this.hasError = false
        try{
          await this.$http.delete('/movie/'+this.movie.id)
           window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push("/home");
        }catch(e){
          this.hasError = true
        }finally{
          this.loading = false
        }
      }
      this.$store.commit('toggleConfirmDialog')
    },
    async fetch(){
      this.loading = true
      this.hasError = false
      try{
        const response = await this.$http.get('/movie/'+ this.$route.params.id)
        this.movie = response.data
      }catch(e){
        this.hasError = true
      }finally{
        this.loading = false
      }
    }
  },
  created() {
    this.fetch()
  }
};
</script>

<style>
</style>
