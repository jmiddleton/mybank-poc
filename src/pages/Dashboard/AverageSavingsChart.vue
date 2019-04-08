<template>
  <b-row>
    <b-col xs="12">
      <div ref="savingsChart" :style="{ height: '100px' }"/>
    </b-col>
  </b-row>
</template>

<script>
import $ from "jquery";
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie";
import axios from "axios";
import moment from "moment";

export default {
  name: "AverageSavingsChart",
  data() {
    return {
      ticks: [],
      data: []
    };
  },
  methods: {
    getSavingsData(savings) {
      if (!savings) {
        return this.data;
      }

      for (let i = 0; i < savings.length; i++) {
        var serie= [i, savings[i].totalSavings];
        this.data.push([serie]);
        this.ticks.push([i, savings[i].monthName.substring(0, 3)] );
      }
    },
    createChart() {
      if(this.data.length == 0){
        return this.$refs.savingsChart.innerText= "No data found";
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
    }
  },
  mounted() {
    axios
      .get("/analytics/savings/" + moment().subtract(3, 'months').format("YYYY-MM"), {
        "page-size": 4
      })
      .then(r => r.data)
      .then(savings => {
        if (savings && savings.data) {
          this.getSavingsData(savings.data.savings)
          this.createChart();
        }
      });
  }
};
</script>
