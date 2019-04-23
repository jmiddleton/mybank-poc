<template>
  <div class="container">
    <div class="messageContainer">
      <h2 class="display-5">Transfering Account Details to myBank</h2>

      <p>
        We are retrieving bank accounts details such as accounts, transactions, direct debits and balances.
        <br>This might take few seconds please wait...
      </p>
      <img :src="require('../../assets/synching_accounts.gif')" alt="...">
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    handleAuthentication() {
      if (localStorage.getItem("auth_state")) {
        const auth_state = JSON.parse(localStorage.getItem("auth_state"));
        const authDetails = {
          bank_code: auth_state.bankcode,
          auth_code: this.$route.query.code
        };

        const me = this;
        if (auth_state.accountId) {
          me.refreshAccount(auth_state.accountId, authDetails);
        } else {
          me.linkAccount(authDetails);
        }

        setTimeout(function() {
          me.$router.push(auth_state.redirectTo);
        }, 2500);
      }
    },
    linkAccount(authDetails) {
      axios.post("/link-accounts/", authDetails);
    },
    refreshAccount(accountId, authDetails) {
      axios.post("/accounts/" + accountId + "/refresh", authDetails);
    }
  },
  mounted() {},
  created() {
    this.handleAuthentication();
  }
};
</script>

<style src="./Landing.scss" lang="scss" scoped />