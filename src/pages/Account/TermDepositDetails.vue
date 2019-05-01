<template>
  <div class="dashboard-page">
    <b-row>
      <b-col>
        <div class="pb-xlg h-100">
          <div class="widgetBody widget-body" v-if="account && account.accountId">
            <div v-cloak class="widget-padding-md clearfix bg-danger text-white">
              <h2>{{account.displayName}}</h2>
              <div class="widgetControls widget-controls">
                <a @click="refresh()">
                  <i class="la la-refresh"></i>
                </a>
                <a @click="makeTransfer()">
                  <i class="la la-edit"></i>
                </a>
                <a @click="unlinkAccount()" :id="aunlink">
                  <i class="la la-unlink"/>
                  <b-tooltip :placement="{default: 'top'}" :target="aunlink">Unlink</b-tooltip>
                </a>
              </div>
              <h4>
                {{account.maskedNumber}}
                <span class="badge badge-success">{{account.openStatus}}</span>
              </h4>
              <span
                v-if="account.updated"
                class="btn btn-outline btn-xs"
              >Updated {{account.updated | formatDate}}</span>
              <h5>
                <b-row>
                  <b-col lg="8"></b-col>
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
                <span class="thumb-lg mb-3" v-if="account !== undefined">
                  <img
                    :src="require('../../assets/banks/' + account.institution + '.png')"
                    alt="..."
                    class="profileAvatar rounded-circle"
                  >
                </span>
              </b-col>
              <b-col
                lg="1"
                v-for="rate in account.depositRates"
                :key="rate.depositRateType"
                class="profileStat stat-item"
              >
                <p class="profileStatValue value text-left">{{rate.rate}}%</p>
                <h6 class="text-left text-nowrap">
                  {{rate.depositRateType}} &nbsp;
                  <a
                    v-if="rate.additionalInfoUri !== undefined && rate.additionalInfoUri !== ''"
                    target="new"
                    :href="rate.additionalInfoUri"
                  >
                    <span class="fa fa-external-link"></span>
                  </a>
                </h6>
              </b-col>
            </b-row>
            <div>
              <transaction-table ref="txnTable"></transaction-table>
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
import { mapState } from "vuex";
import TransactionTable from "./TransactionTable.vue";
import moment from "moment";
import axios from "axios";
import _ from "lodash";

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(value).format("DD MMM");
  }
});

export default {
  components: {
    Widget,
    "transaction-table": TransactionTable
  },
  data() {
    return {
      aunlink:"",
      accountId: "",
      auth: {}
    };
  },
  created() {
    this.accountId = this.$route.params.accountId;
    this.init();
  },
  methods: {
    init() {
      if (this.accountId !== undefined || this.accountId !== "") {
        this.$store.dispatch("accounts/getAccountById", this.accountId);
        this.$store.dispatch("accounts/loadAccountBalances");
      }
    },
    async refresh() {
      //TODO: if userBankAuth is expired, re-authenticate the user
      try {
        await axios
          .get("/bankauths/" + this.account.institution)
          .then(r => r.data)
          .then(auth => {
            if (auth) {
              this.refreshAccount(this.accountId, this.account.institution);
            }
          });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          axios
            .get("/banks/" + this.account.institution)
            .then(r => r.data)
            .then(bank => {
              Vue.prototype.$auth.authorise(
                "/app/accounts/" + this.accountId,
                "/accounts/" + this.accountId + "/refresh",
                bank,
                this.accountId
              );
            });
        }
      }
    },
    refreshAccount(accountId, bankcode) {
      const authState = {
        nonce: "stateKey-fadfadfadf3413",
        redirectTo: "/app/accounts/" + accountId,
        bankcode: bankcode,
        accountId: accountId,
        postAuthCodeTo: "/accounts/" + accountId + "/refresh"
      };
      localStorage.setItem("auth_state", JSON.stringify(authState));
      this.$router.push({ path: "/app/bankcallback/" });
    },
    makeTransfer() {
      this.$router.push({ path: "/app/transfers/" + this.accountId });
    },
    unlinkAccount() {
      this.$router.push({ path: "/app/unlink/" + this.accountId });
    },
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
    }
  },
  computed: mapState("accounts", ["account", "balances"])
};
</script>
<style src="./AccountDetails.scss" lang="scss" scoped />