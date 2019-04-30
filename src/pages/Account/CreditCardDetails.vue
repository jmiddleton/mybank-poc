<template>
  <div class="col-md-12 col-lg-10">
    <b-breadcrumb>
      <b-breadcrumb-item to="/app/dashboard">
        <span class="fi flaticon-home"></span>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Credit Card Details</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <div class="pb-xlg h-100">
          <div class="widgetBody widget-body" v-if="account && account.accountId">
            <div v-cloak class="widget-padding-md clearfix bg-secondary text-white">
              <h2>{{account.displayName}}</h2>
              <div class="widgetControls widget-controls">
                <a @click="refresh()">
                  <i class="la la-refresh"></i>
                </a>
                <a @click="makePayment()">
                  <i class="la la-edit"></i>
                </a>
                <a @click="unlinkAccount()" :id="aunlink">
                  <i class="la la-unlink"/>
                  <b-tooltip :placement="{default: 'top'}" :target="aunlink">Unlink</b-tooltip>
                </a>
              </div>
              <h3>{{account.maskedNumber}}</h3>
              <span class="badge badge-success">{{account.openStatus}}</span>&nbsp;
              <span
                v-if="account.updated"
                class="btn btn-outline btn-xs"
              >Updated {{account.updated | formatDate}}</span>
              <h5>
                <b-row>
                  <b-col lg="6"></b-col>
                  <b-col lg="2">
                    <p class="h6 m-0 fw-normal text-right">${{ getLimit(account.accountId) }}</p>
                    <h6 class="m-0 text-right">LIMIT</h6>
                  </b-col>
                  <b-col lg="2">
                    <p
                      class="h6 m-0 fw-normal text-right"
                    >${{ getAvailableBalance(account.accountId) }}</p>
                    <h6 class="m-0 text-right">AVAILABLE</h6>
                  </b-col>
                  <b-col lg="2">
                    <p
                      class="h5 m-0 fw-normal text-right"
                    >${{ getCurrentBalance(account.accountId) }}</p>
                    <h6 class="m-0 text-right">BALANCE</h6>
                  </b-col>
                </b-row>
              </h5>
            </div>
            <b-row>
              <b-col lg="1" class="profileContactContainer">
                <span class="thumb-xl mb-3" v-if="account !== undefined">
                  <img
                    :src="require('../../assets/banks/' + account.institution + '.png')"
                    alt="..."
                    class="profileAvatar rounded-circle"
                  >
                </span>
              </b-col>
              <b-col lg="1" class="profileStat stat-item" v-if="account.creditCard">
                <p
                  class="profileStatValue value text-right"
                >${{account.creditCard.minPaymentAmount}}</p>
                <h6 class="name text-right">MIN PAYMENT</h6>
              </b-col>
              <b-col lg="1" class="profileStat stat-item" v-if="account.creditCard">
                <p
                  class="profileStatValue value text-right"
                >${{account.creditCard.paymentDueAmount}}</p>
                <h6 class="name text-right">DUE AMOUNT</h6>
              </b-col>
              <b-col lg="1" class="profileStat stat-item" v-if="account.creditCard">
                <p
                  class="profileStatValue value text-right text-nowrap"
                >{{account.creditCard.paymentDueDate | date('DD MMMM')}}</p>
                <h6 class="name text-right text-nowrap">DUE DATE</h6>
              </b-col>
            </b-row>
            <div>
              <transaction-table></transaction-table>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import { mapState } from "vuex";
import TransactionTable from "./TransactionTable.vue";

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
    unlinkAccount() {
      this.$router.push({ path: "/app/unlink/" + this.accountId });
    },
    makePayment() {},
    getAvailableBalance(accountId) {
      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance.balanceUType === "deposit") {
        return balance.deposit.availableBalance.amount;
      } else if (balance.balanceUType === "lending") {
        return balance.lending.availableBalance.amount;
      }
      return "";
    },
    getCurrentBalance(accountId) {
      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance.balanceUType === "deposit") {
        return balance.deposit.currentBalance.amount;
      } else if (balance.balanceUType === "lending") {
        return balance.lending.accountBalance.amount;
      }
      return "";
    },
    getLimit(accountId) {
      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance.balanceUType === "deposit") {
        return balance.deposit.currentBalance.amount;
      } else if (balance.balanceUType === "lending") {
        return balance.lending.accountBalance.amount;
      }
      return "";
    }
  },
  computed: mapState("accounts", ["account", "balances"])
};
</script>
<style src="./AccountDetails.scss" lang="scss" scoped />