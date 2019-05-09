<template>
  <section class="h-100 mb-0 widget">
    SPENDINGS
    <span class="float-right" v-if="isLoadingSpendings">
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
import { mapState } from "vuex";
const { Morris } = window;

const mformat = "YYYY-MM";

export default {
  name: "SpendingsChart",
  data() {
    return {
      data: []
    };
  },
  methods: {
    processData(spendings) {
      this.data = [];
      if (!spendings) {
        return this.data;
      }

      const current = moment().month();

      for (let i = 0; i < spendings.length; i++) {
        if (moment(spendings[i].month.substring(0, 7), mformat).month() === current) {
          this.data.push({
            label: spendings[i].category,
            value: spendings[i].totalSpent
          });
        }
      }
    },
    createChart() {
      if (!this.$refs.spendingsChart) {
        return;
      }
      if (this.spendings.length == 0) {
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
    }
  },
  mounted() {},
  computed: {
    ...mapState("analytics", ["spendings", "isLoadingSpendings"])
  },
  watch: {
    spendings(newValue) {
      this.processData(newValue);
      this.createChart();
    }
  }
};
</script>
