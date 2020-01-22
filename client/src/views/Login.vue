<template>
  <v-content>
    <v-container fluid fill-height class="mycontent">
      <v-layout align-center justify-center column class="myoverlay" wrap>
        <v-flex xs12 sm8 md4>
          <h1 v-if="visible"
            class="display-4 text-xs-center white--text text-uppercase font-weight-bold my-5"
            :class="{'display-3': $vuetify.breakpoint.sm, 'display-2': $vuetify.breakpoint.xs}"
          >
            <span class="orange--text">My</span>
            <span class="white--text text--darken-3">Movie</span>
            <span class="orange--text">DB</span>
          </h1>
          <v-card>
            <Error/>
            <v-card-text class="pa-4" v-if="visible">
              <v-form ref="form" v-model="valid">
                <v-text-field
                  @keyup.enter="login"
                  prepend-icon="email"
                  name="login"
                  label="E-Mail"
                  type="text"
                  color="orange"
                  v-model="email"
                  :rules = "[rules.required, rules.email]"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="login"
                  id="password"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  color="orange"
                  v-model="password"
                  :rules = "[rules.required, rules.counter]"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <SignupDialog @signedup="signedup($event)"/>
              <v-btn color="orange" dark large @click="login" :loading="loading" v-if="visible" :disabled="!valid">
                <v-icon left>lock_open</v-icon>
                <span>Login</span>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Error from '../components/Error'
import SignupDialog from '../components/SignupDialog'
export default {
  components: {Error, SignupDialog},
  data() {
    return {
      email: "",
      password: "",
      rules: {
              required: value => !!value || 'Required.',
              counter: value => value.length >= 6 || 'Min 6 characters.',
              email: value => {
                  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  return pattern.test(value) || 'Invalid e-mail.'
              }
          },
      valid: false
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    visible(){
      return !this.$store.getters.signupDialog
    }
  },
  methods: {
    login() {
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push("/home");
        })
        .catch(err => {});
    },
    validate(){
        this.$refs.form.validate()
    },
    signedup(event){
      this.email = event.email
      this.password = event.password
      this.login()
    },
    
  }
};
</script>

<style>
.mycontent {
  background: url("../assets/background.jpg") no-repeat;
  background-size: cover;
  position: relative;
  padding: 0px;
}

.myoverlay {
  background-color: rgb(0, 0, 0, 0.75);
}
</style>