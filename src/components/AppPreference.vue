<template>
  <v-container>
    <v-layout wrap>
      <h3 class="indigo--text">Instagram configurations</h3>
      <v-flex xs12>
        <v-text-field
          :error="!isInstagramSourceValid"
          :error-messages="instagramSourceUrlErrorMsg"
          @change="validateInstagramSource"
          v-model="instagramSourceUrl"
          label="Instagram source URL"/>
      </v-flex>

      <h3 class="indigo--text">Presentation configurations</h3>
      <v-flex xs12>
        <v-text-field
          type="number"
          :rules="numberOfPostRules"
          v-model="numberOfPostsToDisplay"
          label="Number of posts to display (Use 0 for all posts)"/>
      </v-flex>

      <v-flex>
        <v-text-field
          v-model="excludedHashtags"
          label="Excluded Hashtags, separated by commas"/>
      </v-flex>

      <v-flex xs12>
        <h3 class="indigo--text">Size configurations</h3>
      </v-flex>
      <v-flex xs6>
        <v-text-field
          type="number"
          class="pr-3"
          v-model="profilePicWidth"
          label="Profile image width"/>
      </v-flex>
      <v-flex xs6>
        <v-text-field
          type="number"
          v-model="profilePicHeight"
          label="Profile image height"/>
      </v-flex>

      <v-flex xs6>
        <v-text-field
          type="number"
          class="pr-3"
          v-model="imgMainWidth"
          label="Main image width"/>
      </v-flex>
      <v-flex xs6>
        <v-text-field
          type="number"
          v-model="imgMainHeight"
          label="Main image height"/>
      </v-flex>

      <v-flex xs6>
        <v-text-field
          type="number"
          class="pr-3"
          v-model="likeTextSize"
          label="Likes text size"/>
      </v-flex>

      <v-flex xs6>
        <v-text-field
          type="number"
          v-model="commentTextSize"
          label="Comments text size"/>
      </v-flex>

      <v-flex xs6>
        <v-text-field
          type="number"
          class="pr-3"
          v-model="descriptionTextSize"
          label="Description text size"/>
      </v-flex>
      <v-flex xs6/>

      <v-flex xs12>
        <v-text-field
          type="number"
          v-model="presentInterval"
          label="Each image is shown for: (in ms, 1000ms = 1 second)"/>
      </v-flex>

      <h3 class="indigo--text">Visibility configurations</h3>
      <v-flex xs12>
        <v-switch v-model="isProfilePicDisplayed" :label="profilePicMsg"/>
      </v-flex>

      <v-flex xs12>
        <v-switch v-model="isUsernameDisplayed" :label="usernameMsg"/>
      </v-flex>

      <v-flex xs12>
        <v-switch v-model="isLikesDisplayed" :label="likeMsg"/>
      </v-flex>

      <v-flex xs12>
        <v-switch v-model="isCommentsDisplayed" :label="commentMsg"/>
      </v-flex>

      <v-flex xs12>
        <v-switch v-model="isDescriptionDisplayed" :label="descriptionMsg"/>
      </v-flex>

      <template v-if="!isLicenseValid">
        <h3 class="indigo--text">License configurations (Your key id is {{licenseKeyId}})</h3>
        <v-flex xs9>
          <v-text-field
            class="pr-3"
            v-model="licenseKey"
            label="Enter license key"/>
        </v-flex>
        <v-flex xs3>
          <v-layout align-center fill-height>
            <v-btn class="white--text" color="green"
                   :disabled="isLicenseSubmitted && isLicenseValid"
                   @click="validateKey">Submit
            </v-btn>
          </v-layout>
        </v-flex>
      </template>

      <v-flex xs12>
        <h6 class="green--text" v-if="isLicenseSubmitted && isLicenseValid">
          Success! please click "Save" to refresh the application</h6>
        <h6 class="red--text" v-else-if="isLicenseSubmitted && !isLicenseValid">
          Invalid license key</h6>
      </v-flex>
      <!--Buttons at the bottom-->
      <v-flex xs12 mt-12>
        <v-layout justify-center>
          <v-btn class="mr-2" color="primary" @click="saveAppPreference" large>Save</v-btn>
          <v-btn color="error" @click="getAppPreferences" large dark>Reset</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      // Data variables
      instagramSourceUrl: '',
      numberOfPostsToDisplay: 0,
      excludedHashtags: '',
      isProfilePicDisplayed: false,
      isUsernameDisplayed: false,
      isLikesDisplayed: false,
      isCommentsDisplayed: false,
      isDescriptionDisplayed: false,
      isInstagramSourceValid: false,
      // License variables
      licenseKey: '',
      licenseKeyId: '',
      isLicenseValid: false,
      isLicenseSubmitted: false,
      // Messages
      instagramSourceUrlErrorMsg: 'Please specify a valid Instagram user URL',
      // Size variables
      profilePicWidth: 0,
      profilePicHeight: 0,
      usernameTextSize: 0,
      imgMainWidth: 0,
      imgMainHeight: 0,
      likeTextSize: 0,
      commentTextSize: 0,
      descriptionTextSize: 0,
      presentInterval: 0,
      // Validation rules
      numberOfPostRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Number of post must be an integer',
        v => parseInt(v, 10) >= 0 || 'Number of post must >= 0',
      ],
    };
  },
  created() {
    this.getAppPreferences();
    this.validateInstagramSource();
    this.getLicenseKeyId();
  },
  methods: {
    async getAppPreferences() {
      try {
        const { data: appPreferences } = await axios.get(`http://${location.host}/api/v1/preference`);

        // Data variables
        this.instagramSourceUrl = appPreferences.instagramSourceUrl;
        this.numberOfPostsToDisplay = appPreferences.numberOfPostsToDisplay;
        this.excludedHashtags = appPreferences.excludedHashtags;
        this.isProfilePicDisplayed = appPreferences.isProfilePicDisplayed;
        this.isUsernameDisplayed = appPreferences.isUsernameDisplayed;
        this.isLikesDisplayed = appPreferences.isLikesDisplayed;
        this.isCommentsDisplayed = appPreferences.isCommentsDisplayed;
        this.isDescriptionDisplayed = appPreferences.isDescriptionDisplayed;
        // Size variables
        this.profilePicWidth = appPreferences.profilePicWidth;
        this.profilePicHeight = appPreferences.profilePicHeight;
        this.usernameTextSize = appPreferences.usernameTextSize;
        this.imgMainWidth = appPreferences.imgMainWidth;
        this.imgMainHeight = appPreferences.imgMainHeight;
        this.likeTextSize = appPreferences.likeTextSize;
        this.commentTextSize = appPreferences.commentTextSize;
        this.descriptionTextSize = appPreferences.descriptionTextSize;
        this.presentInterval = appPreferences.presentInterval;
      } catch (e) {
        console.error(e);
      }
    },
    async saveAppPreference() {
      try {
        const payload = {
          instagramSourceUrl: this.instagramSourceUrl,
          numberOfPostsToDisplay: this.numberOfPostsToDisplay,
          excludedHashtags: this.excludedHashtags,
          isProfilePicDisplayed: this.isProfilePicDisplayed,
          isUsernameDisplayed: this.isUsernameDisplayed,
          isLikesDisplayed: this.isLikesDisplayed,
          isCommentsDisplayed: this.isCommentsDisplayed,
          isDescriptionDisplayed: this.isDescriptionDisplayed,
          // Size variables
          profilePicWidth: this.profilePicWidth,
          profilePicHeight: this.profilePicHeight,
          usernameTextSize: this.usernameTextSize,
          imgMainWidth: this.imgMainWidth,
          imgMainHeight: this.imgMainHeight,
          likeTextSize: this.likeTextSize,
          commentTextSize: this.commentTextSize,
          descriptionTextSize: this.descriptionTextSize,
          presentInterval: this.presentInterval,
        };

        await axios.post(`http://${location.host}/api/v1/preference`, payload);
      } catch (e) {
        console.error(e);
      }
    },
    async validateInstagramSource() {
      try {
        await axios.get(this.instagramSourceUrl);
        this.instagramSourceUrlErrorMsg = '';
        this.isInstagramSourceValid = true;
      } catch (e) {
        this.instagramSourceUrlErrorMsg = 'Please specify a valid Instagram user URL';
        this.isInstagramSourceValid = false;
      }
    },
    async getLicenseKeyId() {
      try {
        const { data: licenseKeyId } = await axios.get(`http://${location.host}/api/v1/license`);
        this.licenseKeyId = licenseKeyId;
      } catch (e) {
        console.warn(e);
      }
    },
    async validateKey() {
      try {
        const payload = { licenseKey: this.licenseKey };
        await axios.post(`http://${location.host}/api/v1/license/validate`, payload);
        this.isLicenseValid = true;
      } catch (e) {
        console.warn(e);
        this.isLicenseValid = false;
      }
      this.isLicenseSubmitted = true;
    },
  },
  computed: {
    profilePicMsg() {
      return this.isProfilePicDisplayed ? 'Display user\'s profile picture' : 'Do not display user\'s profile picture';
    },
    usernameMsg() {
      return this.isUsernameDisplayed ? 'Display username' : 'Do not display username';
    },
    likeMsg() {
      return this.isLikesDisplayed ? 'Display number of likes' : 'Do not display number of likes';
    },
    commentMsg() {
      return this.isCommentsDisplayed ? 'Display number of comments' : 'Do not display number of comments';
    },
    descriptionMsg() {
      return this.isDescriptionDisplayed ? 'Display post description' : 'Do not display post description';
    },
  },
};
</script>
