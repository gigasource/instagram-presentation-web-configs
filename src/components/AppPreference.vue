<template>
  <v-container>
    <v-layout text-center wrap>
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
          :rules="numberOfPostRules"
          v-model="numberOfPostsToDisplay"
          label="Max number of posts to display (Use 0 for displaying all available posts)"/>
      </v-flex>

      <v-flex xs12>
        <v-text-field
          v-model="excludedHashtags"
          label="Excluded Hashtags, separated by commas"/>
      </v-flex>

      <h3 class="indigo--text">Size configurations</h3>
      <v-flex xs12>
        <v-subheader>Main image's width</v-subheader>
        <v-slider
          v-model="defaultMainImageWidth"
          min="20"
          max="30"
          thumb-label/>
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

      <!--Buttons at the bottom-->
      <v-flex xs12>
        <v-btn class="mr-2" color="primary" @click="saveAppPreference" large>Save</v-btn>
        <v-btn color="error" @click="getAppPreferences" large dark>Reset</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      instagramSourceUrl: '',
      numberOfPostsToDisplay: 0,
      excludedHashtags: '',
      isProfilePicDisplayed: false,
      isUsernameDisplayed: false,
      isLikesDisplayed: false,
      isCommentsDisplayed: false,
      isDescriptionDisplayed: false,
      isInstagramSourceValid: false,
      instagramSourceUrlErrorMsg: 'Please specify a valid Instagram user URL',
      defaultMainImageWidth: 1920,
      numberOfPostRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Number of post must be an integer',
        v => parseInt(v, 10) >= 0 || 'Number of post must >= 0',
      ],
    };
  },
  created() {
    this.getAppPreferences();
    this.validateInstagramSource();
  },
  methods: {
    async getAppPreferences() {
      try {
        const { data: appPreferences } = await axios.get(`http://${location.host}/preference`);

        this.instagramSourceUrl = appPreferences.instagramSourceUrl;
        this.numberOfPostsToDisplay = appPreferences.numberOfPostsToDisplay;
        this.excludedHashtags = appPreferences.excludedHashtags;
        this.isProfilePicDisplayed = appPreferences.isProfilePicDisplayed;
        this.isUsernameDisplayed = appPreferences.isUsernameDisplayed;
        this.isLikesDisplayed = appPreferences.isLikesDisplayed;
        this.isCommentsDisplayed = appPreferences.isCommentsDisplayed;
        this.isDescriptionDisplayed = appPreferences.isDescriptionDisplayed;
      } catch (e) {
        console.warn(e);
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
        };

        await axios.post(`http://${location.host}/preference`, payload);
      } catch (e) {
        console.warn(e);
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
