<template>
  <div>
    <p>Linking bank accounts, this might take few seconds please wait...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    handleAuthentication() {
      const code = this.$route.query.code;
      const state = this.$route.query.state;
      const bank_code= this.$route.query.bankcode;

      const authDetails = {
        bank_code: bank_code,
        auth_code: code,
        state: state
      };

      //send to a lambda function bank_code and auth_code.
      let response = axios.post("/link-accounts", authDetails);
      if (response) {
        this.$router.push("/app/dashboard");
      }
    }
  },
  created() {
    this.handleAuthentication();
  }
};
</script>