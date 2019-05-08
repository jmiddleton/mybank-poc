<template>
  <section class="h-100 mb-0">
    <div>
      <div ref="savingsChart" :style="{ height: '150px' }"/>
      <h6 class="m-0 text-right">TOTAL SAVINGS: <strong>${{totalSavings.toFixed(2)}}</strong></h6>
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

const { Morris } = window;
const mformat = "YYYY-MM";

export default {
  name: "SavingsChart",
  props: ["currentMonth"],
  data() {
    return {
      data: [],
      totalSavings:0
    };
  },
  methods: {
    createChart() {
      if (this.data.length == 0) {
        return (this.$refs.savingsChart.innerText = "No data found");
      }

      this.totalSavings = this.data.reduce(function(sum, saving) {
        return sum + saving.totalSavings;
      }, 0);

      $(this.$refs.savingsChart).html("");
      Morris.Line({
        element: this.$refs.savingsChart,
        resize: true,
        data: this.data,
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
    },
    loadSavings() {
      const me = this;
      axios
        .get(
          "/analytics/savings/" +
            moment(me.currentMonth, mformat)
              .subtract(3, "months")
              .format("YYYY-MM"),
          { "page-size": 4 }
        )
        .then(r => r.data)
        .then(savings => {
          if (savings && savings.data) {
            me.data = savings.data.savings;
            me.createChart();
          }
        });
    }
  },
  mounted() {
    const me = this;

    me.loadSavings();
    window.addEventListener("resize", me.loadSavings);
  },
  unmounted() {
    window.removeEventListener("resize", this.loadSavings);
  },
  watch: {
    currentMonth() {
      this.loadSavings();
    }
  }
};
</script>
