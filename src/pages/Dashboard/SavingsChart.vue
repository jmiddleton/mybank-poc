<template>
  <section class="h-100 mb-0">
    <div>
      <div ref="savingsChart" :style="{ height: '150px' }"/>
      <h6 class="m-0 text-right">
        TOTAL SAVINGS:
        <strong>${{totalSavings.toFixed(2)}}</strong>
      </h6>
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
import { mapState } from "vuex";
const { Morris } = window;

export default {
  name: "SavingsChart",
  props: ["currentMonth"],
  data() {
    return {
      totalSavings: 0
    };
  },
  methods: {
    createChart() {
      if (this.savings.length == 0) {
        return (this.$refs.savingsChart.innerText = "No data found");
      }

      this.totalSavings = this.savings.reduce(function(sum, saving) {
        return sum + saving.totalSavings;
      }, 0);

      $(this.$refs.savingsChart).html("");
      Morris.Line({
        element: this.$refs.savingsChart,
        resize: true,
        data: this.savings,
        xkey: "month",
        xLabels: "month",
        ykeys: ["totalSavings"],
        labels: ["Total"],
        hideHover: "auto",
        lineColors: ["#9964e3"],
        lineWidth: 2,
        xLabelFormat: function(x) {
          return moment(x).format("MMMM");
        },
        goals: [0],
        goalStrokeWidth: 2
      });
    }
  },
  computed: {
    ...mapState("analytics", ["savings"])
  },
  watch: {
    currentMonth() {
      this.createChart();
    },
    savings(newValue) {
      this.createChart();
    }
  }
};
</script>
