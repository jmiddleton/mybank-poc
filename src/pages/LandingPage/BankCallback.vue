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
        const auth_details = {
          bank_code: auth_state.bankcode,
          auth_code: this.$route.query.code
        };

        //create/update userBankAuth AND update bank data
        axios.post(auth_state.postAuthCodeTo, auth_details);
        const me = this;
        setTimeout(function() {
          me.$router.push(auth_state.redirectTo);
        }, 1000);
      }
    }
  },
  mounted() {},
  created() {
    this.handleAuthentication();
  }
};
</script>

<style src="./Landing.scss" lang="scss" scoped />