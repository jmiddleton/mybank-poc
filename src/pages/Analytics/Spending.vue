<template>
  <div class="tables-basic col-md-12 col-lg-10">
    <b-breadcrumb>
      <b-breadcrumb-item>
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
            <label ref="spendingSidebar" />
            <b-alert
              v-for="category in chartData"
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

                <b-progress
                  class="sidebarProgress progress-md"
                  :variant="category.color"
                  :value="category.total"
                  :max="maxvalue"
                />
                <small>{{category.footer}}</small>
              </div>
            </b-alert>
          </div>
        </Widget>
      </b-col>
      <b-col xs="6">
        <Widget title="Category Spending" refresh settings></Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";

import $ from "jquery";
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie";
import axios from "axios";
import moment from "moment";

const { Messenger } = window;
const mformat = "YYYY-MM";
export default {
  name: "Spending",
  components: {
    Widget
  },
  data() {
    return {
      rawSpendings: [],
      ticks: [],
      chartData: [],
      currentMonth: 0,
      maxvalue: 100
    };
  },
  methods: {
    generateChartData() {
      this.chartData = [];
      this.$refs.spendingSidebar.innerText= "";

      if (!this.rawSpendings) {
        return this.chartData;
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
          this.maxvalue = value * (value * 0.5);
        }

        this.chartData.push(serie);
      }

      if(this.chartData.length === 0 ){
        this.$refs.spendingSidebar.innerText= "No data found";
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
        this.generateChartData();
      }else{
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
            this.generateChartData();
          }
        });
    }
  },
  created() {},

  mounted() {
    this.currentMonth = moment().format(mformat);
    this.loadSpending(this.currentMonth);
  }
};
</script>

<style src="./Spending.scss" lang="scss" scoped/>
