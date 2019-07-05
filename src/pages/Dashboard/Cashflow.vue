<template>
  <section class="h-100 mb-0 widget">
    CASHFLOW
    <div>
      <svg ref="spendByCatChart"></svg>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import d3 from "d3";
import nv from "nvd3";

const mformat = "YYYY-MM";
export default {
  name: "Cashflow",
  components: {},
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

      if (this.cashflow.incomes && this.cashflow.incomes.length > 0) {
        for (let s of this.cashflow.incomes) {
          if (s.month === moment().format(mformat)) {
            serie.values.push({
              x: moment(s.month, mformat).valueOf(),
              y: s.totalIncome
            });
            break;
          }
        }
      }
      if (serie.values.length == 0) {
        this.createDefault(serie);
      }
      return serie;
    },
    getSpendingsSerie() {
      const serie = {
        values: [],
        area: true,
        type: "line",
        key: "Spending",
        yAxis: 2
      };

      if (this.cashflow.spendings && this.cashflow.spendings.length > 0) {
        for (let s of this.cashflow.spendings) {
          if (s.month === moment().format(mformat)) {
            serie.values.push({
              x: moment(s.month, mformat).valueOf(),
              y: s.totalSpent
            });
            break;
          }
        }
      }
      if (serie.values.length == 0) {
        this.createDefault(serie);
      }
      return serie;
    },
    getSavingsSerie() {
      const serie = {
        values: [],
        area: true,
        type: "line",
        key: "Savings",
        yAxis: 3
      };

      if (this.cashflow.savings && this.cashflow.savings.length > 0) {
        for (let s of this.cashflow.savings) {
          if (s.month === moment().format(mformat)) {
            serie.values.push({
              x: moment(s.month, mformat).valueOf(),
              y: s.totalSavings
            });
            break;
          }
        }
      }
      if (serie.values.length == 0) {
        this.createDefault(serie);
      }
      return serie;
    },
    createDefault(serie) {
      serie.values = [];
      serie.values.push({
        x: moment(moment().format(mformat)).valueOf(),
        y: 0.0
      });
    },
    createChart() {
      const barchartData = [];
      barchartData.push(this.getIncomeSerie());
      barchartData.push(this.getSpendingsSerie());
      barchartData.push(this.getSavingsSerie());

      //TODO: check if incomeSerie.values or spendingsSerie.values or .. is 0
      //barchartData has 3 entries but without empty values array
      if (barchartData.length === 0) {
        return (this.$refs.spendByCatChart.innerText = "No data found");
      } else {
        this.$refs.spendByCatChart.innerText = "";
      }

      nv.addGraph(() => {
        const graph = nv.models
          .multiBarChart()
          .margin({ left: 38, bottom: 20, right: 0 })
          .showControls(false)
          .color(["#ffc247", "#f55d5d", "#547fff"]);
        graph.legend.rightAlign(false).padding(17);
        graph.xAxis
          .showMaxMin(false)
          .tickFormat(d => d3.time.format("%b %d")(new Date(d)));
        graph.yAxis
          .showMaxMin(false)
          .tickFormat(d3.format(",f"))
          .ticks(5);
        graph.groupSpacing(0.1);

        d3.select(this.$refs.spendByCatChart)
          .datum(barchartData)
          .transition()
          .duration(200)
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
