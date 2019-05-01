<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    handleLoginEvent(data) {
      let url = data.state.target;
      if (data.state.query) {
        url = url + "?";
        Object.entries(data.state.query).forEach(([key, value]) => {
          url = url + `${key}=${value}&`;
        });
      }
      this.$router.push(url || "/app/accounts");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.$auth.idToken;
    }
  },
  created() {
    this.$auth.handleAuthentication();
  }
};
</script>