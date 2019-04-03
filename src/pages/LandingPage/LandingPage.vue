<template>
  <div>
    <div class="hero-img-logo"></div>

    <nav
      class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light"
      id="ftco-navbar"
    >
      <div class="container">
        <div class="collapse navbar-collapse" id="ftco-nav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <a href="index.html" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
              <a href="about.html" class="nav-link">About</a>
            </li>
            <li class="nav-item">
              <a href="services.html" class="nav-link">Services</a>
            </li>
            <li class="nav-item">
              <a href="contact.html" class="nav-link">Contact</a>
            </li>
            <li class="nav-item cta">
              <a href="#" class="nav-link" @click.prevent="login">
                <span>Login</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="login-page">
      <h1 class="logo">My Bank</h1>
      <p
        class="logo-description"
      >One single and secure place to manage and analyse your banks accounts</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.$auth.idToken;
    }
  }
};
</script>

<style src="./LandingPage.scss" lang="scss" scoped />
