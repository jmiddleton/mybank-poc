<template>
  <div>
    <div class="dashboard-page">
      <div>
        <h1 class="page-title">
          My Dashboard
          <a href="#" @click="showModal" class="float-right btn-md btn btn-outline-primary">
            <i class="fa fa-plus mr-2"/>Add
          </a>
        </h1>
      </div>
      <div v-if="hasAccounts" class="d-none d-md-block">
        <b-row>
          <b-col lg="4" xs="12">
            <Widget class="h-100 mb-0">
              TOTAL BALANCE
              <div class="row flex-nowrap">
                <div xs="3">
                  <span class="widget-icon">
                    <i class="glyphicon glyphicon-usd text-success"></i>
                  </span>
                </div>
                <div xs="9" class="col">
                  <p class="h1 m-0 fw-normal text-right">{{totalBalance}}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="mt">
                  <small>Available</small>
                  <h5>$ {{totalAvailableBalance}}</h5>
                </div>
              </div>
            </Widget>
          </b-col>
          <b-col lg="4" xs="12">
            <SpendingsChart/>
          </b-col>
          <b-col lg="4" xs="12">
            <AverageSavingsChart/>
          </b-col>
        </b-row>
      </div>
    </div>
    <span>&nbsp;</span>
    <div v-if="hasAccounts">
      <b-row v-for="(accounts, category) in accountsByCategory" :key="category">
        <b-col>
          <h3>{{getCategoryName(category)}}</h3>
          <Widget v-for="account in accounts" :key="account.accountId">
            <div class="clearfix">
              <a @click="getAccountDetails(account)">
                <b-row class="flex-nowrap justify-content-between">
                  <b-col lg="2">
                    <span class="thumb my-widget-icon">
                      <img
                        :src="require('../../assets/banks/' + account.institution + '.png')"
                        alt="..."
                      >
                    </span>
                  </b-col>
                  <b-col lg="6"></b-col>
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
                <b-row class="flex-nowrap">
                  <b-col lg="10"></b-col>
                </b-row>
                <h6 class="m-0">{{ account.displayName }}</h6>
                <p class="value6">{{ account.maskedNumber }}</p>
              </a>
            </div>
          </Widget>
        </b-col>
      </b-row>
    </div>
    <div ref="container" class="col-md-12 col-lg-10"></div>
    <BanksModal ref="banksModal"/>
  </div>
</template>

<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";
import AverageSavingsChart from "./AverageSavingsChart";
import SpendingsChart from "./SpendingsChart";
import BanksModal from "./BanksModal";
import NoAccountMessage from "./NoAccountMessage";
import moment from "moment";
import _ from "lodash";
import { mapGetters, mapState } from "vuex";

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(value).format("DD MMM");
  }
});

export default {
  name: "Dashboard",
  components: {
    Widget,
    AverageSavingsChart,
    SpendingsChart,
    BanksModal,
    NoAccountMessage
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    showModal() {
      this.$refs.banksModal.show = true;
    },
    getAccountDetails(account) {
      //TODO: externalise this in a key-value pair map.
      if (account.productCategory === "TRANS_AND_SAVINGS_ACCOUNTS") {
        this.$router.push({ path: "/app/accounts/" + account.accountId });
      } else if (account.productCategory === "CRED_AND_CHRG_CARDS") {
        this.$router.push({ path: "/app/creditcards/" + account.accountId });
      } else {
        this.$router.push({ path: "/app/termdeposit/" + account.accountId });
      }
    },
    getCategoryName(category) {
      var cat = _.find(this.categories, ["id", category]);
      if (cat) {
        return cat.name;
      }
      return "";
    },
    getAvailableBalance(accountId) {
      if (!this.balances) {
        return "";
      }

      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance && balance.balanceUType === "deposit") {
        return balance.deposit.availableBalance.amount;
      } else if (balance && balance.balanceUType === "lending") {
        return balance.lending.availableBalance.amount;
      }
      return "";
    },
    getCurrentBalance(accountId) {
      if (!this.balances) {
        return "";
      }

      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance && balance.balanceUType === "deposit") {
        return balance.deposit.currentBalance.amount;
      } else if (balance && balance.balanceUType === "lending") {
        return balance.lending.accountBalance.amount;
      }
      return "";
    },
    showLinkAccountMessage(hasAccounts) {
      if (hasAccounts === false) {
        var NoAccountMessageClass = Vue.extend(NoAccountMessage);
        var noAccountMsgInstance = new NoAccountMessageClass();
        noAccountMsgInstance.$mount();
        this.$refs.container.appendChild(noAccountMsgInstance.$el);
      }
    }
  },
  created() {},
  mounted() {
    this.$store.dispatch("accounts/loadAccountSummary");
    this.$store.dispatch("accounts/loadAccountBalances");
    this.showLinkAccountMessage(this.hasAccounts);
  },
  computed: {
    ...mapGetters("accounts", ["accountsByCategory"]),
    ...mapState("accounts", [
      "hasAccounts",
      "balances",
      "totalBalance",
      "totalAvailableBalance",
      "categories"
    ])
  },
  watch: {
    hasAccounts(newValue) {
      this.showLinkAccountMessage(newValue);
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped />