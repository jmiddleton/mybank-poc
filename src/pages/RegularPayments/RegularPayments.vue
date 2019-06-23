<template>
  <div>
    <h2 class="page-title">Bills & Upcoming Payments</h2>
    <b-row>
      <b-col xs="12" md="6">
          <h5>Upcoming Payments</h5>
          <RegularPaymentsTimeline/>
      </b-col>
      <b-col xs="12" md="6">
          <h5>Authorised Direct Debits</h5>
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
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style src="./RegularPayments.scss" lang="scss" scoped />
