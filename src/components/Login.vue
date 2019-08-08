<template>
  <v-container fill-height>
    <v-layout align-content-center align-center justify-center wrap>
      <h3 class="indigo--text">Enter password to access config pages</h3>

      <v-flex xs12 mt-6>
        <v-text-field
          type="password"
          v-model="password"
          label="Enter password"/>
      </v-flex>

      <v-flex xs12>
        <v-layout justify-center>
          <v-btn color="primary" large @click="login">Connect</v-btn>
        </v-layout>
      </v-flex>

      <v-flex xs12 mt-2 v-if="!isPasswordCorrect">
        <v-layout justify-center>
          <h4 class="red--text">Wrong password!</h4>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      password: '',
      isPasswordCorrect: true,
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
        this.isPasswordCorrect = true;

        window.location.href = `http://${location.host}${lastRequestUri}`;
      } catch (e) {
        console.warn(e);
        this.isPasswordCorrect = false;
      }
    },
  },
};
</script>

<style scoped>

</style>
