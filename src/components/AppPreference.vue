<template>
  <v-container class="main-container">
    <v-form
      ref="form"
      v-model="formValid">
      <v-layout wrap>
          <v-flex xs12 md6>
            <v-layout align-center fill-height>
              <h3 class="indigo--text">Instagram configurations</h3>
            </v-layout>
          </v-flex>
          <v-flex xs12 md6>
            <v-radio-group v-model="sourceConfigMode" row>
              <v-radio
                label="Get posts by URL"
                :value="1"
                @change="changeMode"
              ></v-radio>
              <v-radio
                label="Get posts by hashtag"
                :value="2"
                @change="changeMode"
              ></v-radio>
            </v-radio-group>
          </v-flex>
        <v-flex xs12>
          <v-flex xs12 v-if="sourceConfigMode === MODE_URL">
            <v-text-field
              :error="!isInstagramSourceValid"
              :error-messages="instagramSourceUrlErrorMsg"
              @focusout="validateInstagramSourceUrl"
              @focus="setBaseInstagramUrl"
              v-model="instagramSourceUrl"
              label="Instagram source URL"
              hint="Example: https://www.instagram.com/adidas"
              required/>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              :error="!isInstagramSourceTagsValid"
              :rules="hashtagsRules"
              v-model="instagramSourceTags"
              @input="watchHashtagInput"
              :label="sourceConfigMode === MODE_URL ? 'Get posts with these tags only'
              : 'Instagram source hashtags'"
              :hint="sourceConfigMode === MODE_URL ? 'Separated by commas, example: #fashion, #sport, #art'
              : 'Only 1 hashtag is allowed, example: #sport'"
              required/>
          </v-flex>
        </v-flex>

        <v-flex xs12 mt-6>
          <h3 class="indigo--text" >Presentation configurations</h3>
          <v-text-field
            type="number"
            :rules="numberOfPostRules"
            v-model="numberOfPostsToDisplay"
            label="Number of posts to display"
            required/>
        </v-flex>

        <v-flex>
          <v-text-field
            :rules="excludedHashtagsRules"
            v-model="excludedHashtags"
            label="Excluded Hashtags, separated by commas"
            hint="Example: #new, #cool, #abc"/>
        </v-flex>

        <v-flex xs12 mt-6>
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

        <v-flex xs12 mt-6>
          <h3 class="indigo--text">Visibility configurations</h3>
        </v-flex>
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
import _ from 'lodash';

