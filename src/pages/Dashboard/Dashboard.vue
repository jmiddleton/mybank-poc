<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>Home</b-breadcrumb-item>
      <b-breadcrumb-item active>Dashboard</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title">Dashboard</h1>
    <b-row>
      <b-col xs="4">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0">
            <div class="row flex-nowrap">
              <div xs="3" class="col">
                <span class="widget-icon"><i class="glyphicon glyphicon-usd text-success"></i></span>
              </div>
              <div xs="9" class="col"><h6 class="m-0">TOTAL BALANCE</h6>
                <p class="h2 m-0 fw-normal">$ {{totalBalance}}</p>
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
      <b-col xs="12">
        <div v-for="account in accounts">
        <Widget title="" settings customHeader>
            <h5><span class='glyphicon glyphicon-tags'>&nbsp;</span>
            <span class='fw-semi-bold'>{{ account.displayName }}</span></h5>
            <h6><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class='fw-semi-bold '>{{ account.maskedNumber }}</span></h6>
            <div v-for="balance in balances">
              <div v-if="account.accountId == balance.accountId" class="stats-item float-right"><div class="stat-item"><h6 class="name fs-sm">Available Balance</h6><p class="value">$ {{ balance.deposit.availableBalance.amount }}</p></div>
              <div v-if="account.accountId == balance.accountId" class="stat-item float-right"><h6 class="name fs-sm">Balance</h6><p class="value">$ {{ balance.deposit.currentBalance.amount }}</p></div></div>
            </div>
          </Widget>
        </div>
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
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  components: { Widget },
  methods: {
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
    },
  },
  mounted() {
    this.initChart();
    this.$store.dispatch('loadAccountSummary');
    this.$store.dispatch('loadAccountBalances');
    
    window.addEventListener('resize', this.initChart);
  },
  computed: mapState([
    'accounts', 'balances', 'totalBalance', 'totalAvailableBalance'
  ])
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped />
