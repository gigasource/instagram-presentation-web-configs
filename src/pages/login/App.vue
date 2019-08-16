<template>
  <v-app>
    <v-content class="root-container">
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

<style scoped lang="sass">
  .root-container
    background-image: url('../../assets/login-background.png')
    background-repeat: no-repeat
    -webkit-background-size: cover
    background-size: cover
</style>
