<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type effect="light" expand>
      <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">MyBank</router-link>

      <div class="row" slot="content-header">
        <div class="col-6 collapse-brand">
          <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
            <img src="img/brand/blue.png">
          </a>
        </div>
      </div>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
            <span class="nav-link-inner--text">Products</span>
      </ul>
      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item d-none d-lg-block ml-lg-4">
          <a href="#" @click.prevent="login" class="btn btn-neutral btn-icon">
            <span class="btn-inner--icon">
              <i class="fa fa-cloud-download mr-2"></i>
            </span>
            <span class="nav-link-inner--text">Login</span>
          </a>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import axios from "axios";

export default {
  components: {
    BaseNav
  },
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
<style>
</style>
