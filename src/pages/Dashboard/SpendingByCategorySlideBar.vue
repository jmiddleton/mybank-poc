<template>
  <Widget
    :title="'<h5>Monthly Spending - <small>' + currentMonth + '</small></h5>'"
    customHeader
    collapse
    navigate
    @previous="changeMonth"
    @current="changeMonth"
    @next="changeMonth"
  ><!--    refresh
    @refreshed="handleRefresh" -->
    
    <p class="fs-mini text-muted">Visualizes monthly spending grouped by category.</p>
    <p class="value7 text-right">
      Total spent:
      <strong>$ {{totalSpent}}</strong>
    </p>
    <div class="categoriesList">
      <label ref="spendingSidebar"/>
      <div v-for="category in slidebarData" :key="category.id" class="categoryItem sidebarAlert">
        <span class="float-right">
          <strong>$ {{category.total}}</strong>
        </span>
        <span class="notificationIcon thumb-sm">
          <img :src="'/img/categories/' + category.title + '.png'">
        </span>
        <small>{{category.title}}</small>
        <div class="sidebarProgress progress-md">
          <b-progress :variant="category.color" :value="category.total" :max="maxvalue"/>
          <small class="float-right">{{category.footer}}</small>
        </div>
      </div>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import moment from "moment";
import { mapState } from "vuex";
import d3 from "d3";
import nv from "nvd3";

const mformat = "YYYY-MM";

export default {
  name: "SpendingByCategorySlideBar",
  components: {
    Widget
  },
  data() {
    return {
      rawSpendings: [],
      slidebarData: [],
      currentMonth: 0,
      maxvalue: 100,
      totalSpent: 0
    };
  },
  methods: {
    generateSlidebarData() {
      this.slidebarData = [];
      this.totalSpent = 0;

      if (!this.$refs.spendingSidebar) {
        return;
      }

      this.$refs.spendingSidebar.innerText = "";
      if (!this.rawSpendings) {
        return this.slidebarData;
      }

      for (let i = 0; i < this.rawSpendings.length; i++) {
        const spend = this.rawSpendings[i];

        if (!moment(spend.month, mformat).isSame(this.currentMonth)) {
          continue;
        }

        const value = Math.abs(spend.totalSpent);
        this.totalSpent = Math.round(this.totalSpent + value, 2);

        var serie = {
          id: i,
          title: spend.category,
          total: value,
          footer: spend.totalOfTrans + " transactions",
          color: "info"
        };

        if (this.maxvalue < value) {
          this.maxvalue = value + value * 0.8;
        }

        this.slidebarData.push(serie);
      }

      if (this.slidebarData.length === 0) {
        this.$refs.spendingSidebar.innerText = "No data found";
      } else {
        this.$refs.spendingSidebar.innerText = "";
      }
    },
    loadSpendings(month) {
      const query = {
        month: month,
        monthsToPrefetch: 0
      };
      this.$store.dispatch("analytics/loadMonthlySpendings", query);
    },
    handleRefresh(event) {
      this.loadSpendings(this.currentMonth);
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
    window.addEventListener("resize", this.createCategoryChart);
  },
  unmounted() {
    window.removeEventListener("resize", this.createCategoryChart);
  },
  computed: {
    ...mapState("analytics", [
      "monthlySpendings",
      "isLoadingMontlySpendings"
    ])
  },
  watch: {
    currentMonth(newValue) {
      this.loadSpendings(newValue);
    },
    monthlySpendings(newValue) {
      this.rawSpendings = newValue;
      this.generateSlidebarData();
    }
  }
};
</script>
<style src="./Dashboard.scss" lang="scss" scoped/>