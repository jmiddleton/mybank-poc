<template>
  <div ref="spendingsChart" :style="{ height: '150px' }"/>
</template>

<script>
import $ from "jquery";
/* eslint-disable */
import "imports-loader?jQuery=jquery,this=>window!webpack-raphael/raphael";
import "imports-loader?jQuery=jquery,this=>window!govpredict-morris/morris";
/* eslint-enable */

const { Morris } = window;
import axios from "axios";
import moment from "moment";

export default {
  name: "SpendingsChart",
  data() {
    return {};
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
          value: spendings[i].totalSpent
        });
      }
      return data;
    },
    createChart(data) {
      if (data.length == 0) {
        return (this.$refs.spendingsChart.innerText = "No data found");
      }

      $(this.$refs.spendingsChart).html("");
      Morris.Donut({
        element: this.$refs.spendingsChart,
        resize: true,
        data: data,
        colors: ["#ffc247", "#f55d5d", "#9964e3", "#78c448"]
      });
    }
  },
  mounted() {
    axios
      .get("/analytics/spendings/" + moment().format("YYYY-MM"))
      .then(r => r.data)
      .then(spendings => {
        if (spendings && spendings.data) {
          this.createChart(this.getSpendingsData(spendings.data.spendings));
        }
      });
  }
};
</script>
