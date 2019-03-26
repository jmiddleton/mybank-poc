<template>
  <div class="col-md-12 col-lg-10">
    <b-breadcrumb>
      <b-breadcrumb-item>
        <span class="fi flaticon-home"></span>
      </b-breadcrumb-item>
      <b-breadcrumb-item>Accounts</b-breadcrumb-item>
      <b-breadcrumb-item active>Account Details</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <div class="pb-xlg h-100">
          <div class="widgetBody widget-body">
            <div class="widget-title widget-top widget-padding-md clearfix bg-primary text-white">
              <button @click="makeTransfer()" class="float-right btn-transfer btn btn-outline btn-sm mb-2">
                <i class="fa fa-edit mr-2"></i>
                Make a Transfer
              </button>
              <h1>{{account.displayName}} <span class="badge badge-success">{{account.openStatus}}</span></h1>
              <h3>{{account.maskedNumber}}</h3>
              <span class=" btn btn-outline btn-xs">Updated {{account.updated | formatDate}}</span>
              <h5>
                <div v-for="balance in balances" :key="balance.accountId">
                  <div
                    v-if="account.accountId === balance.accountId"
                    class="profileStat stat-item float-right stats-row mt-3"
                  >
                    <div class="profileStat stat-item">
                      <p
                        class="profileStatValue value text-right"
                      >$ {{ balance.deposit.availableBalance.amount }}</p>
                      <h6 class="name text-right">Available Balance</h6>
                    </div>
                    <div class="profileStat stat-item">
                      <p
                        class="profileStatValue value text-right"
                      >$ {{ balance.deposit.currentBalance.amount }}</p>
                      <h6 class="name text-right">Balance</h6>
                    </div>
                  </div>
                </div>
              </h5>
            </div>
            <div class="row">
              <div xs="12">
                <div class="profileContactContainer">
                  <span class="thumb-xl mb-3" v-if="account !== undefined">
                    <img
                      :src="require('../../assets/banks/' + account.institution + '.png')"
                      alt="..."
                      class="profileAvatar rounded-circle"
                    >
                  </span>

                  <div v-if="account.depositRates" class="stats-row col-md-12" xs="12">
                    <div
                      v-for="rate in account.depositRates"
                      :key="rate.depositRateType"
                      class="profileStat stat-item"
                    >
                      <p class="profileStatValue value text-right">{{rate.rate}}%</p>
                      <h6 class="name text-right">
                        {{rate.depositRateType}} &nbsp;
                        <a
                          v-if="rate.additionalInfoUri !== undefined && rate.additionalInfoUri !== ''"
                          target="new"
                          :href="rate.additionalInfoUri"
                        >
                          <span class="fa fa-external-link"></span>
                        </a>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <h4>Transaction History</h4>
              <transaction-table></transaction-table>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";
import { mapState, mapGetters } from "vuex";
import TransactionTable from "./TransactionTable.vue";
import moment from "moment";

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(value).format('DD MMM hh:mm')
  }
});

const { Messenger } = window;

export default {
  components: {
    Widget,
    "transaction-table": TransactionTable
  },
  data() {
    return {
      accountId: ""
    };
  },
  created() {
    this.accountId = this.$route.params.accountId;
    if (this.accountId !== undefined || this.accountId !== "") {
      this.$store.dispatch("accounts/getAccountById", this.accountId);
      this.$store.dispatch("accounts/loadAccountBalances");
    }
  },
  methods: {
    makeTransfer(){
      this.$router.push({ path: "/app/transfers/" + this.accountId });
    }

  },
  computed: mapGetters("accounts", ["account","balances"])
};
</script>
<style src="./AccountDetails.scss" lang="scss" scoped />