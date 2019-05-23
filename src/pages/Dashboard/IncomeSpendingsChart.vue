<template>
  <Widget
    :title="'<h5>Income vs Spendings</h5>'"
    customHeader
    collapse
  >
    <p class="fs-mini text-muted">Shows incomes vs spendings over a period of 6 months.</p>
    <div>
      <svg ref="spendByCatChart"></svg>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import moment from "moment";
import { mapState } from "vuex";
import d3 from "d3";
import nv from "nvd3";

const mformat = "YYYY-MM";

export default {
  name: "IncomeSpendingsChart",
  components: {
    Widget
  },
  data() {
    return {};
  },
  methods: {
    getIncomeSerie() {
      const serie = {
        values: [],
        area: true,
        type: "line",
        key: "Income",
        yAxis: 1
      };

      this.cashflow.incomes.forEach(s => {
        serie.values.push({
          x: moment(s.month, mformat).valueOf(),
          y: s.totalIncome
        });
      });
      return serie;
    },
    getSpendingsSerie() {
      const serie = {
        values: [],
        area: true,
        type: "line",
        key: "Spendings",
        yAxis: 2
      };

      this.cashflow.spendings.forEach(s => {
        serie.values.push({
          x: moment(s.month, mformat).valueOf(),
          y: s.totalSpent
        });
      });
      return serie;
    },

    createChart() {
      const barchartData = [];
      barchartData.push(this.getIncomeSerie());
      barchartData.push(this.getSpendingsSerie());

      if (this.$refs.spendByCatChart) {
        if (barchartData.length === 0) {
          return (this.$refs.spendByCatChart.innerText = "No data found");
        } else {
          this.$refs.spendByCatChart.innerText = "";
        }
      }

      nv.addGraph(() => {
        const graph = nv.models
          .multiBarChart()
          .margin({ left: 46, bottom: 30, right: 0 })
          .showControls(false)
          .color(["#ffc247", "#f55d5d"]);
        graph.legend.rightAlign(false);
        graph.xAxis
          .showMaxMin(false)
          .tickFormat(d => d3.time.format("%b %d")(new Date(d)));
        graph.yAxis.showMaxMin(false).tickFormat(d3.format(",f"));

        d3.select(this.$refs.spendByCatChart)
          .style("height", "320px")
          .datum(barchartData)
          .transition()
          .duration(500)
          .call(graph);

        nv.utils.windowResize(graph.update);
      });
    }
  },
  mounted() {},
  unmounted() {},
  computed: {
    ...mapState("analytics", ["cashflow"])
  },
  watch: {
    cashflow() {
      this.createChart();
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>