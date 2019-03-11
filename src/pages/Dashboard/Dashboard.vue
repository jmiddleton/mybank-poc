<template>
  <div>
    <div class="col-md-12 col-lg-10">
      <b-breadcrumb>
        <b-breadcrumb-item>
          <span class="fi flaticon-home"></span>
        </b-breadcrumb-item>
        <b-breadcrumb-item active>Accounts</b-breadcrumb-item>
      </b-breadcrumb>
      <h1 class="page-title">Account Summary
        <a href="#" class="float-right btn btn-outline-primary"><i class="fa fa-edit mr-2"></i>Link Account</a>
      </h1>
      <b-row>
        <b-col xs="4">
          <div class="pb-xlg h-100">
            <Widget class="h-100 mb-0">
              <div class="row flex-nowrap">
                <div xs="3">
                  <span class="widget-icon">
                    <i class="glyphicon glyphicon-usd text-success"></i>
                  </span>
                </div>
                <div xs="9" class="col">
                  <h6 class="m-0 text-right">TOTAL BALANCE</h6>
                  <p class="h2 m-0 fw-normal text-right">{{totalBalance}}</p>
                </div>
              </div>
              <div class="d-flex flex-wrap justify-content-between">
                <div class="mt">
                  <h6>$ {{totalAvailableBalance}}</h6>
                  <p class="text-muted mb-0">
                    <small>Available Balance</small>
                  </p>
                </div>
                <div class="mt">
                  <h6>2.5%</h6>
                  <p class="text-muted mb-0 mr">
                    <small>Rate</small>
                  </p>
                </div>
              </div>
            </Widget>
          </div>
        </b-col>
        <b-col xs="4">
          <div class="pb-xlg">
            <Widget class="h-100 mb-0" title="SPENDING">
              <b-row>
                <b-col xs="12" md="6" lg="7" class="text-center">
                  <div ref="chartContainer" style="height: 120px"/>
                </b-col>
                <b-col xs="12" md="5" lg="4">
                  <div ref="chartLegend"/>
                </b-col>
              </b-row>
            </Widget>
          </div>
        </b-col>
        <b-col xs="4">
          <div class="pb-xlg">
            <Widget class="mb-0" title="AVERAGE SAVINGS">
              <div class="mt mb">
                <StackedBar />
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
              v-for="account in accounts" :key="account.accountId"
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
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
/* eslint-disable */
import "imports-loader?jQuery=jquery,this=>window!flot";
import "imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie";
/* eslint-enable */
import Widget from "@/components/Widget/Widget";
import StackedBar from './AverageSavingsChart';

import { mapState, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: { Widget, StackedBar },
  methods: {
    getAccountDetails(account) {
      //TODO: externalise this in a key-value pair map.
      if(account.productCategory === "TRANS_AND_SAVINGS_ACCOUNTS"){
        this.$router.push({ path: "/app/accounts/" + account.accountId });
      }else if(account.productCategory === "CRED_AND_CHRG_CARDS"){
        this.$router.push({ path: "/app/creditcards/" + account.accountId });
      }else{
        this.$router.push({ path: "/app/termdeposit/" + account.accountId });
      }
    },

    getCategoryName(category){
      var cat= _.find(this.$store.getters["accounts/categories"], ['id', category]);
      if(cat){
        return cat.name;
      }
      return "";
    },

    getAvailableBalance(balance){
      if(balance.balanceUType === "deposit"){
        return balance.deposit.availableBalance.amount;
      }else if(balance.balanceUType === "lending"){
        return balance.lending.availableBalance.amount;
      }
      return "";
    },

    getCurrentBalance(balance){
      if(balance.balanceUType === "deposit"){
        return balance.deposit.currentBalance.amount;
      }else if(balance.balanceUType === "lending"){
        return balance.lending.accountBalance.amount;
      }
      return "";
    },
    

    getRandomData() {
      const arr = [];

      for (let i = 0; i < 25; i += 1) {
        arr.push(Math.random().toFixed(1) * 10);
      }

      return arr;
    },
    getData() {
      const data = [];
      const seriesCount = 5;
      const accessories = ["Supermarket", "Transport", "Shopping", "Housing", "Others"];

      for (let i = 0; i < seriesCount; i += 1) {
        data.push({
          label: accessories[i],
          data: Math.floor(Math.random() * 100) + 1
        });
      }
      return data;
    },
    initChart() {
      $.plot(this.$refs.chartContainer, this.getData(), {
        series: {
          pie: {
            innerRadius: 0.8,
            show: true,
            fill: 0.5
          }
        },
        colors: ["#ffc247", "#f55d5d", "#9964e3"],
        legend: {
          noColumns: 1,
          container: this.$refs.chartLegend,
          labelBoxBorderColor: "#ffffff"
        }
      });
    }
  },
  mounted() {
    this.initChart();
    this.$store.dispatch("accounts/loadAccountSummary");
    this.$store.dispatch("accounts/loadAccountBalances");

    window.addEventListener("resize", this.initChart);
  },
  computed: {
    ...mapGetters("accounts", [
      "balances",
      "totalBalance",
      "totalAvailableBalance",
      "accountsByCategory",
      "categories"
    ])
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped />