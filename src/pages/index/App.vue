<template>
  <v-app>
    <v-content>
      <AppPreference v-if="isAuthorized"/>
    </v-content>
  </v-app>
</template>

<script>
import AppPreference from '../../components/AppPreference';
import isUserAuthorized from '../authorization';

export default {
  name: 'App',
  data() {
    return {
      isAuthorized: false,
    };
  },
  components: {
    AppPreference,
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
