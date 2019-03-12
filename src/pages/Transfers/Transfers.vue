<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>
        <span class="fi flaticon-home"></span>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Transfer and Payments</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title">Transfer and Payments</h1>
    <b-row>
      <b-col xs="12" md="6">
        <Widget title>
          <b-container>
            <b-row class="mb-4">
              <b-col cols="2">
                <h6>From Account</h6>
              </b-col>
              <b-col cols="10">
                <v-select
                  label="label"
                  v-model="selectedFromAccount"
                  :options="accountList"
                  @change="changedFromAccount"
                >
                  <template slot="option" slot-scope="option">
                    <span>
                      <img
                        class="thumb-sm"
                        :src="require('../../assets/banks/' + option.imgName + '.png')"
                      >
                      {{option.label}}
                    </span>
                  </template>
                </v-select>
              </b-col>
            </b-row>
            <b-row class="mb-4">
              <b-col cols="2">
                <h6>To Account</h6>
              </b-col>
              <b-col cols="10">
                <v-select label="label" max-height="220px" v-model="selectedToAccount" :options="toAccountList">
                  <template slot="option" slot-scope="option">
                    <span>
                      <img
                        class="thumb-sm"
                        :src="require('../../assets/banks/' + option.imgName + '.png')"
                      >
                      {{option.label}}
                    </span>
                  </template>
                </v-select>
              </b-col>
            </b-row>
            <b-row class="mb-4">
              <b-col cols="4">
                <h6>Amount</h6>
              </b-col>
              <b-col cols="8">
                <b-input-group prepend="$" append=".00">
                  <b-form-input/>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="mb-4">
              <b-col cols="4">
                <h6>Date</h6>
              </b-col>
              <b-col cols="8">
                <date-picker width="100%" v-model="transferDate" lang="en" :not-before="new Date()"></date-picker>
              </b-col>
            </b-row>
            <b-row class="mb-4">
              <b-col cols="4">
                <h6>Reference</h6>
              </b-col>
              <b-col cols="8">
                <b-form-textarea
                  id="textarea"
                  placeholder="Enter something..."
                  rows="2"
                  max-rows="2"
                />
              </b-col>
            </b-row>
            <b-row class="mb-4">
              <b-col cols="4"></b-col>
              <b-col cols="8">
                <b-button variant="success" class="mr-xs" size="sm" v-on:click="submit()">Transfer</b-button>
                <b-button variant="danger" class="mr-xs" size="sm" v-on:click="cancel()">Cancel</b-button>
              </b-col>
            </b-row>
          </b-container>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import Vue from "vue";
import VueEvents from "vue-events";
import vSelect from "vue-select";
import DatePicker from "vue2-datepicker";

import { mapState, mapGetters } from "vuex";
const { Messenger } = window;

Vue.use(VueEvents);

export default {
  components: {
    Widget,
    "v-select": vSelect,
    DatePicker
  },
  data() {
    return {
      selectedFromAccount: {},
      selectedToAccount: {},
      toAccountList: [],
      transferDate: ""
    };
  },
  created() {
    this.$store.dispatch("accounts/loadAccountSummary");
    this.$store.dispatch("accounts/loadAccountBalances");
    this.$store.dispatch("payees/loadPayees");
  },
  mounted() {
    let fromAccountId = this.$route.params.accountId;

    this.selectedFromAccount = _.find(
      this.accountList, function(acc) {
        return fromAccountId === undefined || acc.accountId === fromAccountId;
      });

    this.loadToAccountList(fromAccountId);
  },
  methods: {
    changedFromAccount(eventData) {
      var filterAccount = "";
      this.loadToAccountList(eventData.accountId);
    },
    loadToAccountList(fromAccountId) {
      //get accounts which are allowed to transfer money.
      this.toAccountList = _.filter(this.accountList, function(acc) {
        return fromAccountId === undefined || acc.accountId !== fromAccountId;
      });
      
      //add payees - TODO: optimise this
      this.toAccountList = _.concat(this.toAccountList, this.selectPayeeList);
    }
  },
  computed: {
    accountList() {
      return _.map(this.accountsList, function(account) {
        return {
          label: account.displayName + " - " + account.maskedNumber,
          accountId: account.accountId,
          isPayee: false,
          imgName: account.institution
        };
      });
    },
    selectPayeeList() {
      return _.map(this.$store.getters["payees/getPayees"].data, function(payee) {
        return {
          label: payee.name + " - " + payee.BSB + " " + payee.accountNumber,
          accountId: payee.payeeId,
          isPayee: true,
          imgName: "payee"
        };
      });
    },
    ...mapGetters("accounts", ["accountsList", "balances"])
  }
};
</script>

<style src="./Transfers.scss" lang="scss" scoped />