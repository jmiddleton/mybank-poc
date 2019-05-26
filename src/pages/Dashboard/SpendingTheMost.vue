<template>
  <Widget :title="'<h5>'+topCategory.category+' history</h5>'" customHeader collapse close>
    <p class="fs-mini text-muted">
      The top spending for this month is
      <strong>{{topCategory.category}}</strong>
      with an average of <strong>$ {{average}}</strong>.
    </p>
    <div>
      <svg ref="topSpendingChart"></svg>
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
  name: "SpendingTheMost",
  components: {
    Widget
  },
  data() {
    return {
      currentMonth: "",
      topCategory: "",
      average:0
    };
  },
  methods: {
    getChartData() {
      this.barchartData = [];
      let total = 0;

      if (!this.spendingsByCategory) {
        return this.barchartData;
      }

      const data = this.spendingsByCategory.slice();
      data.sort(function(a, b) {
        return moment(a.month, mformat).isAfter(moment(b.month, mformat));
      });

      //get the most spend category
      const ccMonth = this.currentMonth;
      this.topCategory = _.maxBy(this.spendingsByCategory, function(spend) {
        const month = spend.month.substring(0, 7);
        if (month == ccMonth && spend.category != "Uncategorized") {
          return spend.totalSpent;
        } else {
          return 0;
        }
      });

      for (let i = 0; i < data.length; i++) {
        const spend = data[i];
        const month = spend.month.substring(0, 7);

        if (this.topCategory.category !== spend.category) {
          continue;
        }

        var serie = _.find(this.barchartData, { key: spend.category });
        if (!serie) {
          serie = {
            values: [],
            area: true,
            type: "bar",
            key: spend.category,
            yAxis: 1
          };
          this.barchartData.push(serie);
        }

        const value = {
          x: moment(month, mformat).valueOf(),
          y: Math.abs(spend.totalSpent)
        };

        serie.values.push(value);
        total = total + Math.abs(spend.totalSpent);
      }

      const serie2 = {
        values: [],
        type: "line",
        key: "Avg",
        yAxis: 1
      };

      serie.values.forEach(s => {
        serie2.values.push({ x: s.x, y: total / serie.values.length });
      });
      this.barchartData.push(serie2);
      this.average = serie2.values[0].y;
    },
    createChart() {
      this.getChartData();

      if (this.$refs.topSpendingChart) {
        if (this.barchartData.length === 0) {
          return (this.$refs.topSpendingChart.innerText = "No data found");
        } else {
          this.$refs.topSpendingChart.innerText = "";
        }
      }

      nv.addGraph(() => {
        const graph = nv.models
          .multiChart()
          .showLegend(false)
          .margin({ left: 45, bottom: 30, right: 0 })
          .color(["#9964e3", "#20B6B6"]);
        graph.xAxis
          .showMaxMin(false)
          .tickFormat(d => d3.time.format("%b %d")(new Date(d)));
        graph.yAxis1
          .showMaxMin(false)
          .tickFormat(d3.format(",f"))
          .ticks(5);
        graph.yAxis2
          .showMaxMin(false)
          .tickFormat(d3.format(",f"))
          .ticks(5);
        graph.tooltip.enabled(true);

        d3.select(this.$refs.topSpendingChart)
          // .style("height", "340px")
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
    }
  },
  mounted() {
    this.currentMonth = moment().format(mformat);
    window.addEventListener("resize", this.createChart);
  },
  unmounted() {
    window.removeEventListener("resize", this.createChart);
  },
  computed: {
    ...mapState("analytics", [
      "spendingsByCategory",
      "isLoadingSpendingsByCategory"
    ])
  },
  watch: {
    // currentMonth(newValue) {
    //   this.loadSpendings(newValue);
    // },
    spendingsByCategory() {
      this.createChart();
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>