<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    handleLoginEvent(data) {
      this.$router.push(data.state.target || "/app/dashboard");
      axios.defaults.headers.common['Authorization'] = "Bearer " + this.$auth.idToken;
    }
  },
  created() {
    this.$auth.handleAuthentication();
  }
};
</script>