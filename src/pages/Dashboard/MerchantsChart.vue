<template>
  <Widget
    title="Top Merchant"
    navigate
    collapse
    refresh
    @refreshed="handleRefresh"
    @previous="changeMonth"
    @current="changeMonth"
    @next="changeMonth"
  >
    <p class="fs-mini text-muted">The graph below shows the top merchante spendings.</p>

    <div class="categoriesList">
      <label ref="merchantsSidebar"/>
      <div v-for="merchant in slidebarData" :key="merchant.id" class="categoryItem sidebarAlert">
        <span class="float-right">
          <strong>$ {{merchant.total}}</strong>
        </span>
        <small>{{merchant.title}}</small>
        <div class="sidebarProgress progress-md">
          <b-progress :variant="merchant.color" :value="merchant.total" :max="maxvalue"/>
          <small class="float-right">{{merchant.footer}}</small>
        </div>
      </div>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import moment from "moment";
import { mapState } from "vuex";

const mformat = "YYYY-MM";

export default {
  name: "MerchantsChart",
  //props: ["currentMonth"],
  components: {
    Widget
  },
  data() {
    return {
      slidebarData: [],
      maxvalue: 0,
      currentMonth: ""
    };
  },
  methods: {
    generateSlidebarData() {
      this.slidebarData = [];

      if (!this.$refs.merchantsSidebar) {
        return;
      }

      this.$refs.merchantsSidebar.innerText = "";
      if (!this.merchants) {
        return this.slidebarData;
      }

      for (let i = 0; i < this.merchants.length; i++) {
        const merchant = this.merchants[i];

        if (!moment(merchant.month, mformat).isSame(this.currentMonth)) {
          continue;
        }

        const value = Math.abs(merchant.totalSpent);
        var serie = {
          id: i,
          title: merchant.merchantName,
          total: value,
          footer: merchant.totalOfTrans + " transactions",
          color: "info"
        };

        if (this.maxvalue < value) {
          this.maxvalue = value + value * 0.8;
        }

        this.slidebarData.push(serie);
      }

      if (this.slidebarData.length === 0) {
        this.$refs.merchantsSidebar.innerText = "No data found";
      } else {
        this.$refs.merchantsSidebar.innerText = "";
      }
    },
    loadMerchants(month) {
      const query = {
        month: month,
        monthsToPrefetch: 0
      };
      this.$store.dispatch("analytics/loadMerchants", query);
    },
    handleRefresh(event) {
      this.loadMerchants(this.currentMonth);
    },
    changeMonth(month) {
      
      if (month === 0) {
        this.currentMonth = moment().format(mformat);
      } else {
        this.currentMonth = moment(this.currentMonth, mformat)
          .add(month, "months")
          .format(mformat);
      }

      const mcurrent = moment(this.currentMonth, mformat);
      if (
        mcurrent.month() > moment().month() &&
        mcurrent.year() > moment().year()
      ) {
        return;
      }
    }
  },
  mounted() {
    this.currentMonth = moment().format(mformat);
  },
  computed: {
    ...mapState("analytics", ["merchants"])
  },
  watch: {
    currentMonth(newValue) {
      this.loadMerchants(newValue);
    },
    merchants(newValue) {
      this.generateSlidebarData();
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>