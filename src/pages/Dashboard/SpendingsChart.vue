<template>
  <b-row>
    <b-col xs="6">
      <div ref="chartContainer" :style="{ height: '100px' }"/>
    </b-col>
    <b-col xs="6">
      <div ref="chartLegend" :style="{ height: '100px' }"/>
    </b-col>
  </b-row>
</template>

<script>
import $ from "jquery";
/* eslint-disable */
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie";
import axios from "axios";

import { mapState, mapGetters } from "vuex";

export default {
  name: "SpendingsChart",
  methods: {
    getSpendingsData(spendings) {
      const data = [];

      for (let i = 0; i < spendings.length; i++) {
        data.push({
          label: spendings[i].category,
          data: spendings[i].totalSpent
        });
        if( i === 4){
          //only 5 fit in the screen
          break;
        }
      }
      return data;
    },
    createChart(data) {
      return $.plot(this.$refs.chartContainer, data, {
        series: {
          pie: {
            innerRadius: 0.6,
            show: true,
            fill: 0.2
          }
        },
        colors: ["#ffc247", "#f55d5d", "#9964e3"],
        legend: {
          container: this.$refs.chartLegend,
          labelBoxBorderColor: "#ffffff"
        }
      });
    }
  },
  mounted() {
    //TODO: use current year/month
    axios
      .get("/analytics/spendings/2019-03")
      .then(r => r.data)
      .then(spendings => {
        this.createChart(this.getSpendingsData(spendings.data.spendings));
      });
  }
};
</script>
