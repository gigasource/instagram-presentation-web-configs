<template>
  <v-app>
    <v-content>
      <Authorize v-if="displayable" :isAuthorized="isAuthorized" :isRequiredLogin="isRequiredLogin"/>
    </v-content>
  </v-app>
</template>

<script>
import Authorize from '../../components/Authorize';
import { isUserAuthorized, isRequiredInstagramLogin } from '../authorization';

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

      this.displayable = !isAuthorized || isRequiredLogin;
      this.isAuthorized = isAuthorized;
      this.isRequiredLogin = isRequiredLogin;

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
