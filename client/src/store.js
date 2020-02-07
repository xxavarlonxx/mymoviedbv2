import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
      access_token: localStorage.getItem('access_token') || null,
      //expiresIn: localStorage.getItem('expiresIn') || null,
      movies: [],
      filteredMovies: [],
      searchItems: [],
      searchVisible: false,
      previousSearchText: "",
      errorMessage: null,
      loading: false,
      mediums: ['DVD', 'Blu-ray', 'iTunes'],
      currentSort: {title: 'Title', icon: 'title', prop: 'title'},
      movie: null,
      showConfirmDialog: false,
      showEditDialog: false,
      signupDialog: false,
      successMessage: null,
  },
  getters: {
    token: (state) => {
      return state.access_token
    },
    movies: (state) => {
      return state.movies;
    },
    movie(state){
      return state.movie
    },
    getSearchItems: (state) => {
      return state.searchItems
    },
    previousSearchText(state){
      return state.previousSearchText
    },
    isSearchVisible: (state) => {
      return state.searchVisible
    },
    showConfirmDialog(state){
      return state.showConfirmDialog
    },
    showEditDialog(state){
      return state.showEditDialog
    },
    signupDialog(state){
      return state.signupDialog
    },
    successMessage(state){
      return state.successMessage
    },
    loggedIn(state){
      return state.access_token !== null
    },
    errorMessage(state){
      return state.errorMessage
    },
    loading(state){
      return state.loading
    },
    mediums(state){
      return state.mediums
    },
    currentSort(state){
      return state.currentSort
    },
    filteredMovies(state){
      return state.filteredMovies
    }
  },
  mutations: {
    setAccessToken(state, access_token){
      state.access_token = access_token
      localStorage.setItem("access_token", access_token)
    },
    destroyAccessToken(state){
      state.access_token = null
      localStorage.removeItem('access_token')
    },
    setMovies(state, movies){
      state.movies = movies
    },
    setMovie(state, movie){
      state.movie = movie
    },
    removeMovie(state, id){
      state.items = state.items.filter(item=> item._id !== id)
      state.filteredItems = state.items.filter(item => item._id !== id)
    },
    setSearchItems(state, items){
      state.searchItems = items
    },
    setPreviousSearchText(state, text){
      state.previousSearchText = text
    },
    toggleSearch(state){
      state.searchVisible = !state.searchVisible
    },
    toggleConfirmDialog(state){
      state.showConfirmDialog = !state.showConfirmDialog
    },
    toggleEditDialog(state){
      state.showEditDialog = !state.showEditDialog
    },
    setLoading(state, loading){
      state.loading = loading
    },
    setErrorMessage(state, errorMessage){
      state.errorMessage = errorMessage
    },
    setSuccessMessage(state, successMessage){
      state.successMessage = successMessage
    },
    sortBy(state, sort){
      if(sort !== undefined){
        state.currentSort = sort
      }
      state.movies.sort((a, b) => a[state.currentSort.prop] < b[state.currentSort.prop] ? -1 : 1)
      state.filteredMovies.sort((a, b) => a[state.currentSort.prop] < b[state.currentSort.prop] ? -1 : 1)
    },
    setFilteredMovies(state, filteredMovies){
      state.filteredMovies = filteredMovies
    }
  },
  actions: {
      async fetchMovies({commit}){
        commit('setLoading', true)
        commit('setErrorMessage', null)
        try{
          const response = await this.$http.get('/movies')
          commit('setMovies', response.data)
          commit('setFilteredMovies', response.data)
        }catch(e){
            commit('setErrorMessage', 'An unknown error occured. Try it later again or contact the system administrator. ('+ e.response.status+')')
        }finally{
          commit('setLoading', false)
        }
      },
  }
})
