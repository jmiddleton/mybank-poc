<template>
  <div>
    <div class="col-md-12 col-lg-10">
      <b-breadcrumb>
        <b-breadcrumb-item>
          <span class="fi flaticon-home"></span>
        </b-breadcrumb-item>
      </b-breadcrumb>
      <h1 class="page-title">
        My Dashboard
        <a
          href="#"
          v-b-modal.modal-scrollable
          @click="showModal"
          class="float-right btn btn-outline-primary"
        >
          <i class="fa fa-edit mr-2"></i>Link Account
        </a>
        <a href data-widgster="load" class="small text-gray-light la la-refresh"></a>
      </h1>
      <b-row v-if="hasAccounts">
        <b-col xs="4">
          <div class="pb-xlg h-100">
            <Widget class="h-100 mb-0" title="TOTAL BALANCE">
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
              <div class="d-flex flex-wrap justify-content-between">
                <div class="mt">
                  <h5>$ {{totalAvailableBalance}}</h5>
                  <p class="text-muted mb-0 mr">
                    <small>Available Balance</small>
                  </p>
                </div>
              </div>
            </Widget>
          </div>
        </b-col>
        <b-col xs="4">
          <div class="pb-xlg">
            <Widget class="h-100 mb-0" title="SPENDING">
              <div class="mt mb">
                <SpendingsChart/>
              </div>
            </Widget>
          </div>
        </b-col>
        <b-col xs="4">
          <div class="pb-xlg">
            <Widget class="mb-0" title="AVERAGE SAVINGS">
              <div class="mt mb">
                <AverageSavingsChart/>
              </div>
            </Widget>
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="col-md-12 col-lg-10">
      <b-row v-for="(accounts, category) in accountsByCategory" :key="category">
        <b-col>
          <h3>{{getCategoryName(category)}}</h3>
          <b-list-group class="widgetBody widget-body">
            <b-list-group-item
              v-for="account in accounts"
              :key="account.accountId"
              class="list-group list-group-lg"
            >
              <span class="notificationIcon thumb-sm">
                <img :src="require('../../assets/banks/' + account.institution + '.png')" alt="...">
              </span>
              <div v-for="balance in balances" :key="balance.accountId">
                <div v-if="account.accountId === balance.accountId" class="stat-item float-right">
                  <div class="stat-item">
                    <h6 class="name fs-sm text-right">Available Balance</h6>
                    <p class="value text-right">$ {{ getAvailableBalance(balance) }}</p>
                  </div>
                  <div class="stat-item float-right">
                    <h6 class="name fs-sm text-right">Balance</h6>
                    <p class="value text-right">$ {{ getCurrentBalance(balance) }}</p>
                  </div>
                </div>
              </div>
              <a @click="getAccountDetails(account)">
                <span class="fw-semi-bold">{{ account.displayName }}</span>&nbsp;&nbsp;
                <span class="fa fa-external-link"></span>
              </a>
              <p class="deemphasize text-ellipsis m-0">{{ account.maskedNumber }}</p>
              <p v-if="account.updated" class="text-muted mb-0 mr">
                <small>Updated: {{ account.updated | formatDate }}</small>
              </p>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </div>
    <div v-if="!hasAccounts" class="col-md-12 col-lg-10">
      <div class="jumbotron">
        <h1 class="display-5">Thank you for choosing MyBank!!!</h1>
        <p class="lead">
          To get started click on the button Link Account to add one or more accounts from your bank.
          After you have chosen the accounts and confirmed consent, your accounts including transactions
          will be loaded into MyBank.
        </p>
      </div>
    </div>
    <BanksModal ref="banksModal"/>
  </div>
</template>

<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";
import AverageSavingsChart from "./AverageSavingsChart";
import SpendingsChart from "./SpendingsChart";
import BanksModal from "./BanksModal";
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
  components: { Widget, AverageSavingsChart, SpendingsChart, BanksModal },
  data() {
    return {
      // showLinkAccountMessage: false
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
      var cat = _.find(this.$store.getters["accounts/categories"], [
        "id",
        category
      ]);
      if (cat) {
        return cat.name;
      }
      return "";
    },
    getAvailableBalance(balance) {
      if (balance.balanceUType === "deposit") {
        return balance.deposit.availableBalance.amount;
      } else if (balance.balanceUType === "lending") {
        return balance.lending.availableBalance.amount;
      }
      return "";
    },
    getCurrentBalance(balance) {
      if (balance.balanceUType === "deposit") {
        return balance.deposit.currentBalance.amount;
      } else if (balance.balanceUType === "lending") {
        return balance.lending.accountBalance.amount;
      }
      return "";
    }
  },
  created() {
    this.$store.dispatch("accounts/loadAccountSummary");
    this.$store.dispatch("accounts/loadAccountBalances");
  },
  mounted(){
    // if(this.hasAccounts){
    //   this.showLinkAccountMessage= this.hasAccounts;
    // }else{
    //   this.showLinkAccountMessage= true;
    // }
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
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped />