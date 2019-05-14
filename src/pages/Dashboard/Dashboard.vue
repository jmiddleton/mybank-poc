<template>
  <div class="dashboard-page">
    <h1 class="page-title">
      My Dashboard
      <span class="float-right" v-if="isLoadingSpendings">
        <p class="fs-mini text-muted">
          <i class="la la-refresh la-spin"/> Loading...
        </p>
      </span>
    </h1>
    <div class="analyticsSide">
      <b-row>
        <b-col lg="3" sm="6" xs="12">
          <div class="pb-xlg h-100">
            <Balances/>
          </div>
        </b-col>
        <b-col lg="3" sm="6" xs="12">
          <div class="pb-xlg h-100">
            <Cashflow/>
          </div>
        </b-col>
        <b-col lg="3" sm="6" xs="12">
          <div class="pb-xlg h-100">
            <SpendingsPieChart/>
          </div>
        </b-col>
        <b-col lg="3" sm="6" xs="12">
          <div class="pb-xlg h-100">
            <AverageSavingsChart/>
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="analyticsSide">
      <b-row>
        <b-col lg="4">
          <SpendingByCategorySlideBar/>
        </b-col>
        <b-col lg="8">
          <SpendingByCategoryBarChart/>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="4">
          <MerchantsChart/>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import AverageSavingsChart from "./AverageSavingsChart";
import SpendingsPieChart from "./SpendingsPieChart";
import MerchantsChart from "./MerchantsChart";
import SpendingByCategoryBarChart from "./SpendingByCategoryBarChart";
import SpendingByCategorySlideBar from "./SpendingByCategorySlideBar";
import Cashflow from "./Cashflow";
import Balances from "./Balances";

import { clearInterval } from "timers";
import { mapState } from "vuex";

import moment from "moment";
const mformat = "YYYY-MM";

export default {
  name: "Dashboard",
  components: {
    MerchantsChart,
    SpendingsPieChart,
    AverageSavingsChart,
    Cashflow,
    Balances,
    SpendingByCategoryBarChart,
    SpendingByCategorySlideBar
  },
  data() {
    return {
      timer: null
    };
  },
  methods: {
    loadSpendings() {
      const query = {
        month: moment().format(mformat),
        monthsToPrefetch: 2
      };

      this.$store.dispatch("analytics/loadSpendings", query);
    }
  },
  mounted() {
    const me = this;

    if (this.timer === null) {
      this.timer = setInterval(() => me.loadSpendings(), 30000);
    }
    this.loadSpendings();
  },
  computed: {
    ...mapState("analytics", ["isLoadingSpendings"])
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>
