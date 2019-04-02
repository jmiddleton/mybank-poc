<template>
  <div class="login-page">
    <div class="hero-img-logo"></div>
    <b-container>
      <b-row>
        <b-col xl="8">
          <h1 class="logo">My Bank</h1>
          <p
            class="logo-description"
          >One single and secure place to manage and analyse your banks accounts</p>
        </b-col>
        <b-col xl="4">
          <div>
            <ul>
              <li>
                <router-link to="/app/dashboard" class="logo-description">Home</router-link>
              </li>
              <li v-if="!isAuthenticated">
                <a class="logo-description" href="#" @click.prevent="login">Login</a>
              </li>
              
            </ul>
            <span class="logo-description" v-if="profile">{{profile.email}}</span>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <footer class="footer">2017 &copy; MyBank.</footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LandingPage",
  data() {
    return {
      isAuthenticated: false,
      profile: null
    };
  },
  methods: {
    login() {
      this.$auth.login();
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
      axios.defaults.headers.common['Authorization'] = "Bearer " + this.$auth.idToken;
    }
  }
};
</script>

<style src="./LandingPage.scss" lang="scss" scoped />
