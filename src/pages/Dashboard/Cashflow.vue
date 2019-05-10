<template>
  <section class="h-100 mb-0 widget">
    CASHFLOW
    <div>
      <div class="d-flex align-items-center mb-sm">
        <p class="width-100">
          <small>Income</small>
        </p>
        <div style="width: calc(100% - 100px)">
          <trend
            :data="getRandomData()"
            :gradient="['#9964e3','#1c96e3']"
            auto-draw
            stroke-width="6px"
            smooth
          />
        </div>
      </div>
      <div class="d-flex align-items-center mb-sm">
        <p class="width-100">
          <small>Spending</small>
        </p>
        <div style="width: calc(100% - 100px)">
          <trend
            :data="spendingsTrend"
            :gradient="['#ffc247','#ff5932']"
            auto-draw
            stroke-width="6px"
            smooth
          />
        </div>
      </div>
      <div class="d-flex align-items-center">
        <p class="width-100">
          <small>Savings</small>
        </p>
        <div style="width: calc(100% - 100px)">
          <trend
            :data="savingsTrend"
            :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
            auto-draw
            stroke-width="6px"
            smooth
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import { mapState } from "vuex";

const mformat = "YYYY-MM";

export default {
  name: "Cashflow",
  components: {},
  data() {
    return {
      savingsTrend: [],
      spendingsTrend: []
    };
  },
  methods: {
    getRandomData() {
      const arr = [];

      for (let i = 0; i < 10; i += 1) {
        arr.push(Math.random().toFixed(1) * 10);
      }
      return arr;
    },
    processSavings() {
      this.savingsTrend = [];
      this.savings.forEach(s => {
        this.savingsTrend.push(s.totalSavings);
      });
    },
    processSpendings() {
      this.spendingsTrend = [];
      this.spendingsTrend = _(this.spendings)
        .groupBy(spend => spend.month.substring(0, 7))
        .map((value, key) => Math.floor(_.sumBy(value, "totalSpent")))
        .value();
    }
  },
  watch: {
    savings(newValue) {
      this.processSavings();
    },
    spendings(newValue) {
      this.processSpendings();
    }
  },
  mounted() {
    
  },
  computed: {
    ...mapState("analytics", ["savings", "spendings"])
  }
};
</script>
