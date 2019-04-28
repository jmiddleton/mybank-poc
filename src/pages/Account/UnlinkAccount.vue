<template>
  <div class="container">
    <div class="messageContainer">
      <h2 class="display-5">Deleting Account Details from myBank</h2>

      <p>
        We are deleting accounts details such as accounts, transactions, direct debits and balances.
        <br>This might take few seconds, please wait...
      </p>
      <img :src="require('../../assets/synching_accounts.gif')" alt="...">
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    unlinkAccount() {
      const accountId = this.$route.params.accountId;

      axios.delete("/accounts/" + accountId);
      
      var router = this.$router;
      setTimeout(function() {
        router.push("/app/dashboard");
      }, 2000);
    }
  },
  created() {
    this.unlinkAccount();
  }
};
</script>

<style src="./AccountDetails.scss" lang="scss" scoped />