import Vue from 'vue'
import Vuex from 'vuex'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import http from "./api.config"

Vue.config.productionTip = false

Vue.prototype.$http = http
store.$http = http

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



