<template>
  <div class="tables-basic col-md-12 col-lg-10">
    <b-breadcrumb>
      <b-breadcrumb-item to="/app/dashboard">
        <span class="fi flaticon-home"></span>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>My Spending</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title">My Spending</h1>
    <b-row>
      <b-col xs="6">
        <Widget title="Monthly Spending" refresh settings>
          <span class="text-muted float-right">{{currentMonth}}</span>
          <div role="group" class="btn-group">
            <button class="btn btn-outline-info btn-sm" @click="changeMonth(-1)">Previous</button>
            <button class="btn btn-outline-info btn-sm" @click="changeMonth(0)">Current</button>
            <button class="btn btn-outline-info btn-sm" @click="changeMonth(1)">Next</button>
          </div>
          <div class="sidebarAlerts">
            <label ref="spendingSidebar"/>
            <b-alert
              v-for="category in slidebarData"
              :key="category.id"
              class="sidebarAlert"
              variant="transparent"
              show
            >
              <div>
                <span class="float-right">
                  <strong>$ -{{category.total}}</strong>
                </span>
                
                <span class="notificationIcon thumb-sm">
                  <img :src="require('../../assets/categories/' + category.title + '.png')">
                </span>
                <h6>{{category.title}}</h6>

                <div class="sidebarProgress progress-md">
                  <b-progress :variant="category.color" :value="category.total" :max="maxvalue"/>
                  <small class="float-right">{{category.footer}}</small>
                </div>
              </div>
            </b-alert>
          </div>
        </Widget>
      </b-col>
      <b-col xs="6">
        <Widget title="Category Spending" refresh settings>
          <div ref="categoryChart" :style="{ height: '325px' }"/>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import $ from "jquery";
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.time";
require("../../core/jquery.flot.orderBars.js");
import _ from "lodash";

import axios from "axios";
import moment from "moment";

const mformat = "YYYY-MM";

export default {
  name: "Spending",
  components: {
    Widget
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
    generateslidebarData() {
      this.slidebarData = [];
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
          this.maxvalue = value + (value * 0.8);
        }

        this.slidebarData.push(serie);
      }

      if (this.slidebarData.length === 0) {
        this.$refs.spendingSidebar.innerText = "No data found";
      }
    },
    changeMonth(month) {
      if (month === 0) {
        this.currentMonth = moment().format(mformat);
      } else {
        this.currentMonth = moment(this.currentMonth, mformat)
          .add(month, "months")
          .format(mformat);
      }

      if (this.isLocalAvailable(this.currentMonth)) {
        this.generateslidebarData();
      } else {
        this.loadSpending(this.currentMonth);
      }
    },
    isLocalAvailable(currentMonth) {
      const current = moment(currentMonth, mformat).month();
      const today = moment().month();
      return today - current > 0;
    },
    loadSpending(month) {
      //TODO: restrict how far it can search, only 2 or 3 months
      axios
        .get("/analytics/spendings/" + month, {
          params: { "page-size": 50 }
        })
        .then(r => r.data)
        .then(spendings => {
          if (spendings && spendings.data) {
            this.rawSpendings = spendings.data.spendings;
            this.generateslidebarData();
          }
        });
    },
    getCategoryChartData() {
      this.barchartData = [];

      if (!this.rawSpendings) {
        return this.barchartData;
      }

      var index = 0;
      var order = 1;
      for (let i = 0; i < this.rawSpendings.length; i++) {
        const spend = this.rawSpendings[i];
        const month = spend.month.substring(0, 7);

        var serie = _.find(this.barchartData, { label: spend.category });
        if (serie) {
          index = serie.data.length;
        } else {
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
          index = 0;
          this.barchartData.push(serie);
        }
        serie.data.push([
          moment(month, mformat).valueOf(),
          Math.abs(spend.totalSpent)
        ]);
      }

      if (this.barchartData.length === 0) {
        return (this.$refs.categoryChart.innerText = "No data found");
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
          labelBoxBorderColor: "none"
        }
      });
    }
  },
  watch: {
    rawSpendings() {
      if (this.barchartData && this.barchartData.length === 0) {
        this.createCategoryChart();
      }
    }
  },
  mounted() {
    this.currentMonth = moment().format(mformat);
    this.loadSpending(this.currentMonth);
  }
};
</script>

<style src="./Spending.scss" lang="scss" scoped/>
