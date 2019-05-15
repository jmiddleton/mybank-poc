<template>
  <section class="h-100 mb-0 widget">
    CASHFLOW
    <div>
      <div class="d-flex align-items-center mb-sm">
        <h6 style="width: 90px;">Income</h6>
        <div style="width: 160px;">
          <trend
            :data="incomesTrend"
            :gradient="['#9964e3','#1c96e3']"
            auto-draw
            stroke-width="6px"
            smooth
          />
        </div>
      </div>
      <div class="d-flex align-items-center mb-sm">
        <h6 style="width: 90px;">Spending</h6>
        <div style="width: 160px;">
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
        <h6 style="width: 90px;">Savings</h6>
        <div style="width: 160px;">
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
import { mapState } from "vuex";

export default {
  name: "Cashflow",
  components: {},
  data() {
    return {
      incomesTrend: [],
      savingsTrend: [],
      spendingsTrend: []
    };
  },
  methods: {
    processIncome() {
      //savings starts on zero
      this.incomesTrend = [0];
      this.cashflow.incomes.forEach(s => {
        this.incomesTrend.push(s.totalIncome);
      });
    },
    processSavings() {
      //savings starts on zero
      this.savingsTrend = [0];
      this.cashflow.savings.forEach(s => {
        this.savingsTrend.push(s.totalSavings);
      });
    },
    processSpendings() {
      this.spendingsTrend = [0];
      this.cashflow.spendings.forEach(s => {
        this.spendingsTrend.push(s.totalSpent);
      });
    }
  },
  watch: {
    cashflow() {
      this.processIncome();
      this.processSavings();
      this.processSpendings();
    }
  },
  mounted() {
    //const month = moment().format(mformat);
    //this.$store.dispatch("analytics/loadCashflow", month);
  },
  computed: {
    ...mapState("analytics", ["cashflow"])
  }
};
</script>
