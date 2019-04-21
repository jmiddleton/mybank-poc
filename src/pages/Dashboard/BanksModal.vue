
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
      <div v-else>Unable to retrieve list of banks. Please try in few seconds.</div>
    </div>
    <div slot="modal-footer" class="w-100">
      <b-button variant="primary" size="sm" class="float-right" @click="show=false">Close</b-button>
    </div>
  </b-modal>
</template>
<script>
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
      if (bank && bank.oidc_config && bank.oidc_config.metadata) {
        const meta = bank.oidc_config.metadata;
        var auth_url =
          meta.authorization_endpoint +
          "?response_type=code&scope=" +
          bank.oidc_config.scope;
        auth_url = auth_url + "&client_id=" + bank.oidc_config.client_id;
        auth_url = auth_url + "&redirect_uri=" + bank.oidc_config.redirect_uri;
        auth_url = auth_url + "?bankcode=" + bank.code;
        auth_url = auth_url + "&state=0&nonce=" + "random_value";

        window.location.href = auth_url;
      }
    }
  },
  watch: {
    show() {
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