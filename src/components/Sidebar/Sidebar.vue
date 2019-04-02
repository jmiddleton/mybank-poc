<template>
  <nav
    :class="{sidebar: true, sidebarStatic, sidebarOpened}"
    @mouseenter="sidebarMouseEnter"
    @mouseleave="sidebarMouseLeave"
  >
    <header class="logo">
      <router-link to="/app/dashboard"><span class="text-warning">My</span> Bank</router-link>
    </header>
    <ul class="nav">
      <NavLink
        header="My Dashboard"
        link="/app/dashboard"
        iconName="flaticon-home"
        index="dashboard"
        isHeader
      />
      <NavLink
        header="Transfers"
        link="/app/transfers"
        iconName="flaticon-list"
        index="transfers"
        isHeader
      />
      <NavLink
        header="Spending"
        link="/app/spending"
        iconName="fi flaticon-controls"
        index="spending"
        isHeader
      />
      <NavLink
        header="Payees"
        link="/app/payees"
        iconName="flaticon-equal-1"
        index="tables"
        isHeader
      />
      <NavLink
        header="Notifications"
        link="/app/notifications"
        iconName="flaticon-star"
        index="notifications"
        isHeader
      />
      <NavLink
        header="Branches"
        link="/app/branches"
        iconName="fi flaticon-map-location"
        index="branches"
        isHeader
      />
    </ul>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import isScreen from '@/core/screenHelper';
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar',
  components: { NavLink },
  data() {
    return {

    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    },
    sidebarMouseEnter() {
      if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
        this.switchSidebar(false);
        this.setActiveByRoute();
      }
    },
    sidebarMouseLeave() {
      if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      }
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarStatic: state => state.sidebarStatic,
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
