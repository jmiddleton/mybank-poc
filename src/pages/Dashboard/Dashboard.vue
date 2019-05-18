<template>
  <div class="dashboard-page" ref="dashboardDiv">
    <h1 class="page-title">
      My Dashboard
      <span class="float-right" v-if="isLoadingCashflow || isLoadingSpendings">
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
        <b-col lg="8">
          <IncomeSpendingsChart/>
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
import IncomeSpendingsChart from "./IncomeSpendingsChart";

import { clearInterval } from "timers";
import { mapState } from "vuex";

import moment from "moment";
const mformat = "YYYY-MM";

export default {
  name: "Dashboard",
  components: {
    Balances,
    Cashflow,
    SpendingsPieChart,
    AverageSavingsChart,
    SpendingByCategorySlideBar,
    SpendingByCategoryBarChart,
    MerchantsChart,
    IncomeSpendingsChart
  },
  data() {
    return {
      syncTimer: null
    };
  },
  methods: {
    loadCashflow() {

      if(!this.$refs.dashboardDiv){
        try {
          clearInterval(this.syncTimer);
        } catch {
          //nothing
        }
        return false;
      }

      const currentMonth= moment().format(mformat);
      const query = {
        month: currentMonth,
        monthsToPrefetch: 2
      };

      this.$store.dispatch("analytics/loadSpendings", query);
      this.$store.dispatch("analytics/loadCashflow", currentMonth);
    }
  },
  mounted() {
    const me = this;

    if (this.syncTimer === null) {
      this.syncTimer = setInterval(() => me.loadCashflow(), 10000);
    }
    this.loadCashflow();
  },
  computed: {
    ...mapState("analytics", ["isLoadingCashflow", "isLoadingSpendings"])
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>
