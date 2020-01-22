<template>
  <v-dialog scrollable max-width="600px" v-model="dialog">
    <v-btn flat color="primary" slot="activator" @click="open">Signup</v-btn>
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Signup</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-divider inset vertical></v-divider>
        <v-btn icon @click="close">
          <v-icon large>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
          <v-container fluid>
            <v-layout column wrap>
              <v-flex xs12>
                <v-alert :value="error" dismissible type="error" class="mb-3">{{ error }}</v-alert>
              </v-flex>
              <v-form ref="form" v-model="valid">
              <v-flex xs12>
                <v-text-field
                  :disabled="loading"
                  prepend-icon="search"
                  label="E-Mail"
                  color="primary"
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :disabled="loading"
                  prepend-icon="person"
                  label="Name"
                  color="primary"
                  v-model="name"
                  :rules="[rules.required, rules.counter]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :disabled="loading"
                  prepend-icon="lock"
                  label="Password"
                  type="password"
                  color="primary"
                  v-model="password"
                  :rules="[rules.required, rules.counter]"
                  required
                ></v-text-field>
              </v-flex>
              </v-form>
            </v-layout>
          </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn large color="primary" :disabled="!valid" :loading="loading" @click="save">Signup</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      name: "",
      password: "",
      error: null,
      dialog: false,
      valid: false,
      rules: {
        required: value => !!value || "Required.",
        counter: value => value.length >= 6 || "Min 6 characters.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    save() {
      this.error = null;
      let user = {
        email: this.email,
        name: this.name,
        password: this.password
      };
      this.$store
        .dispatch("signup", user)
        .then(response => {
          this.$emit("signedup", user);
        })
        .catch(err => {
          this.error = err;
        });
    },
    validate(){
        this.$refs.form.validate()
    },
    toggleSignupDialog(){
      this.$store.commit("toggleSignupDialog")
    },
    open(){
        this.toggleSignupDialog()
    },
    close(){
        this.dialog = false
        this.toggleSignupDialog()
    }
  }
};
</script>

<style>
</style>
