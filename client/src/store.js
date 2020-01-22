import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default new Vuex.Store({
  state: {
      access_token: localStorage.getItem('access_token') || null,
      expiresIn: localStorage.getItem('expiresIn') || null,
      items: [],
      searchItems: [],
      searchVisible: false,
      previousSearchText: "",
      error: null,
      loading: false,
      mediums: ['DVD', 'Blu-ray', 'iTunes'],
      currentSort: {title: 'Title', icon: 'title', prop: 'title'},
      filteredItems: [],
      movie: null,
      confirmDialog: false,
      editDialog: false,
      signupDialog: false,
      success: "",
  },
  getters: {
    getAllItems: (state) => {
      return state.items;
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
    confirmDialog(state){
      return state.confirmDialog
    },
    editDialog(state){
      return state.editDialog
    },
    signupDialog(state){
      return state.signupDialog
    },
    success(state){
      return state.success
    },
    loggedIn(state){
      let accessToken = state.access_token
      let expiresInString = state.expiresIn
      if(accessToken !== null && expiresInString !== null){
          let expiresIn = new Date(expiresInString )
          if(Date.now() > expiresIn){
            return false;
          }
      }else{
        return false
      }
      return true
    },
    error(state){
      return state.error
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
    filteredItems(state){
      return state.filteredItems
    }
  },
  mutations: {
    setAccessToken(state, access_token){
      state.access_token = access_token
    },
    setExpiresIn(state, expiresIn){
      state.expiresIn = expiresIn
    },
    destroyAccessToken(state){
      state.access_token = null
      state.expiresIn = null
    },
    setMovieList(state, movies){
      state.items = movies
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
      state.confirmDialog = !state.confirmDialog
    },
    toggleEditDialog(state){
      state.editDialog = !state.editDialog
    },
    toggleSignupDialog(state){
      state.signupDialog = !state.signupDialog
    },
    setLoading(state, loading){
      state.loading = loading
    },
    setError(state, error){
      state.error = error
    },
    clearError(state){
      state.error = null
    },
    setSuccess(state, success){
      state.success = success
    },
    sortBy(state, sort){
      if(sort !== undefined){
        state.currentSort = sort
      }
      state.items.sort((a, b) => a[state.currentSort.prop] < b[state.currentSort.prop] ? -1 : 1)
    },
    setFilteredItems(state){
      state.filteredItems = state.items
    }
  },
  actions: {
      login(context, credentials){
        return new Promise((resolve, reject) => {
          context.commit('setLoading', true)
          context.commit('clearError')
          axios.post('/auth/login', {
            email: credentials.email,
            password: credentials.password
          }).then(response => {
            context.commit('setLoading', false)
            let token = response.data.result.details.access_token
            console.log(token)
            localStorage.setItem('access_token', token.token)
            localStorage.setItem('expiresIn', token.expiresIn)
            context.commit('setAccessToken', token.token)
            context.commit('setExpiresIn', token.expiresIn)
            resolve(response)
          }).catch(err => {
            context.commit('setLoading', false)
            context.commit('setError', err.response.data.error.message)
            reject(err.response.data.error)
          })
        })
      },
      logout(context){
        new Promise((resolve)=> {
          context.commit('clearError')
          localStorage.removeItem('access_token')
          localStorage.removeItem('expiresIn')
          context.commit('destroyAccessToken')
          resolve()
        })
      },
      signup({commit}, user){
        return new Promise((resolve, reject) => {
          commit('setLoading', true)
          axios.post('/auth/signup', {
            email: user.email,
            name: user.name,
            password: user.password
          }).then(response => {
            commit("setLoading", false)
            resolve(response.data)
          }).catch(err => {
            commit('setLoading', false)
            reject(err.response.data.error.message)
          })
        })
      },
      loadAllMovies({commit, state, dispatch}){
        return new Promise((resolve, reject)=> {
          commit('clearError')
          commit('setLoading', true)
          console.log(state.access_token)
          axios.get('/movies', { headers: { Authorization: state.access_token } })
          .then(response => {
            commit('setLoading', false)
            let movies = response.data.result.data
            commit('setMovieList', movies)
            commit('sortBy')
            commit('setFilteredItems')
            resolve()
          }).catch(err => {
            commit('setLoading', false)
            if(err.response.status === 401){
              dispatch('logout').then(() => {
                commit('setError', err.response.data.error.message)
                reject(true)
              })
            }else{
              commit('setError', err.response.data.error.message)
              reject(false)
            }
          })
        })
      },
      getMovie({commit, state, dispatch}, id){
        return new Promise((resolve, reject) => {
          commit('clearError')
          commit('setLoading', true)
          axios.get('/movies/'+id, { headers: { Authorization: state.access_token } })
          .then(response => {
            let movie = response.data.result.data
            commit('setLoading', false)
            commit('setMovie', movie)
            resolve()
          }).catch(err => {
              commit('setLoading', false)
              if(err.response.status === 401){
                dispatch('logout').then(() => {
                  commit('setError', err.response.data.error.message)
                  reject(true)
                })
              }else{
                commit('setError', err.response.data.error.message)
                reject(false)
              }
          })
        })
      },
      searchTmdb({commit, state, dispatch}, query){
        return new Promise((resolve, reject)=> {
            commit('clearError')
            axios.post('/movies/search',{
              query
            }, { headers: { Authorization: state.access_token } }).then(response => {
              let searchResult = response.data.result.data
              commit('setSearchItems', searchResult)
              resolve()
            }).catch(err => {
              if(err.response.status === 401){
                dispatch('logout').then(() => {
                  commit('setError', err.response.data.error.message)
                  reject(true)
                })
              }else{
                commit('setError', err.response.data.error.message)
                reject(false)
              }
            })
        })
        
      },
      addMovie({commit, state, dispatch}, movie){
        return new Promise((resolve, reject)=>{
          commit('clearError')
          axios.post('/movies/create', {
            tmdb_id: movie.tmdb_id,
            type: movie.type
          },{ headers: { Authorization: state.access_token } })
          .then(response => {
            commit('setSearchItems', [])
            commit('setSuccess', response.data.result.message)
            resolve()
          }).catch(err => {
            if(err.response.status === 401){
              dispatch('logout').then(() => {
                commit('setError', err.response.data.error.message)
                reject(true)
              })
            }else{
              commit('setError', err.response.data.error.message)
              reject(false)
            }
          })
        })
      },
      updateMovie({commit, state, dispatch}, payload){
        return new Promise((resolve, reject)=> {
          commit('clearError')
          commit('setLoading', true)
          axios.put('/movies/'+payload.id, {
            type: payload.type
          },{ headers: { Authorization: state.access_token } })
          .then(response=>{
             commit('setLoading', false)
             commit('setSuccess', response.data.result.message)
             resolve()
          })
          .catch(err => {
            commit('setLoading', false)
            if(err.response.status === 401){
              dispatch('logout').then(() => {
                commit('setError', err.response.data.error.message)
                reject(true)
              })
            }else{
              commit('setError', err.response.data.error.message)
              reject(false)
            }
          })
        })
      },
      deleteMovie({commit, state, dispatch}, id){
        return new Promise((resolve, reject) => {
          commit('clearError')
          commit('setLoading', true)
          axios.delete('/movies/'+id, { headers: { Authorization: state.access_token } })
          .then(response => {
            commit('setLoading', false)
            commit('removeMovie', id)
            resolve()
            setTimeout(()=> {
             commit('setSuccess', response.data.result.message)
            }, 500)
          })
          .catch(err => {
            commit('setLoading', false)
            if(err.response.status === 401){
              dispatch('logout').then(() => {
                commit('setError', err.response.data.error.message)
                reject(true)
              })
            }else{
              commit('setError', err.response.data.error.message)
              reject(false)
            }
          })
        })
      },
  }
})
