<template>
  <div class="col-md-12 col-lg-10">
    <b-breadcrumb>
      <b-breadcrumb-item><span class="fi flaticon-home"></span></b-breadcrumb-item>
      <b-breadcrumb-item active>Accounts</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title">Account Summary</h1>
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
              <div xs="9" class="col"><h6 class="m-0">TOTAL BALANCE</h6>
                <p class="h2 m-0 fw-normal">{{totalBalance}}</p>
              </div>
            </div>
            <div class="d-flex flex-wrap justify-content-between">
              <div class="mt">
                <h6>$ {{totalAvailableBalance}}</h6><p class="text-muted mb-0"><small>Available Balance</small></p>
              </div>
              <div class="mt">
                <h6>2.5%</h6><p class="text-muted mb-0 mr"><small>Rate</small></p>
              </div>
            </div>
          </Widget>
        </div>
      </b-col>
      <b-col  xs="4">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Spending">
            <b-row>
              <b-col xs="12" md="6" lg="7" class="text-center">
                <div ref="chartContainer" style="height: 100px" />
              </b-col>
              <b-col xs="12" md="5" lg="4">
                <div ref="chartLegend" />
              </b-col>
            </b-row>
          </Widget>
        </div>
      </b-col>
      <b-col xs="4">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Upcoming Transactions">
            <p class="text-muted d-flex flex-wrap">
              <small class="mr-lg d-flex align-items-center">
                <span class="circle bg-success text-success mr-xs" style="font-size: 4px;">.</span>
                  This Period
              </small>
              <small class="mr-lg d-flex align-items-center">
                <span class="circle bg-warning text-warning mr-xs" style="font-size: 4px;">.</span>
                Last Period
              </small>
            </p>
            Nothing yet!!!
          </Widget>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>Accounts</h3>
        <b-list-group class="widgetBody widget-body">
          <b-list-group-item v-for="account in filteredAccounts" :key="account.accountId" class="list-group list-group-lg">
            <span class="notificationIcon thumb-sm">
              <img :src="require('../../assets/banks/' + account.institution + '.png')" alt="..." />
            </span>
            <div v-for="balance in balances" :key="balance.accountId">
              <div v-if="account.accountId === balance.accountId" class="stat-item float-right">
                <div class="stat-item"><h6 class="name fs-sm">Available Balance</h6><p class="value">$ {{ balance.deposit.availableBalance.amount }}</p></div>
                <div class="stat-item float-right"><h6 class="name fs-sm">Balance</h6><p class="value">$ {{ balance.deposit.currentBalance.amount }}</p></div>
              </div>
            </div>
            <a @click="getAccountDetails(account.accountId)"><span class='fw-semi-bold'>{{ account.displayName }}</span>&nbsp;&nbsp;<span class="fa fa-external-link"></span></a>
            <p class="deemphasize text-ellipsis m-0">
              {{ account.maskedNumber }}
            </p>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>Credit Cards</h3>
        <b-list-group class="widgetBody widget-body">
          <b-list-group-item v-for="account in filteredCreditCards" :key="account.accountId" class="list-group list-group-lg">
            <span class="notificationIcon thumb-sm">
              <img class="rounded-circle" :src="require('../../assets/banks/' + account.institution + '.png')" alt="..." />
            </span>
            <div v-for="balance in balances" :key="balance.accountId">
              <div v-if="account.accountId === balance.accountId" class="stats-item float-right">
                <div class="stat-item"><h6 class="name fs-sm">Limit</h6><p class="value">$ {{ balance.lending.creditLimit.amount }}</p></div>
                <div class="stat-item"><h6 class="name fs-sm">Available Balance</h6><p class="value">$ {{ balance.lending.availableBalance.amount }}</p></div>
                <div class="stat-item float-right"><h6 class="name fs-sm">Balance</h6><p class="value">$ {{ balance.lending.accountBalance.amount }}</p></div>
              </div>
            </div>
              <a @click="getCreditCardDetails(account.accountId)"><span class='fw-semi-bold'>{{ account.displayName }}</span>&nbsp;&nbsp;<span class="fa fa-external-link"></span></a>
              <p class="deemphasize text-ellipsis m-0">
                {{ account.maskedNumber }}
              </p>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>  
  </div>
</template>

<script>
import $ from 'jquery';
/* eslint-disable */
import 'imports-loader?jQuery=jquery,this=>window!flot';
import 'imports-loader?jQuery=jquery,this=>window!flot/jquery.flot.pie';
/* eslint-enable */
import Widget from '@/components/Widget/Widget';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  components: { Widget },
  methods: {
    getAccountDetails(accountId){
        this.$router.push({ path: "/app/accounts/" + accountId });
    },
    getCreditCardDetails(accountId){
        this.$router.push({ path: "/app/creditcards/" + accountId });
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
      const seriesCount = 3;
      const accessories = ['Supermarket', 'Car', 'Others'];

      for (let i = 0; i < seriesCount; i += 1) {
        data.push({
          label: accessories[i],
          data: Math.floor(Math.random() * 100) + 1,
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
            fill: 0.5,
          },
        },
        colors: ['#ffc247', '#f55d5d', '#9964e3'],
        legend: {
          noColumns: 1,
          container: this.$refs.chartLegend,
          labelBoxBorderColor: '#ffffff',
        },
      });
    }
  },
  mounted() {
    this.initChart();
    this.$store.dispatch('accounts/loadAccountSummary');
    this.$store.dispatch('accounts/loadAccountBalances');
    
    window.addEventListener('resize', this.initChart);
  },
  computed: {
    filteredCreditCards: function () {
      return this.$store.getters['accounts/accountsList'].filter(function (acc) {
        return acc.accountType === "CREDIT_CARD";
      })
    },
    filteredAccounts: function () {
      return this.$store.getters['accounts/accountsList'].filter(function (acc) {
        return acc.accountType === "ACCOUNT";
      })
    },
      // map `this.doneCount` to `this.$store.getters.doneTodosCount`
    ...mapGetters("accounts", [
      'balances',
      'totalBalance',
      'totalAvailableBalance'
    ])
}
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped />