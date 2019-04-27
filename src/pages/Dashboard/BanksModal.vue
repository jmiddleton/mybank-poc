
<template>
  <!-- Modal Component -->
  <b-modal id="modal-scrollable" scrollable title="Select a Bank" v-model="show">
    <div class="widgetBody widget-body p-0">
      <div v-if="banks && banks.length > 0" class="list-group-item list-group list-group-lg">
        <a
          href="#"
          @click="authorise(bank)"
          class="list-group-item"
          v-for="bank in banks"
          :key="bank.code"
        >
          <span class="notificationIcon thumb-sm">
            <img
              :src="require('../../assets/banks/' + bank.logo_url)"
              alt="..."
              class="rounded-circle"
            >
          </span>
          <div>
            <h6 class="m-0">{{bank.name}}</h6>
            <small class="text-muted">{{bank.url}}</small>
          </div>
        </a>
      </div>
      <div v-else>
        <span>
          <i class="la la-refresh la-spin"/> Loading list of banks...
        </span>
      </div>
    </div>
    <div slot="modal-footer" class="w-100">
      <b-button variant="primary" size="sm" class="float-right" @click="show=false">Close</b-button>
    </div>
  </b-modal>
</template>
<script>
import Vue from "vue";
import axios from "axios";

export default {
  name: "BanksModal",
  data() {
    return {
      show: false,
      banks: []
    };
  },
  methods: {
    authorise(bank) {
      Vue.prototype.$auth.authorise("/app/dashboard", "/link-accounts", bank);
    }
  },
  watch: {
    show() {
      //TODO: move to a state
      axios
        .get("/banks")
        .then(r => r.data)
        .then(banks => {
          this.banks = banks;
        });
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped />