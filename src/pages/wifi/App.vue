<template>
  <v-app>
    <v-content>
      <WifiConfig v-if="displayable"/>
    </v-content>
  </v-app>
</template>

<script>
import WifiConfig from '../../components/WifiConfig';
import { isUserAuthorized, isRequiredInstagramLogin } from '../authorization';

export default {
  name: 'App',
  data() {
    return {
      displayable: false,
    };
  },
  components: {
    WifiConfig,
  },
  async beforeCreate() {
    try {
      const isAuthorized = await isUserAuthorized();
      const isRequiredLogin = await isRequiredInstagramLogin();

      this.displayable = isAuthorized && !isRequiredLogin;

      if (!this.displayable) {
        window.location.href = `http://${location.host}/authorize`;
      }
    } catch (e) {
      console.error(e);
    }
  },
};
</script>
