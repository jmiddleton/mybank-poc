<template>
  <b-row>
    <b-col xs="6">
      <div ref="spendingsChart" :style="{ height: '100px' }"/>
      <span v-if="!isDataAvailable">No Data Found</span>
    </b-col>
    <b-col xs="6">
      <div ref="spendingsLegend" :style="{ height: '100px' }"/>
    </b-col>
  </b-row>
</template>

<script>
import $ from "jquery";
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie";
import axios from "axios";
import moment from "moment";

import { mapState, mapGetters } from "vuex";

export default {
  name: "SpendingsChart",
  data() {
    return {
      isDataAvailable: false
    };
  },
  methods: {
    getSpendingsData(spendings) {
      const data = [];

      if (!spendings) {
        return data;
      }

      for (let i = 0; i < spendings.length; i++) {
        data.push({
          label: spendings[i].category,
          data: spendings[i].totalSpent
        });
      }
      return data;
    },
    createChart(data) {
      return $.plot(this.$refs.spendingsChart, data, {
        series: {
          pie: {
            innerRadius: 0.6,
            show: true,
            fill: 0.2
          }
        },
        colors: ["#ffc247", "#f55d5d", "#9964e3"],
        legend: {
          container: this.$refs.spendingsLegend,
          labelBoxBorderColor: "#ffffff"
        }
      });
    }
  },
  mounted() {
    //TODO: use current year/month
    axios
      .get("/analytics/spendings/" + moment().format("YYYY-MM"))
      .then(r => r.data)
      .then(spendings => {
        if (spendings && spendings.data) {
          this.createChart(this.getSpendingsData(spendings.data.spendings));
          this.isDataAvailable = true;
        } else {
          this.isDataAvailable = false;
        }
      });
  }
};
</script>
