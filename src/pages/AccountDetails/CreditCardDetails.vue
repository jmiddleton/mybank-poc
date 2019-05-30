<template>
  <div class="dashboard-page">
    <b-row>
      <b-col>
        <div class="pb-xlg h-100">
          <div class="widgetBody widget-body" v-if="account && account.accountId">
            <div v-cloak class="widget-padding-md clearfix bg-secondary text-white">
              <h3>{{account.displayName}}</h3>
              <div class="widgetControls">
                <b-nav>
                  <b-nav-item-dropdown class="settingsDropdown mr-2" right>
                    <template slot="button-content">
                      <i class="text-white la la-lg la-cog"/>
                    </template>
                    <b-dropdown-item @click="makePayment()">
                      <i class="la la-lg la-edit"/> Make a Transfer
                    </b-dropdown-item>
                    <b-dropdown-item @click="refresh()">
                      <i class="la la-lg la-refresh"/> Refresh
                    </b-dropdown-item>
                    <b-dropdown-item @click="unlinkAccount()">
                      <i class="la la-lg la-unlink"/> Unlink Account
                    </b-dropdown-item>
                  </b-nav-item-dropdown>
                </b-nav>
              </div>
              <h5>{{account.maskedNumber}}</h5>
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
                <span class="thumb-lg mb-3" v-if="account !== undefined">
                  <img
                    :src="require('../../assets/banks/' + account.institution + '.png')"
                    alt="..."
                    class="profileAvatar rounded-circle"
                  >
                </span>
              </b-col>
              <b-col lg="1" class="profileStat stat-item" v-if="account.creditCard">
                <p
                  class="profileStatValue value text-left"
                >${{account.creditCard.minPaymentAmount}}</p>
                <h6 class="text-left">MIN PAYMENT</h6>
              </b-col>
              <b-col lg="1" class="profileStat stat-item" v-if="account.creditCard">
                <p
                  class="profileStatValue value text-left"
                >${{account.creditCard.paymentDueAmount}}</p>
                <h6 class="text-left">DUE AMOUNT</h6>
              </b-col>
              <b-col lg="1" class="profileStat stat-item" v-if="account.creditCard">
                <p
                  class="profileStatValue value text-left text-nowrap"
                >{{account.creditCard.paymentDueDate | date('DD MMM')}}</p>
                <h6 class="text-left">DUE DATE</h6>
              </b-col>
            </b-row>
            &nbsp;
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
import Vue from "vue";
import Widget from "@/components/Widget/Widget";
import { mapState } from "vuex";
import TransactionTable from "./TransactionTable.vue";
import axios from "axios";
import _ from "lodash";

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
      if (balance && balance.balanceUType === "deposit") {
        return balance.deposit.availableBalance.amount;
      } else if (balance && balance.balanceUType === "lending") {
        return balance.lending.availableBalance.amount;
      }
      return "";
    },
    getCurrentBalance(accountId) {
      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance && balance.balanceUType === "deposit") {
        return balance.deposit.currentBalance.amount;
      } else if (balance && balance.balanceUType === "lending") {
        return balance.lending.accountBalance.amount;
      }
      return "";
    },
    getLimit(accountId) {
      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance && balance.balanceUType === "deposit") {
        return balance.deposit.currentBalance.amount;
      } else if (balance && balance.balanceUType === "lending") {
        return balance.lending.accountBalance.amount;
      }
      return "";
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
        if (error && error.response && error.response.status === 404) {
          axios
            .get("/banks/" + this.account.institution)
            .then(r => r.data)
            .then(bank => {
              Vue.prototype.$auth.authorise(
                "/app/creditcards/" + this.accountId,
                "/creditcards/" + this.accountId + "/refresh",
                bank,
                this.accountId
              );
            });
        }
      }
    },
    refreshAccount(accountId, bankcode) {
      const authState = {
        nonce: "stateKey-1232",
        redirectTo: "/app/creditcards/" + accountId,
        bankcode: bankcode,
        accountId: accountId,
        postAuthCodeTo: "/creditcards/" + accountId + "/refresh"
      };
      localStorage.setItem("auth_state", JSON.stringify(authState));
      this.$router.push({ path: "/app/bankcallback/" });
    },
  },
  computed: mapState("accounts", ["account", "balances"])
};
</script>
<style src="./AccountDetails.scss" lang="scss" scoped />