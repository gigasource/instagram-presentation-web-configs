<template>
  <v-container>
    <v-form
      ref="form"
      v-model="formValid">
      <v-layout wrap>
        <h3 class="indigo--text">Instagram configurations</h3>
        <v-flex xs12>
          <v-text-field
            :error="!isInstagramSourceValid"
            :error-messages="instagramSourceUrlErrorMsg"
            @focusout="validateInstagramSource"
            @focus="setBaseInstagramUrl"
            v-model="instagramSourceUrl"
            label="Instagram source URL"
            hint="Example: https://www.instagram.com/adidas"
            required/>
        </v-flex>

        <h3 class="indigo--text">Presentation configurations</h3>
        <v-flex xs12>
          <v-text-field
            type="number"
            :rules="numberOfPostRules"
            v-model="numberOfPostsToDisplay"
            label="Number of posts to display (Use 0 for all posts)"
            required/>
        </v-flex>

        <v-flex>
          <v-text-field
            v-model="excludedHashtags"
            label="Excluded Hashtags, separated by commas"
            hint="Example: #new, #cool, #abc"/>
        </v-flex>

        <v-flex xs12>
          <h3 class="indigo--text">Size configurations</h3>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            type="number"
            class="pr-3"
            :rules="widthRules"
            v-model="profilePicWidth"
            label="Profile image width"
            required/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            type="number"
            :rules="heightRules"
            v-model="profilePicHeight"
            label="Profile image height"
            required/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
            type="number"
            class="pr-3"
            :rules="widthRules"
            v-model="imgMainWidth"
            label="Main image width"
            required/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            type="number"
            :rules="heightRules"
            v-model="imgMainHeight"
            label="Main image height"
            required/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
            type="number"
            class="pr-3"
            :rules="sizeRules"
            v-model="usernameTextSize"
            label="Username text size"
            required/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
            type="number"
            :rules="sizeRules"
            v-model="likeTextSize"
            label="Likes text size"
            required/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
            type="number"
            class="pr-3"
            :rules="sizeRules"
            v-model="commentTextSize"
            label="Comments text size"
            required/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
            type="number"
            :rules="sizeRules"
            v-model="captionTextSize"
            label="Caption text size"
            required/>
        </v-flex>

        <v-flex xs6>
          <v-text-field
            type="number"
            class="pr-3"
            :rules="presentIntervalRules"
            v-model="presentInterval"
            label="Each image is shown for: (in milliseconds)"
            required/>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            type="number"
            :rules="refreshIntervalRules"
            v-model="refreshInterval"
            label="Images are refreshed every: (in minutes)"
            required/>
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
          <v-switch v-model="isCaptionDisplayed" :label="captionMsg"/>
        </v-flex>

        <template v-if="!isLicenseValid">
          <v-flex xs12>
            <h3 class="indigo--text">License configurations (Your key id is {{licenseKeyId}})</h3>
          </v-flex>
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
            <v-btn class="mr-2" color="primary" :disabled="!formValid"
                   @click="saveAppPreference" large>Save
            </v-btn>
            <v-btn color="error" @click="getAppPreferences" large dark>Reset</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-form>
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
      isCaptionDisplayed: false,
      isInstagramSourceValid: false,
      formValid: false,
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
      captionTextSize: 0,
      // Slideshow variables
      presentInterval: 0,
      refreshInterval: 0,
      // Validation rules
      numberOfPostRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Number of post must be an integer',
        v => parseInt(v, 10) >= 0 || 'Minimum number is 0',
      ],
      widthRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Width must be an integer',
        v => parseInt(v, 10) >= 0 || 'Minimum width is 0',
      ],
      heightRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Height must be an integer',
        v => parseInt(v, 10) >= 0 || 'Minimum height is 0',
      ],
      sizeRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Size must be an integer',
        v => parseInt(v, 10) >= 0 || 'Minimum size is 0',
      ],
      presentIntervalRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Interval must be an integer',
        v => parseInt(v, 10) >= 5000 || 'Minimum interval is 5000 milliseconds',
      ],
      refreshIntervalRules: [
        v => /^-{0,1}\d+$/.test(v) || 'Interval must be an integer',
        v => parseInt(v, 10) >= 1 || 'Minimum interval is 1 minutes',
      ],
    };
  },
  created() {
    this.getAppPreferences();
    this.getLicenseKeyId();
    this.isValidated();
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
        this.isCaptionDisplayed = appPreferences.isCaptionDisplayed;
        // Size variables
        this.profilePicWidth = appPreferences.profilePicWidth;
        this.profilePicHeight = appPreferences.profilePicHeight;
        this.imgMainWidth = appPreferences.imgMainWidth;
        this.imgMainHeight = appPreferences.imgMainHeight;
        this.usernameTextSize = appPreferences.usernameTextSize;
        this.likeTextSize = appPreferences.likeTextSize;
        this.commentTextSize = appPreferences.commentTextSize;
        this.captionTextSize = appPreferences.captionTextSize;
        // Slideshow variables
        this.presentInterval = appPreferences.presentInterval;
        this.refreshInterval = appPreferences.refreshInterval;

        this.validateInstagramSource();
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
          isCaptionDisplayed: this.isCaptionDisplayed,
          // Size variables
          profilePicWidth: this.profilePicWidth,
          profilePicHeight: this.profilePicHeight,
          usernameTextSize: this.usernameTextSize,
          imgMainWidth: this.imgMainWidth,
          imgMainHeight: this.imgMainHeight,
          likeTextSize: this.likeTextSize,
          commentTextSize: this.commentTextSize,
          captionTextSize: this.captionTextSize,
          // Slideshow variables
          presentInterval: this.presentInterval,
          refreshInterval: this.refreshInterval,
        };

        await axios.post(`http://${location.host}/api/v1/preference`, payload);
      } catch (e) {
        console.error(e);
      }
    },
    async validateInstagramSource() {
      try {
        if ((!this.instagramSourceUrl.toLowerCase().startsWith('https://www.instagram.com/')
            && !this.instagramSourceUrl.toLowerCase().startsWith('https://instagram.com/')
            && !this.instagramSourceUrl.toLowerCase().startsWith('www.instagram.com/')
            && !this.instagramSourceUrl.toLowerCase().startsWith('instagram.com/'))
            || this.instagramSourceUrl.split('instagram.com/')[1].trim().length === 0) {
          throw new Error();
        } else {
          await axios.get(this.instagramSourceUrl);
          this.instagramSourceUrlErrorMsg = '';
          this.isInstagramSourceValid = true;
        }
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
    async isValidated() {
      try {
        const { data: responseData } = axios.get(`http://${location.host}/api/v1/license/is-validated`);
        this.isLicenseValid = responseData.validated;
      } catch (e) {
        console.warn(e);
        this.isLicenseValid = true;
      }
    },
    setBaseInstagramUrl() {
      this.instagramSourceUrlErrorMsg = '';
      if (!this.instagramSourceUrl.startsWith('https://www.instagram.com/')) {
        this.instagramSourceUrl = 'https://www.instagram.com/';
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
    captionMsg() {
      return this.isCaptionDisplayed ? 'Display post caption' : 'Do not display post caption';
    },
  },
};
</script>
