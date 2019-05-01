<template>
  <section class="h-100 mb-0">
    <span class="float-right" v-if="isLoading">
      <i class="la la-refresh la-spin"/> Loading...
    </span>
    <div>
      <div ref="savingsChart" :style="{ height: '150px' }"/>
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
      isLoading: true
    };
  },
  methods: {
    createChart() {
      if (this.data.length == 0) {
        return (this.$refs.savingsChart.innerText = "No data found");
      }

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
      me.isLoading = true;
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
          me.isLoading = false;
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
