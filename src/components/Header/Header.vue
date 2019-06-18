<template>
  <b-navbar class="header d-print-none">
    <b-nav>
      <b-nav-item>
        <a class="d-md-down-none px-2" href="#" @click="toggleSidebarMethod" id="barsTooltip">
          <i class="la la-bars la-lg"/>
        </a>
        <a class="fs-lg d-lg-none" href="#" @click="switchSidebarMethod">
          <i class="la la-bars la-lg d-block ml-4"/>
        </a>
      </b-nav-item>
    </b-nav>
    <b-nav>
      <b-form class="d-sm-down-none ml-5" inline>
        <b-form-group>
          <b-input-group class="input-group-no-border">
            <div class="input-group-addon d-flex align-items-center">
              <i class="la la-search px-3"/>
            </div>
            <b-input id="search-input" placeholder="What would you like to do..."/>
          </b-input-group>
        </b-form-group>
      </b-form>
    </b-nav>
    <b-nav class="ml-auto">
      <b-nav-item @click="openScheduledPayments">
        <i class="glyphicon glyphicon-glyph-calendar px-2 iconSize text-blue"/>
        <span>2 scheduled payments</span>
      </b-nav-item>
    </b-nav>
    <b-nav class="ml-auto">
      <b-nav-item @click="openNotifications">
        <i class="la la-bell la-lg iconSize"/>
        <span class="circle bg-warning text-white fw-bold">4</span>
      </b-nav-item>
      <b-nav-item-dropdown
        id="basic-nav-dropdown"
        class="notificationsMenu mr-2"
        extra-menu-classes="notificationsWrapper py-0 animated animated-fast fadeInUp"
        right
      >
        <template slot="button-content" v-if="this.$auth.profile">
          <span class="avatar thumb-sm float-left mr-2">
            <img class="rounded-circle" :src="this.$auth.profile.picture" alt="...">
          </span>
          <span class="small">
            <span class="fw-semi-bold">{{ this.$auth.profile.nickname }}</span>
          </span>
        </template>
        <b-dropdown-item @click="profile">
          <i class="la la-user"/> My Profle
        </b-dropdown-item>
        <b-dropdown-divider/>
        <b-dropdown-item-button @click="logout">
          <i class="la la-power-off"/> Log Out
        </b-dropdown-item-button>
      </b-nav-item-dropdown>
      <b-nav-item @click="logout">
        <i class="la la-power-off px-2"/>
      </b-nav-item>
    </b-nav>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from "vuex";
import $ from "jquery";

export default {
  name: "Headed",
  components: {},
  computed: {
    ...mapState("layout", {
      sidebarClose: state => state.sidebarClose,
      sidebarStatic: state => state.sidebarStatic
    })
  },
  methods: {
    ...mapActions("layout", [
      "toggleSidebar",
      "switchSidebar",
      "changeSidebarActive"
    ]),
    switchSidebarMethod() {
      if (!this.sidebarClose) {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      } else {
        this.switchSidebar(false);
        const paths = this.$route.fullPath.split("/");
        paths.pop();
        this.changeSidebarActive(paths.join("/"));
      }
    },
    toggleSidebarMethod() {
      if (this.sidebarStatic) {
        this.toggleSidebar();
        this.changeSidebarActive(null);
      } else {
        this.toggleSidebar();
        const paths = this.$route.fullPath.split("/");
        paths.pop();
        this.changeSidebarActive(paths.join("/"));
      }
    },
    logout() {
      this.$auth.logout();
      this.$router.push("/");
    },
    profile() {
      this.$router.push("/app/profile");
    },
    openNotifications() {
      this.$router.push("/app/notifications");
    },
    openScheduledPayments(){
      this.$router.push("/app/regularPayments");
    }
  },
  created() {}
};
</script>

<style src="./Header.scss" lang="scss" scoped />
