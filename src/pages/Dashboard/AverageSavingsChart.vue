<template>
  <div ref="chartContainer" :style="{ height: '100px' }"/>
</template>

<script>
import $ from "jquery";

const ticks = [[0, "Feb"], [1, "Mar"], [2, "Apr"], [3, "May"], [4, "Jun"]];

export default {
  name: "BarsStackedChart",
  methods: {
    getStackedBarChartData() {
      var data = [
        [[0, 200],
        [1, 350],
        [2, 1000],
        [3, 90]]
      ];
      return data;
    },
    createChart(data) {
      return $.plot($(this.$refs.chartContainer), data, {
        series: {
          bars: {
            show: true,
            barWidth: 0.50,
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
          ticks: ticks,
          tickLength: 0,
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 10,
          axisLabelPadding: 10
        },
        colors: ["#78c448", "#dbd9f4"]
      });
    }
  },
  mounted() {
    this.createChart(this.getStackedBarChartData());
  }
};
</script>
