<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item><span class="fi flaticon-home"></span></b-breadcrumb-item>
      <b-breadcrumb-item>Accounts</b-breadcrumb-item>
      <b-breadcrumb-item active>Account Details</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <div class="pb-xlg h-100">
          <div class="widgetBody widget-body">
            <div class="widget-title widget-top widget-padding-md clearfix bg-primary text-white">
              <a href="#" class="float-right btn-transfer btn btn-outline btn-sm mb-2">
                <i class="fa fa-edit mr-2"></i>
                Make a Transfer
              </a>
              <h1>{{account.displayName}}</h1>
              <h3>{{account.maskedNumber}}</h3>
              <span class="badge badge-success badge-pill">{{account.openStatus}}</span>
              <h5>
                <div class="profileStat stat-item float-right stats-row mt-3">
                  <div class="profileStat stat-item">
                    <p class="profileStatValue value text-right">$</p>
                    <h6 class="name">Available Balance</h6>
                  </div>
                  <div class="profileStat stat-item">
                    <p class="profileStatValue value text-right">$</p>
                    <h6 class="name text-right">Balance</h6>
                  </div>
                </div>
              </h5>
            </div>
            <div class="row">
              <div xs="12" class="col-md-5">
                <div class="profileContactContainer">
                  <span class="thumb-xl mb-3" v-if="account !== undefined">
                    <img
                      :src="require('../../assets/banks/' + account.institution + '.png')"
                      alt="..."
                      class="profileAvatar rounded-circle"
                    >
                  </span>
                  
                  <div v-if="account.depositRates" class="stats-row col-md-12" xs="12">
                    <div
                      v-for="rate in account.depositRates"
                      :key="rate.depositRateType"
                      class="profileStat stat-item">
                      <p class="profileStatValue value text-right">{{rate.rate}}%</p>
                      <h6 class="name">{{rate.depositRateType}}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <p class="lead mt-xlg">Transactions</p>
              
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import { mapState, mapGetters } from "vuex";
const { Messenger } = window;

export default {
  components: {
    Widget
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
    }
  },
  methods: {},
  computed: mapGetters("accounts", ["account"])
};
</script>
<style src="./AccountDetails.scss" lang="scss" scoped />