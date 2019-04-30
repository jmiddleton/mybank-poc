<template>
  <div class="email-page">
    <h1 class="page-title">Notifications</h1>
    <div class="view">
      <b-row>
        <!-- <Filters :filter="filter" :openMessage="openMessage" :compose="changeCompose"/> -->
        <MessageTable
          :filter="filterValue"
          :openedMessage="openedMessage"
          :openMessage="openMessage"
          :compose="compose"
          :changeCompose="changeCompose"
          :composeData="composeData"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

//import Filters from './components/Filters/Filters';
import MessageTable from './MessageTable';

export default {
  name: "Notifications",
  components: {MessageTable},
  data() {
    return {
      isNotificationOpen: true,
      openedMessage: null,
      alertAfter: false
    };
  },
  methods: {
    fixAlert() {
      Vue.set(this, "alertAfter", true);
    },
    filter(filterValue) {
      Vue.set(this, "filterValue", filterValue);
    },
    closeNotification() {
      Vue.set(this, "isNotificationOpen", false);
    },
    openMessage(id) {
      Vue.set(this, "openedMessage", id);
    }
  },
  created() {
    setTimeout(() => {
      this.fixAlert();
    }, 500);
  }
};
</script>

<style src="./Notifications.scss" lang="scss" scoped />
