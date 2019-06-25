<template>
  <div>
    <b-alert
      v-if="message"
      class="alert-transparent"
      show
      dismissible
      :variant="messageVariant"
    >{{message}}</b-alert>
    <h2 class="page-title">Bills & Upcoming Payments</h2>
    <b-row>
      <b-col xs="12" md="6">
        <RegularPaymentsTimeline/>
      </b-col>
      <b-col xs="12" md="6">
        <DirectDebitsTimeline/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import RegularPaymentsTimeline from "./RegularPaymentsTimeline";
import DirectDebitsTimeline from "./DirectDebitsTimeline";

export default {
  name: "RegularPayments",
  components: { Widget, RegularPaymentsTimeline, DirectDebitsTimeline },
  data() {
    return { message: "", messageVariant: "" };
  },
  methods: {
    handleNetworkError(msg) {
      this.message = msg.message;
      this.messageVariant = msg.variant;
    }
  },
  created() {}
};
</script>

<style src="./RegularPayments.scss" lang="scss" scoped />