export default {
  data() {
    return {
      // Data variables
      instagramSourceUrl: '',
      instagramSourceTags: '',
      numberOfPostsToDisplay: 0,
      excludedHashtags: '',
      isProfilePicDisplayed: false,
      isUsernameDisplayed: false,
      isLikesDisplayed: false,
      isCommentsDisplayed: false,
      isCaptionDisplayed: false,
      isInstagramSourceValid: false,
      isInstagramSourceTagsValid: true,
      formValid: false,
      sourceConfigMode: 1,
      MODE_URL: 1,
      MODE_HASHTAG: 2,
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
        v => parseInt(v, 10) > 0 || 'Minimum number is 1',
        v => parseInt(v, 10) <= 100 || 'Maximum number is 100',
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
    isStringBlank(s) {
      return !s || s.trim().length === 0;
    },
    async getAppPreferences() {
      try {
        const { data: appPreferences } = await axios.get(`http://${location.host}/api/v1/preference`);

        // Data variables
        this.instagramSourceUrl = appPreferences.instagramSourceUrl;
        this.instagramSourceTags = appPreferences.instagramSourceTags;
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

        this.validateInstagramSourceUrl();
      } catch (e) {
        console.error(e);
      }
    },
    async saveAppPreference() {
      try {
        const payload = {
          instagramSourceUrl: this.instagramSourceUrl,
          instagramSourceTags: this.instagramSourceTags,
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
    async validateInstagramSourceUrl() {
      if (this.sourceConfigMode === this.MODE_HASHTAG) return;

      try {
        if ((!this.instagramSourceUrl.toLowerCase().startsWith('https://www.instagram.com/')
            && !this.instagramSourceUrl.toLowerCase().startsWith('https://instagram.com/')
            && !this.instagramSourceUrl.toLowerCase().startsWith('www.instagram.com/')
            && !this.instagramSourceUrl.toLowerCase().startsWith('instagram.com/'))
            || this.instagramSourceUrl.split('instagram.com/')[1].trim().length === 0) {
          throw new Error();
        } else {
          await axios.get(this.instagramSourceUrl);

          // Fix a bug where changing mode too fast can cause incorrect validation
          if (this.isStringBlank(this.instagramSourceUrl)) throw new Error();

          this.instagramSourceUrlErrorMsg = '';
          this.isInstagramSourceValid = true;
        }
      } catch (e) {
        this.instagramSourceUrlErrorMsg = 'Please specify a valid Instagram user URL';
        this.isInstagramSourceValid = false;
      }
      this.$refs.form.validate();
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
    watchHashtagInput() {
      // Skip check if mode == get by hashtags
      if (this.sourceConfigMode === this.MODE_HASHTAG) {
        return;
      }

      if (!this.isStringBlank(this.instagramSourceUrl)) {
        this.isInstagramSourceValid = true;
        this.instagramSourceUrlErrorMsg = '';
      } else {
        this.isInstagramSourceValid = false;
        this.instagramSourceUrlErrorMsg = 'Please specify a valid Instagram user URL';
      }
    },
    changeMode() {
      this.instagramSourceTags = '';
      this.instagramSourceUrl = '';
      this.validateInstagramSourceUrl();
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
    hashtagsRules() {
      const rules = [];

      // If mode = get posts by hashtags -> only 1 hashtag is allowed
      if (this.sourceConfigMode === this.MODE_HASHTAG) {
        rules.push(v => !this.isStringBlank(v)
          || 'Please specify a hashtag, example: #sport');

        rules.push(v => v.split(',').length <= 1 || 'Only 1 hashtag is allowed');
      }

      // Else -> multiple hashtags are allowed
      rules.push((v) => {
        const hashtags = v.split(',');
        for (let i = 0; i < hashtags.length; i += 1) {
          const hashtag = hashtags[i].trim();
          if (!this.isStringBlank(hashtag) && !hashtag.startsWith('#')) {
            return 'Hashtags must start with #';
          }

          const hashtagContent = hashtags[i].trim().substring(1);
          if (!this.isStringBlank(hashtagContent) && !(/^[0-9a-zA-Z]+$/.test(hashtagContent))) {
            return 'Hashtags can only caontain letters and number';
          }
        }
        return true;
      });

      return rules;
    },
    excludedHashtagsRules() {
      const rules = [];
      const excludedHashtags = this.excludedHashtags.replace(/\s/g, '').toLowerCase().split(',');
      const requiredHashtags = this.instagramSourceTags.replace(/\s/g, '').toLowerCase().split(',');

      rules.push(() => {
        if (!this.isStringBlank(this.excludedHashtags)
          && !this.isStringBlank(this.instagramSourceTags)
          && _.intersection(excludedHashtags, requiredHashtags).length > 0) {
          return 'Excluded hashtags conflict with source hashtags';
        }
        return true;
      });

      return rules;
    },
  },
};
</script>

<style scoped lang="sass">
    $screen-mobile-min-width: 320px
    $screen-desktop-min-width: 1025px

    .source-result
      @media screen and (min-width: $screen-mobile-min-width)
        font-size: 0.9em
        margin-top: 1em
        font-weight: bold

      @media screen and (min-width: $screen-desktop-min-width)
        font-size: 1.4em

    .main-container
      @media screen and (min-width: $screen-desktop-min-width)
        max-width: 800px
</style>