<template>
  <b-row>
    <b-col xs="12">
      <div ref="savingsChart" :style="{ height: '100px' }"/>
      <span v-if="!isDataAvailable">No Data Found</span>
    </b-col>
  </b-row>
</template>

<script>
import $ from "jquery";
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie";
import axios from "axios";
import moment from "moment";
import { mapState, mapGetters } from "vuex";

export default {
  name: "AverageSavingsChart",
  data() {
    return {
      isDataAvailable: false,
      ticks: [],
      data: []
    };
  },
  methods: {
    getSavingsData(savings) {
      if (!savings) {
        return data;
      }

      for (let i = 0; i < savings.length; i++) {
        var serie= [i, savings[i].totalSavings];
        this.data.push([serie]);
        this.ticks.push([i, savings[i].monthName] );
      }
    },
    createChart() {
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
        colors: ["#78c448", "#dbd9f4"]
      });
    }
  },
  mounted() {
    axios
      .get("/analytics/savings/" + moment().subtract(3, 'months').format("YYYY-MM"), {
        "page-size": 3
      })
      .then(r => r.data)
      .then(savings => {
        if (savings && savings.data) {
          this.getSavingsData(savings.data.savings)
          this.createChart();
          this.isDataAvailable = true;
        } else {
          this.isDataAvailable = false;
        }
      });
  }
};
</script>
