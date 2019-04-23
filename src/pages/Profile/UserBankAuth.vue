<template>
  <div>
    <p>&nbsp;</p>
    <h5>Banks Authorizations</h5>

    <div v-if="auths && auths.length > 0" class="widgetBody widget-body p-0">
      <div :key="auth.bank" v-for="auth in auths" class="list-group-item list-group list-group-lg">
        <span class="notificationIcon thumb-sm">
          <img
            :src="require('../../assets/banks/' + auth.bank + '.png')"
            alt="..."
            class="rounded-circle"
          >
        </span>

        <div>
          <button @click="unlinkBankAuth(auth.bank)" class="float-right btn btn-outline-danger btn-xs mb-2">
            <i class="fa fa-unlink mr-2"></i>
            Unlink
          </button>
          <h6>Created: {{auth.created | formatDate}} -- Expire In: {{auth.expires_in}} seconds</h6>
        </div>
      </div>
    </div>
    <div v-else>No bank authorizations found.</div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import moment from "moment";

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(value).format("DD MMMM YYYY");
  }
});
export default {
  name: "UserBankAuth",
  components: {},
  data() {
    return {
      auths: []
    };
  },
  methods: {
    loadBankAuthorizations() {
      axios
        .get("/bankauths")
        .then(r => r.data)
        .then(auths => {
          this.auths = auths;
        });
    },
    unlinkBankAuth(code) {
      try {
        axios.delete("/bankauths/" + code);
        const el = this;
        setTimeout(function() {
          el.loadBankAuthorizations();
        }, 500);
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.loadBankAuthorizations();
  }
};
</script>
<style src="./Profile.scss" lang="scss" scoped />
