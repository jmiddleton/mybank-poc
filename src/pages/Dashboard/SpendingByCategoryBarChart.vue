<template>
  <Widget
    :title="'<h5>Category - <small>' + currentMonth + '</small></h5>'"
    customHeader
    collapse
    navigate
    @previous="changeMonth"
    @current="changeMonth"
    @next="changeMonth"
  >
    <p class="fs-mini text-muted">Tracks spendings by category over the last 3 months.</p>
    <div>
      <svg ref="spendByCatChart"></svg>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import moment from "moment";
import _ from "lodash";
import { mapState } from "vuex";
import d3 from "d3";
import nv from "nvd3";

const mformat = "YYYY-MM";

export default {
  name: "SpendingByCategoryBarChart",
  components: {
    Widget
  },
  data() {
    return {
      currentMonth: ""
    };
  },
  methods: {
    getCategoryChartData() {
      this.barchartData = [];

      if (!this.spendingsByCategory) {
        return this.barchartData;
      }

      var order = 1;
      for (let i = 0; i < this.spendingsByCategory.length; i++) {
        const spend = this.spendingsByCategory[i];
        const month = spend.month.substring(0, 7);

        var serie = _.find(this.barchartData, { key: spend.category });
        if (!serie) {
          serie = {
            values: [],
            area: true,
            type: "line",
            key: spend.category,
            yAxis: order++
          };

          this.barchartData.push(serie);
        }

        const value = {
          x: moment(month, mformat).valueOf(),
          y: Math.abs(spend.totalSpent)
        };
        serie.values.push(value);
      }

      if (this.$refs.spendByCatChart) {
        if (this.barchartData.length === 0) {
          return (this.$refs.spendByCatChart.innerText = "No data found");
        } else {
          this.$refs.spendByCatChart.innerText = "";
        }
      }
    },
    createCategoryChart() {
      this.getCategoryChartData();

      nv.addGraph(() => {
        const graph = nv.models
          .multiBarChart()
          .margin({ left: 45, bottom: 30, right: 0 })
          .showControls(false)
          .color([
            "#c4c2ff",
            "#fa7bb7",
            "#b7fa7b",
            "#3689ff",
            "#8056ff",
            "#c9c8d5",
            "#c2dfff",
            "#76b7ff",
            "#7bfabe"
          ]);
        graph.legend.rightAlign(false);
        graph.xAxis
          .showMaxMin(false)
          .tickFormat(d => d3.time.format("%b %d")(new Date(d)));
        graph.yAxis.showMaxMin(false).tickFormat(d3.format(",f"));

        d3.select(this.$refs.spendByCatChart)
          .style("height", "340px")
          .datum(this.barchartData)
          .transition()
          .duration(500)
          .call(graph);

        nv.utils.windowResize(graph.update);
      });
    },
    loadSpendings(month) {
      const query = {
        month: month,
        monthsToPrefetch: 2
      };
      this.$store.dispatch("analytics/loadSpendingsByCategory", query);
    },
    handleRefresh() {
      this.loadSpendings(this.currentMonth);
    },
    changeMonth(month) {
      if (month === 0) {
        this.currentMonth = moment().format(mformat);
      } else {
        this.currentMonth = moment(this.currentMonth, mformat)
          .add(month, "months")
          .format(mformat);
      }

      const mcurrent = moment(this.currentMonth, mformat);
      if (
        mcurrent.month() > moment().month() &&
        mcurrent.year() > moment().year()
      ) {
        return;
      }
    }
  },
  mounted() {
    this.currentMonth = moment().format(mformat);
    window.addEventListener("resize", this.createCategoryChart);
  },
  unmounted() {
    window.removeEventListener("resize", this.createCategoryChart);
  },
  computed: {
    ...mapState("analytics", [
      "spendingsByCategory",
      "isLoadingSpendingsByCategory"
    ])
  },
  watch: {
    currentMonth(newValue) {
      this.loadSpendings(newValue);
    },
    spendingsByCategory() {
      this.createCategoryChart();
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>