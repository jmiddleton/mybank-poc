<template>
  <section class="h-100 mb-0 widget">
    AVERAGE SAVINGS
    <span class="float-right" v-if="isLoadingSavings">
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
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie";
/* eslint-enable */
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "AverageSavingsChart",
  data() {
    return {
      ticks: [],
      data: [],
      syncSavings: null
    };
  },
  methods: {
    processData(savings) {
      this.data = [];
      this.ticks = [];
      if (!savings) {
        return this.data;
      }

      for (let i = 0; i < savings.length; i++) {
        var serie = [i, savings[i].totalSavings];
        this.data.push([serie]);
        this.ticks.push([i, savings[i].monthName.substring(0, 3)]);
      }
    },
    createChart() {
      if (!this.$refs.savingsChart) {
        return;
      }
      if (this.savings.length == 0) {
        return (this.$refs.savingsChart.innerText = "No data found");
      } else {
        this.processData(this.savings);
      }

      return $.plot($(this.$refs.savingsChart), this.data, {
        series: {
          bars: {
            show: true,
            barWidth: 0.5,
            lineWidth: 1,
            fill: 0.75
          }
        },
        grid: {
          backgroundColor: { colors: ["#ffffff", "#ffffff"] },
          borderWidth: 1,
          borderColor: "#ffffff",
          margin: 0,
          minBorderMargin: 0,
          hoverable: true,
          mouseActiveRadius: 6
        },
        xaxis: {
          ticks: this.ticks,
          tickLength: 0,
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 10,
          axisLabelPadding: 10
        },
        colors: ["#78c448"]
      });
    },
    loadSavings(useCache) {
      const query = {
        month: moment().format("YYYY-MM"),
        monthsToPrefetch: 3,
        useCache: useCache
      };

      if (!this.$refs.savingsChart) {
        try {
          clearInterval(this.syncSavings);
        } catch {
          //nothing
        }
        return;
      }

      this.$store.dispatch("analytics/loadSavings", query);
    }
  },
  mounted() {
    const me = this;

    if (this.syncSavings === null) {
      this.syncSavings = setInterval(() => me.loadSavings(true), 10000);
    }

    this.loadSavings(true);
    window.addEventListener("resize", this.loadSavings);
  },
  computed: {
    ...mapState("analytics", ["savings", "isLoadingSavings"])
  },
  watch: {
    savings() {
      this.createChart();
    }
  }
};
</script>
