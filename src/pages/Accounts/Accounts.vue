<template>
  <div>
    <b-alert
      v-if="message"
      class="alert-transparent"
      show
      dismissible
      :variant="messageVariant"
    >{{message}}</b-alert>
    <div class="dashboard-page">
      <div>
        <h2 class="page-title">
          My Accounts
          <a
            href="#"
            @click="showModal"
            class="float-right btn-md btn btn-outline-primary"
          >
            <i class="fa fa-plus mr-2"/>Link Account
          </a>
          <span class="float-right" v-if="hasAccounts && isLoadingAccounts">
            <p class="fs-mini text-muted">
              <i class="la la-refresh la-spin"/> Loading...
            </p>
          </span>
        </h2>
      </div>
    </div>
    <div v-if="hasAccounts">
      <b-row v-for="(accounts, category) in accountsByCategory" :key="category">
        <b-col>
          <h3>{{category}}</h3>
          <Widget v-for="account in accounts" :key="account.accountId">
            <div class="clearfix">
              <a @click="getAccountDetails(account)">
                <b-row class="flex-nowrap justify-content-between">
                  <b-col lg="4">
                    <span class="notificationIcon thumb-sm">
                      <img
                        :src="require('../../assets/banks/' + account.institution + '.png')"
                        alt="..."
                      >
                    </span>
                    <div>
                      <h6 v-if="account.nickname" class="m-0">{{account.nickname}}</h6>
                      <h6 v-else class="m-0">{{ account.displayName}}</h6>
                    </div>
                  </b-col>
                  <b-col lg="4"></b-col>
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
                <div>
                  <span class="value6">{{ account.maskedNumber }}</span>
                  <br>
                  <small v-if="account.lastUpdated">Updated: {{ account.lastUpdated | fromNow}}</small>
                </div>
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

Vue.filter("fromNow", function(value) {
  if (value) {
    return moment(value).fromNow();
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
    return { isMessageShow: false, message: "", messageVariant: "" };
  },
  methods: {
    showModal() {
      this.$refs.banksModal.show = true;
    },
    handleNetworkError(msg) {
      this.message = msg.message;
      this.messageVariant = msg.variant;
    },
    getAccountDetails(account) {
      //TODO: externalise this in a key-value pair map.
      if (account.productCategory === "TRANS_AND_SAVINGS_ACCOUNTS") {
        this.$router.push({ path: "/app/accounts/" + account.accountId });
      } else if (account.productCategory === "CRED_AND_CHRG_CARDS") {
        this.$router.push({ path: "/app/creditcards/" + account.accountId });
      } else if (account.productCategory === "TERM_DEPOSITS") {
        this.$router.push({ path: "/app/termdeposits/" + account.accountId });
      } else if (account.productCategory.indexOf("_LOANS") >= 0) {
        this.$router.push({ path: "/app/loans/" + account.accountId });
      }
    },
    getAvailableBalance(accountId) {
      if (!this.balances) {
        return "";
      }
      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance) {
        return balance.availableBalance;
      }
      return "";
    },
    getCurrentBalance(accountId) {
      if (!this.balances) {
        return "";
      }
      const balance = _.find(this.balances, ["accountId", accountId]);
      if (balance) {
        return balance.currentBalance;
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