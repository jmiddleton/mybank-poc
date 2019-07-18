<template>
  <Widget
    :title="'<h5>Category - <small>' + currentMonth + '</small></h5>'"
    customHeader
    collapse
    navigate
    close
    @previous="changeMonth"
    @current="changeMonth"
    @next="changeMonth"
  >
    <p class="fs-mini text-muted">Tracks spendings by category over the last 4 months.</p>
    <div>
      <svg ref="spendByCatChart" />
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
      currentMonth: "",
      colors: []
    };
  },
  methods: {
    getCategoryChartData() {
      this.barchartData = [];
      this.colors = [];

      if (!this.spendingsByCategory) {
        return this.barchartData;
      }

      const data = this.spendingsByCategory.slice();
      data.sort(function(a, b) {
        return moment(a.month, mformat).isAfter(moment(b.month, mformat));
      });

      var order = 1;
      for (let i = 0; i < data.length; i++) {
        const spend = data[i];
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
          this.colors.push(this.categoryConfig[spend.category].color);
        }

        const value = {
          x: moment(month, mformat).valueOf(),
          y: Math.abs(spend.totalSpent)
        };
        serie.values.push(value);
      }
    },
    createCategoryChart() {
      this.getCategoryChartData();

      if (this.$refs.spendByCatChart) {
        if (this.barchartData.length === 0) {
          return (this.$refs.spendByCatChart.innerText = "No data found");
        } else {
          this.$refs.spendByCatChart.innerText = "";
        }
      }

      nv.addGraph(() => {
        const graph = nv.models
          .multiBarChart()
          .margin({ left: 45, bottom: 30, right: 0 })
          .showControls(false)
          .color(this.colors);
        graph.legend.rightAlign(false);
        graph.xAxis
          .showMaxMin(false)
          .tickFormat(d => d3.time.format("%b %d")(new Date(d)));
        graph.yAxis
          .showMaxMin(false)
          .tickFormat(d3.format(",f"))
          .ticks(8);
        graph.groupSpacing(0.1);

        d3.select(this.$refs.spendByCatChart)
          .style("height", "320px")
          .datum(this.barchartData)
          .transition()
          .duration(300)
          .call(graph);

        nv.utils.windowResize(graph.update);
      });
    },
    loadSpendings(month) {
      const query = {
        month: month,
        monthsToPrefetch: 3
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
      "isLoadingSpendingsByCategory",
      "categoryConfig"
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