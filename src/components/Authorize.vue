<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-12 pa-6" >
          <v-toolbar color="transparent" flat>
            <v-img max-width="50px" src="../assets/rockiton_black.png"/>
            <v-toolbar-title class="ml-3">Feed2Wall</v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="!isAuthorized">
            <v-text-field
              type="password"
              v-model="authorizationKey"
              label="Enter Authorization Key"/>
          </v-card-text>
          <v-flex xs12 v-else-if="isRequiredLogin">
            <v-flex xs12>
              <v-text-field
                :error="!isInstagramAccountUsernameValid"
                @focusout="validateUsername"
                v-model="instagramUsername"
                label="Instagram Username"
                hint="Phone number, username, or email"
                required/>
            </v-flex>

            <v-flex xs12>
              <v-text-field
                :error="!isInstagramAccountPasswordValid"
                @focusout="validatePassword"
                v-model="instagramPassword"
                label="Instagram password"
                type="password"
                required/>
            </v-flex>
          </v-flex>
          <v-card-actions>
            <h4 class="red--text" v-show="displayAlert">{{alertMsg}}</h4>
            <v-spacer></v-spacer>
            <v-btn large color="primary" v-if="!isAuthorized" @click="authorize">Submit</v-btn>
            <v-btn large color="primary" v-else-if="isRequiredLogin" @click="saveLoginInfo">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Authorize',
  props: {
    isAuthorized: {
      type: Boolean,
      required: true,
    },
    isRequiredLogin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      authorizationKey: '',
      instagramUsername: '',
      instagramPassword: '',
      isInstagramAccountUsernameValid: false,
      isInstagramAccountPasswordValid: false,
      displayAlert: false,
      alertMsg: '',
    };
  },
  methods: {
    async authorize() {
      try {
        const payload = {
          authorizationKey: this.authorizationKey,
        };

        const { data: authorizationInfo } = await axios.post(`http://${location.host}/api/v1/authorize`, payload);
        const redirect = authorizationInfo.lastRequestedUri;
        this.displayAlert = false;

        if (!this.isRequiredInstagramLogin) {
          window.location.href = `http://${location.host}${redirect}`;
        }
      } catch (e) {
        console.warn(e);
        this.alertMsg = 'Authorization failed';
        this.displayAlert = true;
      }
    },
    validateUsername() {
      this.isInstagramAccountUsernameValid = this.instagramUsername.length !== 0;
    },
    validatePassword() {
      this.isInstagramAccountPasswordValid = this.instagramPassword.length !== 0;
    },
    async saveLoginInfo() {
      try {
        const payload = {
          username: this.instagramUsername,
          password: this.instagramPassword,
        };

        const { data: saveLoginStatus } = await axios.post(`http://${location.host}/api/v1/save-instagram-login-info`, payload);
        if (saveLoginStatus.success) {
          const redirect = saveLoginStatus.lastRequestUri;
          this.displayAlert = false;

          window.location.href = `http://${location.host}${redirect}`;
        } else {
          this.displayAlert = true;
          this.alertMsg = saveLoginStatus.error;
        }
      } catch (e) {
        console.warn(e);
        this.alertMsg = 'Saving login info failed!';
        this.displayAlert = true;
      }
    },
  },
};
</script>

<style scoped lang="sass">
</style>
