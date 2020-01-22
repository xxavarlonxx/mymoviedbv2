<template>
  <v-content>
    <v-container v-if="item !== null" mt-4>
      <Error class="mb-3"/>
      <v-layout row wrap mb-2>
        <v-flex xs12 sm4 md6 lg3 mb-0>
          <v-img :src="item.cover_image_url" :aspect_ratio="0.65"></v-img>
        </v-flex>
        <v-flex xs12 sm8 md6 lg9>
          <v-container fluid style="background: transparent">
            <v-layout column wrap>
              <v-flex xs12 class="mb-4">
                <div
                  class="display-1 font-weight-bold text-truncate"
                  style="display: block"
                >{{ item.title+' ('+ new Date(item.release_date).getFullYear()+')' }}</div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Runtime:
                  <span class="white--text">{{ item.runtime + ' min' }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Publisher:
                  <span class="white--text">{{ item.production_company }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Directors:
                  <span class="white--text">{{ item.directors.join(', ') }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Producers:
                  <span class="white--text">{{ item.producers.join(', ') }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Genres:
                  <span class="white--text">{{ item.genres.join(', ') }}</span>
                </div>
              </v-flex>
              <v-flex xs12 class="mb-2">
                <div class="body-2 grey--text">
                  Medium:
                  <span class="white--text">{{ mediums[item.type] }}</span>
                </div>
              </v-flex>
              <v-flex xs12>
                <v-container fluid px-0 pt-0 pb-0>
                  <v-layout row wrap>
                    <v-flex xs12 md6 class="pr-3 mb-3">
                      <div class="body-1 grey--text">Cast</div>
                      <v-divider class="mb-1"></v-divider>
                      <div v-for="cast in item.cast" :key="cast.name" class="body1">
                        {{ cast.name }}
                        <span class="grey--text">{{'('+cast.character+')'}}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 md6 class="pr-3 mb-3">
                      <div class="body-1 grey--text">Crew</div>
                      <v-divider class="mb-1"></v-divider>
                      <div v-for="crew in item.crew" :key="crew.name" class="body1">
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
          <p class="body-1">{{ item.description}}</p>
        </v-flex>
        <!-- </v-layout>
        </v-container>-->
      </v-layout>
    </v-container>
    <Loading :value="loading" message="Loading details..."/>
    <ConfirmDialog title="Delete" text="Do you really want to delete the movie?" @confirmclicked="onDelete($event)" v-if="confirmDialog"/>
    <EditDialog :currentMedium="mediums[item.type]" @clickedsave="onEdit($event)" v-if="editDialog"/>
    <Success  />
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
  computed: {
    item() {
      return this.$store.getters.movie;
    },
    mediums() {
      return this.$store.getters.mediums;
    },
    loading() {
      return this.$store.getters.loading;
    },
    confirmDialog() {
      return this.$store.getters.confirmDialog;
    },
    editDialog(){
      return this.$store.getters.editDialog;
    }
  },
  methods: {
    onEdit(event){
      let type = this.mediums.indexOf(event)
      this.$store.dispatch('updateMovie', {id: this.item._id, type}).then(()=> {
        this.refresh()
      }).catch(unauthorized => {
          if(unauthorized){
            this.$router.push('/login')
          }
      })
    },
    onDelete(event) {
      if (event) {
        this.$store.dispatch("deleteMovie", this.item._id).then(() => {
          window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push("/home");
        }).catch(unauthorized => {
          if(unauthorized){
            this.$router.push('/login')
          }
      })
      }
      this.$store.commit("toggleConfirmDialog");
    },
    refresh(){
      this.$store.dispatch("getMovie", this.$route.params.id).catch(unauthorized => {
          if(unauthorized){
            this.$router.push('/login')
          }
      });
    }
  },
  created() {
    this.refresh()
  }
};
</script>

<style>
</style>
