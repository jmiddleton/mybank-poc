<template>
  <div>
    <div class="dashboard-page">
      <div>
        <h1 class="page-title">
          My Accounts
          <a
            href="#"
            @click="showModal"
            class="float-right btn-md btn btn-outline-primary"
          >
            <i class="fa fa-plus mr-2"/>Add
          </a>
        </h1>
      </div>
    </div>
    <span class="float-right" v-if="hasAccounts && isLoadingAccounts">
      <i class="la la-refresh la-spin"/> Loading...
    </span>
    <div v-if="hasAccounts">
      <b-row v-for="(accounts, category) in accountsByCategory" :key="category">
        <b-col>
          <h3>{{category}}</h3>
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
import BanksModal from "./BanksModal";
import NoAccountMessage from "./NoAccountMessage";
import moment from "moment";
import _ from "lodash";
import { mapGetters, mapState } from "vuex";
import { clearInterval } from "timers";

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(value).format("DD MMM");
  }
});

export default {
  name: "Accounts",
  components: {
    Widget,
    BanksModal,
    NoAccountMessage
  },
  data() {
    return { isMessageShow: false };
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
      if (hasAccounts === false && !this.isMessageShow) {
        var NoAccountMessageClass = Vue.extend(NoAccountMessage);
        var noAccountMsgInstance = new NoAccountMessageClass();
        noAccountMsgInstance.$mount();
        this.$refs.container.appendChild(noAccountMsgInstance.$el);
        this.isMessageShow = true;
      }
    },
    init() {
      //if the actual page is not this, stop the interval
      if (!this.$refs.container) {
        try {
          clearInterval(this.interval);
        } catch {
          //nothing
        }
        return false;
      }

      this.$store.dispatch("accounts/loadAccountSummary");
      this.$store.dispatch("accounts/loadAccountBalances");
      this.showLinkAccountMessage(this.hasAccounts);
    }
  },
  created() {},
  mounted() {
    const me = this;
    this.isMessageShow = false;
    me.interval = setInterval(() => me.init(), 10000);
    me.init();
  },
  computed: {
    ...mapGetters("accounts", ["accountsByCategory"]),
    ...mapState("accounts", [
      "hasAccounts",
      "balances",
      "totalBalance",
      "totalAvailableBalance",
      "categories",
      "isLoadingAccounts"
    ])
  },
  watch: {
    hasAccounts(newValue) {
      this.showLinkAccountMessage(newValue);
    }
  }
};
</script>

<style src="./Accounts.scss" lang="scss" scoped />