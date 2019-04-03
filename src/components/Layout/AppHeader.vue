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
        <base-dropdown class="nav-item" menu-classes="dropdown-menu-xl">
          <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
            <i class="ni ni-ui-04 d-lg-none"></i>
            <span class="nav-link-inner--text">Products</span>
          </a>
          <div class="dropdown-menu-inner">
            <a
              href="https://demos.creative-tim.com/vue-argon-design-system/documentation/"
              class="media d-flex align-items-center"
            >
              <div class="icon icon-shape bg-gradient-primary rounded-circle text-white">
                <i class="ni ni-spaceship"></i>
              </div>
              <div class="media-body ml-3">
                <h6 class="heading text-primary mb-md-1">Getting started</h6>
                <p class="description d-none d-md-inline-block mb-0">
                  Get started with Bootstrap, the
                  world's most popular framework for building responsive sites.
                </p>
              </div>
            </a>
            <a
              href="https://demos.creative-tim.com/vue-argon-design-system/documentation/"
              class="media d-flex align-items-center"
            >
              <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
                <i class="ni ni-ui-04"></i>
              </div>
              <div class="media-body ml-3">
                <h5 class="heading text-warning mb-md-1">Components</h5>
                <p class="description d-none d-md-inline-block mb-0">
                  Learn how to use Argon
                  compiling Scss, change brand colors and more.
                </p>
              </div>
            </a>
          </div>
        </base-dropdown>
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
import BaseDropdown from "@/components/BaseDropdown";
import axios from "axios";

export default {
  components: {
    BaseNav,
    BaseDropdown
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
