<template>
  <section class="h-100 mb-0 widget">
    TOTAL BALANCE
    <div class="clearfix">
            <b-row class="flex-nowrap">
              <b-col xs="3">
                <span class="widget-icon">
                  <i class="glyphicon glyphicon-usd text-success" />
                </span>
              </b-col>
              <b-col xs="9">
                <p class="h1 m-0 fw-normal text-right">{{totalBalance}}</p>
              </b-col>
            </b-row>
            <b-row class="flex-nowrap">
              <b-col xs="6">
                <h6 class="m-0">Deposits</h6>
                <p class="value5">$100830</p>
              </b-col>
              <b-col xs="6">
                <h6 class="m-0 text-right">Available</h6>
                <p class="value5 text-right">${{totalAvailableBalance}}</p>
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
  mounted() {
    this.$store.dispatch("accounts/loadAccountBalances");
  },
  computed: {
    ...mapState("accounts", ["totalBalance", "totalAvailableBalance"])
  }
};
</script>
