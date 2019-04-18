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
      const code = this.$route.query.code;
      const state = this.$route.query.state;
      const bank_code = this.$route.query.bankcode;

      const authDetails = {
        bank_code: bank_code,
        auth_code: code,
        state: state
      };

      let response = axios.post("/link-accounts", authDetails);
      if (response) {
        var router = this.$router;
        setTimeout(function() {
          router.push("/app/dashboard");
        }, 2500);
      }
    }
  },
  created() {
    this.handleAuthentication();
  }
};
</script>

<style src="./Landing.scss" lang="scss" scoped />