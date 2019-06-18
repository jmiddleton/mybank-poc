<template>
  <div>
    <h2 class="page-title">Bills & Upcoming Payments</h2>
    <b-row>
      <b-col xs="12" md="6">
          <h5>Upcoming Payments</h5>
          <RegularPaymentsTimeline/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import RegularPaymentsTimeline from "./RegularPaymentsTimeline";

export default {
  name: "RegularPayments",
  components: { Widget, RegularPaymentsTimeline },
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style src="./RegularPayments.scss" lang="scss" scoped />
