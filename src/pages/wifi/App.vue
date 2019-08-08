<template>
  <v-app>
    <v-content>
      <WifiConfig v-if="isAuthorized"/>
    </v-content>
  </v-app>
</template>

<script>
import WifiConfig from '../../components/WifiConfig';
import isUserAuthorized from '../authorization';

export default {
  name: 'App',
  data() {
    return {
      isAuthorized: false,
    };
  },
  components: {
    WifiConfig,
  },
  async beforeCreate() {
    if (!(await isUserAuthorized())) {
      window.location.href = `http://${location.host}/login`;
    } else {
      this.isAuthorized = true;
    }
  },
};
</script>
