<template>
  <section class="h-100 mb-0 widget">
    TOTAL BALANCE
    <div class="clearfix">
      <b-row class="flex-nowrap">
        <b-col xs="3">
          <span class="widget-icon">
            <i class="glyphicon glyphicon-usd text-success"/>
          </span>
        </b-col>
        <b-col xs="9">
          <p class="h1 m-0 fw-normal text-right">{{savingsBalance}}</p>
        </b-col>
      </b-row>
      <b-row class="flex-nowrap">
        <b-col xs="6">
          <h6 class="m-0">Deposits</h6>
          <p class="value5">${{depositBalance}}</p>
        </b-col>
        <b-col xs="6">
          <h6 class="m-0 text-right">Available</h6>
          <p class="value5 text-right">${{savingsAvailable}}</p>
        </b-col>
      </b-row>
      <b-row class="flex-nowrap">
        <b-col xs="6">
          <h6 class="m-0">Loans</h6>
          <p class="value5">${{loansBalance}}</p>
        </b-col>
        <b-col xs="6">
          <h6 class="m-0 text-right">Credit Limit</h6>
          <p class="value5 text-right">${{creditAvailable}}</p>
        </b-col>
      </b-row>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Balances",
  data() {
    return {};
  },
  methods: {},
  mounted() {
    this.$store.dispatch("accounts/loadAccountBalances");
  },
  computed: {
    ...mapState("accounts", ["totals"]),
    depositBalance: function() {
      if (this.totals.get("TERM_DEPOSITS")) {
        return this.totals.get("TERM_DEPOSITS").balance;
      }
      return 0;
    },
    savingsBalance: function() {
      if (this.totals.get("TRANS_AND_SAVINGS_ACCOUNTS")) {
        return this.totals.get("TRANS_AND_SAVINGS_ACCOUNTS").balance;
      }
      return 0;
    },
    savingsAvailable: function() {
      if (this.totals.get("TRANS_AND_SAVINGS_ACCOUNTS")) {
        return this.totals.get("TRANS_AND_SAVINGS_ACCOUNTS").available;
      }
      return 0;
    },
    loansBalance: function() {
      let total=0;
      if (this.totals.get("PERS_LOANS")) {
        total= this.totals.get("PERS_LOANS").balance;
      }
      if (this.totals.get("MARGIN_LOANS")) {
        total= total + this.totals.get("MARGIN_LOANS").balance;
      }
      return total;
    },
    creditAvailable: function() {
      if (this.totals.get("CRED_AND_CHRG_CARDS")) {
        return this.totals.get("CRED_AND_CHRG_CARDS").available;
      }
      return 0;
    },
  }
};
</script>
