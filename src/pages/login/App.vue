<template>
  <v-app>
    <v-content>
      <Login v-if="!isAuthorized"/>
    </v-content>
  </v-app>
</template>

<script>
import Login from '../../components/Login';
import isUserAuthorized from '../authorization';

export default {
  name: 'App',
  data() {
    return {
      isAuthorized: true,
    };
  },
  components: {
    Login,
  },
  async beforeCreate() {
    if (await isUserAuthorized()) {
      window.location.href = `http://${location.host}/`;
    } else {
      this.isAuthorized = false;
    }
  },
};
</script>
