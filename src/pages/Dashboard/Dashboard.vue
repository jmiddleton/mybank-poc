<template>
  <div class="dashboard-page">
    <h1 class="page-title">My Dashboard</h1>
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
            <SpendingsChart/>
          </div>
        </b-col>
        <b-col lg="3" sm="6" xs="12">
          <div class="pb-xlg h-100">
            <AverageSavingsChart/>
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="text-right">
      <span>[{{currentMonth}}]</span>
      <div role="group" class="btn-group">
        <button class="btn btn-outline-info btn-xs" @click="changeMonth(-1)">Previous</button>
        <button class="btn btn-outline-info btn-xs" @click="changeMonth(0)">Current</button>
        <button class="btn btn-outline-info btn-xs" @click="changeMonth(1)">Next</button>
      </div>
    </div>
    <div class="analyticsSide">
      <b-row>
        <b-col lg="4">
          <Widget title="Monthly Spending" collapse refresh>
            <p class="fs-mini text-muted">
              Visualizes spendings by category on the current month.
              You can also see previous months when you navigate with top buttons.
            </p>
            <div class="categoriesList">
              <label ref="spendingSidebar"/>
              <div
                v-for="category in slidebarData"
                :key="category.id"
                class="categoryItem sidebarAlert"
              >
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
        </b-col>
        <b-col lg="4">
          <Widget title="Spending by Category" collapse refresh>
            <p
              class="fs-mini text-muted"
            >Tracks spendings divided by category for the last 3 months.</p>
            <div ref="categoryChart" :style="{ height: '320px' }"/>
            <div ref="categoryLegends" style="categoryLegends"></div>
          </Widget>
        </b-col>
        <b-col lg="4">
          <MerchantsChart :currentMonth="currentMonth"/>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import $ from "jquery";
import _ from "lodash";
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.time";
require("../../core/jquery.flot.orderBars.js");
import AverageSavingsChart from "./AverageSavingsChart";
import SpendingsChart from "./SpendingsChart";
import MerchantsChart from "./MerchantsChart";
import Cashflow from "./Cashflow";
import Balances from "./Balances";

import axios from "axios";
import moment from "moment";

const mformat = "YYYY-MM";

export default {
  name: "Dashboard",
  components: {
    Widget,
    MerchantsChart,
    SpendingsChart,
    AverageSavingsChart,
    Cashflow,
    Balances
  },
  data() {
    return {
      rawSpendings: [],
      slidebarData: [],
      barchartData: [],
      currentMonth: 0,
      maxvalue: 100
    };
  },
  methods: {
    generateSlidebarData() {
      this.slidebarData = [];

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
    changeMonth(month) {
      let current;

      if (month === 0) {
        current = moment().format(mformat);
      } else {
        current = moment(this.currentMonth, mformat)
          .add(month, "months")
          .format(mformat);
      }

      const mcurrent = moment(current, mformat);
      if (
        mcurrent.month() > moment().month() &&
        mcurrent.year() > moment().year()
      ) {
        return;
      }

      this.currentMonth = current;
      if (this.isCached(this.currentMonth)) {
        this.generateSlidebarData();
      } else {
        this.loadSpending();
      }
    },
    isCached(currentMonth) {
      const current = moment(currentMonth, mformat).month();

      return _.find(this.rawSpendings, function(item) {
        return moment(item.month, mformat).month() === current;
      });
    },
    loadSpending() {
      const month = this.currentMonth;
      //TODO: restrict how far it can search, only 2 or 3 months
      axios
        .get("/analytics/spendings/" + month, {
          params: { monthsToPrefetch: 2, "page-size": 50 }
        })
        .then(r => r.data)
        .then(spendings => {
          if (spendings && spendings.data) {
            this.rawSpendings = spendings.data.spendings;
            this.generateSlidebarData();
          }
        });
    },
    getCategoryChartData() {
      this.barchartData = [];

      if (!this.rawSpendings) {
        return this.barchartData;
      }

      var order = 1;
      for (let i = 0; i < this.rawSpendings.length; i++) {
        const spend = this.rawSpendings[i];
        const month = spend.month.substring(0, 7);

        var serie = _.find(this.barchartData, { label: spend.category });
        if (!serie) {
          serie = {
            data: [],
            label: spend.category,
            bars: {
              show: true,
              barWidth: 15 * 24 * 60 * 60 * 300,
              fill: 0.65,
              lineWidth: 1,
              order: order++
            }
          };
          this.barchartData.push(serie);
        }
        serie.data.push([
          moment(month, mformat).valueOf(),
          Math.abs(spend.totalSpent)
        ]);
      }

      if (this.barchartData.length === 0) {
        return (this.$refs.categoryChart.innerText = "No data found");
      } else {
        this.$refs.categoryChart.innerText = "";
      }
    },
    createCategoryChart() {
      this.getCategoryChartData();

      $.plot($(this.$refs.categoryChart), this.barchartData, {
        xaxis: {
          mode: "time",
          tickLength: 0,
          tickSize: [1, "month"],
          axisLabel: "Month",
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 10,
          axisLabelPadding: 10
        },
        grid: {
          hoverable: true,
          borderWidth: 0
        },
        legend: {
          backgroundColor: "transparent",
          labelBoxBorderColor: "none",
          container: this.$refs.categoryLegends,
          noColumns: 4
        },
        colors: [
          "#1b11ff",
          "#a0ff4c",
          "#837fff",
          "#ffac4c",
          "#f9ff4c",
          "#ff524c",
          "#76b5ff",
          "#ff332a"
        ]
      });
    }
  },
  watch: {
    rawSpendings() {
      if (this.barchartData) {
        this.createCategoryChart();
      }
    }
  },
  created() {
    this.currentMonth = moment().format(mformat);
    const query = {
      month: this.currentMonth,
      monthsToPrefetch: 6
    };

    this.loadSpending();
    this.$store.dispatch("analytics/loadSpendings", query);

    window.addEventListener("resize", this.loadSpending);
  },
  unmounted() {
    window.removeEventListener("resize", this.loadSpending);
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>
