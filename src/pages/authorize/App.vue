<template>
  <v-app>
    <v-content>
      <Authorize v-if="displayable" :isAuthorized="isAuthorized" :isRequiredLogin="isRequiredLogin" :isRequiredSecurityCode="isRequiredSecurityCode"/>
    </v-content>
  </v-app>
</template>

<script>
import Authorize from '../../components/Authorize';
import { isUserAuthorized, isRequiredInstagramLogin, isRequiredLoginSecurityCode } from '../authorization';

export default {
  name: 'App',
  data() {
    return {
      displayable: false,
      isAuthorized: true,
      isRequiredLogin: false,
    };
  },
  components: {
    Authorize,
  },
  async beforeCreate() {
    try {
      const isAuthorized = await isUserAuthorized();
      const isRequiredLogin = await isRequiredInstagramLogin();
      const isRequiredSecurityCode = await isRequiredLoginSecurityCode();

      this.displayable = !isAuthorized || isRequiredLogin || isRequiredSecurityCode;
      this.isAuthorized = isAuthorized;
      this.isRequiredLogin = isRequiredLogin;
      this.isRequiredSecurityCode = isRequiredSecurityCode;

      if (!this.displayable) {
        window.location.href = `http://${location.host}/`;
      }
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style scoped lang="sass">
</style>
