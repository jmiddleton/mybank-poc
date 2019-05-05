<template>
  <section class="h-100 mb-0 widget">
    SPENDINGS
    <span class="float-right" v-if="isLoading">
      <i class="la la-refresh la-spin"/> Loading...
    </span>
    <div>
      <div class="widgetBody widget-body" ref="spendingsChart" :style="{ height: '150px' }"/>
    </div>
  </section>
</template>

<script>
import $ from "jquery";
/* eslint-disable */
import "imports-loader?jQuery=jquery,this=>window!webpack-raphael/raphael";
import "imports-loader?jQuery=jquery,this=>window!govpredict-morris/morris";
/* eslint-enable */
import axios from "axios";
import moment from "moment";
import { clearInterval } from "timers";

const { Morris } = window;

export default {
  name: "SpendingsChart",
  data() {
    return { data: [], isLoading: false };
  },
  methods: {
    getSpendingsData(spendings) {
      this.data = [];

      if (!spendings) {
        return this.data;
      }

      for (let i = 0; i < spendings.length; i++) {
        this.data.push({
          label: spendings[i].category,
          value: spendings[i].totalSpent
        });
      }
    },
    createChart() {
      if (this.data.length == 0) {
        return (this.$refs.spendingsChart.innerText = "No data found");
      }

      $(this.$refs.spendingsChart).html("");
      Morris.Donut({
        element: this.$refs.spendingsChart,
        resize: true,
        data: this.data,
        colors: [
          "#ffc247",
          "#f55d5d",
          "#9964e3",
          "#78c448",
          "#547fff",
          "#17a2b8",
          "#E4A537",
          "#B62070",
          "#A7B620",
          "#20B6B6"
        ]
      });
    },
    loadSpendings() {
      const me = this;

      //if the actual page is not this, stop the interval
      if (!this.$refs.spendingsChart) {
        try {
          clearInterval(this.interval);
        } catch {
          //nothing
        }
        return false;
      }

      me.isLoading = true;
      axios
        .get("/analytics/spendings/" + moment().format("YYYY-MM"))
        .then(r => r.data)
        .then(spendings => {
          if (spendings && spendings.data && me.data != undefined) {
            me.getSpendingsData(spendings.data.spendings);
            me.createChart();
          }
          me.isLoading = false;
        });
    }
  },
  mounted() {
    const me = this;

    this.interval = setInterval(() => me.loadSpendings(), 30000);
    me.loadSpendings();
  }
};
</script>
