<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
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
          <v-flex xs12 v-else-if="isRequiredSecurityCode">
            <v-text-field
              v-model="securityCode"
              maxlength="6"
              label="Login Security Code"/>
          </v-flex>
          <h4 :class="alertClass" v-show="displayAlert">{{alertMsg}}</h4>
            <v-container>
              <v-row v-if="!isAuthorized">
                <v-col cols="8" sm="8" md="8"></v-col>
                <v-col class="d-flex align-end flex-column" cols="4" sm="4" md="4"><v-btn large color="primary" :loading="buttonDisabled" @click="authorize">Submit</v-btn></v-col>
              </v-row>
              <v-row v-else-if="isRequiredLogin">
                <v-col cols="4" sm="4" md="4"><v-btn large v-if="showBackButton" :loading="buttonDisabled" @click="backToSubmitCode">Back</v-btn></v-col>
                <v-col cols="4" sm="4" md="4"></v-col>
                <v-col class="d-flex align-end flex-column" cols="4" sm="4" md="4"><v-btn large color="primary" :loading="buttonDisabled" @click="saveLoginInfo">Save</v-btn></v-col>
              </v-row>
              <v-row v-else-if="isRequiredSecurityCode">
                <v-col cols="4" md="4" sm="4"><v-btn color="error" @click="logout" :loading="buttonDisabled">Logout</v-btn></v-col>
                <v-col cols="4" md="4" sm="4"><v-btn @click="getNewSecurityCode" :loading="buttonDisabled">New code</v-btn></v-col>
                <v-col class="d-flex align-end flex-column" cols="4" md="4" sm="4"><v-btn color="primary" @click="submitSecurityCode" :loading="buttonDisabled">Submit</v-btn></v-col>
              </v-row>
            </v-container>
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
    isRequiredSecurityCode: {
      type: Boolean,
      require: true,
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
      alertClass: '',
      securityCode: '',
      buttonDisabled: false,
      showBackButton: false,
    };
  },
  methods: {
    async authorize() {
      this.buttonDisabled = true;
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
        this.alertClass = 'red--text';
      } finally {
        this.buttonDisabled = false;
      }
    },
    validateUsername() {
      this.isInstagramAccountUsernameValid = this.instagramUsername.length !== 0;
    },
    validatePassword() {
      this.isInstagramAccountPasswordValid = this.instagramPassword.length !== 0;
    },
    async saveLoginInfo() {
      this.buttonDisabled = true;
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
          this.alertClass = 'red--text';
        }
      } catch (e) {
        console.warn(e);
        this.alertMsg = 'Saving login info failed!';
        this.displayAlert = true;
        this.alertClass = 'red--text';
      } finally {
        this.buttonDisabled = false;
      }
    },
    async submitSecurityCode() {
      this.buttonDisabled = true;
      try {
        const payload = {
          securityCode: this.securityCode,
        };

        const { data: saveSecurityCodeStatus } = await axios.post(`http://${location.host}/api/v1/submit-security-code`, payload);
        if (saveSecurityCodeStatus.success) {
          this.alertMsg = 'Submit code successful. Retry submitting if device\'s screen show error message';
          this.displayAlert = true;
          this.alertClass = 'green--text';
        } else {
          this.displayAlert = true;
          this.alertMsg = saveSecurityCodeStatus.error;
          this.alertClass = 'red--text';
        }
      } catch (e) {
        console.warn(e);
        this.alertMsg = 'Submitting security code failed!';
        this.displayAlert = true;
        this.alertClass = 'red--text';
      } finally {
        this.buttonDisabled = false;
      }
    },
    logout() {
      this.isRequiredSecurityCode = false;
      this.isRequiredLogin = true;
      this.showBackButton = true;
      this.displayAlert = false;
    },
    backToSubmitCode() {
      this.isRequiredSecurityCode = true;
      this.isRequiredLogin = false;
      this.displayAlert = false;
    },
    async getNewSecurityCode() {
      this.buttonDisabled = true;
      try {
        await axios.get(`http://${location.host}/api/v1/get-new-code`);
        this.alertMsg = 'Please check your email';
        this.displayAlert = true;
        this.alertClass = 'green--text';
      } catch (e) {
        console.warn(e);
        this.alertMsg = 'Send request failed';
        this.displayAlert = true;
        this.alertClass = 'red--text';
      } finally {
        this.buttonDisabled = false;
      }
    },
  },
};
</script>

<style scoped lang="sass">
</style>
