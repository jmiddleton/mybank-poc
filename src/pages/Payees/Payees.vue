<template>
  <div>
    <b-alert
      v-if="message"
      class="alert-transparent"
      show
      dismissible
      :variant="messageVariant"
    >{{message}}</b-alert>
    <h2 class="page-title">
      My Payees
      <a href="#" @click="showModal" class="float-right btn-md btn btn-outline-primary">
        <i class="la la-refresh mr-2"/>Sync Payees
      </a>
    </h2>
    <Widget title customHeader>
      <payee-filter-bar/>
      <div id="checkboxes">
        <div v-for="bank in banksFilter" :key="bank.value" class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="bank.checked"
            v-on:change="onFilterBank"
          >
          <label class="form-check-label">
            <img
              v-if="bank.value !== 'undefined'"
              class="thumb-xs"
              :src="require('../../assets/banks/'+bank.value+'.png')"
            >
            {{ bank.value }}
          </label>
        </div>
        <b-button-group class="float-right">
          <b-button variant="gray">
            <i class="fa fa-th-list"/>
          </b-button>
          <b-button variant="gray" class="active">
            <i class="fa fa-th-large"/>
          </b-button>
        </b-button-group>
      </div>&nbsp;
      <div class="card-columns">
        <payee-card v-for="(payee, index) in displayPayeesList" :key="index" :payee="payee"></payee-card>
      </div>
      <button
        v-if="page < totalNumberOfPages"
        type="button"
        @click="page++"
        class="btn btn-sm btn-outline-primary"
      >Load more...</button>
      <span class="float-right">Total records: {{filteredPayeesList.length}}</span>
      <!-- <span v-else>No more data found</span> -->
    </Widget>
    <SyncPayees ref="syncPayeesModal"/>
  </div>
</template>

<script>
import Vue from "vue";
import VueEvents from "vue-events";
import Widget from "@/components/Widget/Widget";
import "imports-loader?jQuery=jquery,this=>window!jquery-sparkline"; // eslint-disable-line
import PayeeFilterBar from "./PayeeFilterBar.vue";
import SyncPayees from "./SyncPayees";
import PayeeCard from "./PayeeCard";

import _ from "lodash";
import axios from "axios";
import { mapState } from "vuex";

Vue.use(VueEvents);

export default {
  name: "Payees",
  components: {
    Widget,
    PayeeFilterBar,
    SyncPayees,
    "payee-card": PayeeCard
  },
  data() {
    return {
      perPage: 24,
      totalNumberOfPages: 1000000,
      page: 1,
      payeesList: [],
      filteredPayeesList: [],
      displayPayeesList: [],
      banksFilter: [],
      searchFor: undefined,
      type: undefined,
      message: "",
      messageVariant: ""
    };
  },
  methods: {
    showModal() {
      this.$refs.syncPayeesModal.show = true;
    },
    onFilterBank() {
      this.filter();
    },
    onFilterSet(filterText) {
      this.searchFor = filterText;
      this.filter();
    },
    onFilterByType(type) {
      this.type = type;
      this.filter();
    },
    filter() {
      const banks = this.banksFilter;
      const isFilteredByBank = _.find(banks, ["checked", true]) != undefined;
      this.filteredPayeesList = this.payeesList;

      if (isFilteredByBank) {
        this.filteredPayeesList = _.filter(this.payeesList, function(payee) {
          return (
            _.find(banks, function(o) {
              return o.value === payee.institution && o.checked;
            }) !== undefined
          );
        });
      }

      if (this.searchFor) {
        // the text should be case insensitive
        let txt = new RegExp(this.searchFor, "i");
        this.filteredPayeesList = _.filter(this.filteredPayeesList, function(
          item
        ) {
          return (
            item.nickname.search(txt) >= 0 || item.description.search(txt) >= 0
          );
        });
      }

      if (this.type) {
        const stype = this.type;
        this.filteredPayeesList = _.filter(this.filteredPayeesList, function(
          item
        ) {
          return item.type === stype;
        });
      }

      this.initDisplayList(this.filteredPayeesList);
    },
    onDeleteItem() {
      this.init();
    },
    init() {
      axios
        .get("/payees")
        .then(r => r.data)
        .then(payees => {
          this.payeesList = payees;
          this.filteredPayeesList = payees;
          this.initDisplayList(payees);
          this.initBankSelects(payees);
        })
        .catch(function() {});
    },
    initDisplayList(payees) {
      this.page = 1;
      this.totalNumberOfPages = Math.ceil(payees.length / this.perPage);
      this.displayPayeesList = this.paginate(payees);
    },
    initBankSelects(payees) {
      let filter = _.chain(payees)
        .groupBy("institution")
        .keys()
        .value();

      filter.forEach(s => {
        this.banksFilter.slice(0, 0);
        this.banksFilter.push({ checked: false, value: s });
      });
    },
    handleNetworkError(msg) {
      this.message = msg.message;
      this.messageVariant = msg.variant;
    },
    paginate(list) {
      if (this.page > this.totalNumberOfPages) {
        return;
      }
      let page = this.page;
      let perPage = this.perPage;
      let to = page * perPage;

      return list.slice(0, to);
    }
  },
  created() {
    this.init();
  },
  mounted() {
    //TODO: get payees from store this.$store.dispatch('payees/loadPayees');
    this.$events.$on("filter-set", eventData => this.onFilterSet(eventData));
    this.$events.$on("filter-by-type", eventData =>
      this.onFilterByType(eventData)
    );
    this.$events.$on("delete-item", eventData => this.onDeleteItem(eventData));
  },
  computed: {
    ...mapState("payees", ["deletedpayee"])
  },
  watch: {
    page() {
      this.displayPayeesList = this.paginate(this.filteredPayeesList);
    },
    deletedpayee(value) {
      this.$notify({
        group: "payees",
        type: "success",
        title: "Payee",
        text: value.nickname + " was deleted successfully!!!"
      });
      this.init();
    }
  }
};
</script>

<style src="./Payees.scss" lang="scss" scoped />
