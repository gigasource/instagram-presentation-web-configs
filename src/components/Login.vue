<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-12 pa-6" >
          <v-toolbar color="transparent" flat>
            <v-img max-width="50px" src="../assets/rockiton_black.png"/>
            <v-toolbar-title class="ml-3">Feed2Wall</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              <v-text-field
                type="password"
                v-model="password"
                label="Enter password"/>
          </v-card-text>
          <v-card-actions>
            <h4 class="red--text" v-if="!passwordCorrect">Login failed</h4>
            <v-spacer></v-spacer>
            <v-btn large color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      password: '',
      passwordCorrect: true,
    };
  },
  methods: {
    async login() {
      try {
        const payload = {
          password: this.password,
        };

        const { data: loginInfo } = await axios.post(`http://${location.host}/api/v1/login`, payload);
        const lastRequestUri = loginInfo.lastRequestedUri;
        this.passwordCorrect = true;

        window.location.href = `http://${location.host}${lastRequestUri}`;
      } catch (e) {
        console.warn(e);
        this.passwordCorrect = false;
      }
    },
  },
};
</script>

<style scoped lang="sass">
</style>
