<template>
  <div>
    <h1 class="page-title">
      Manage Payees
      <a
        href="#"
        @click="showModal"
        class="float-right btn-md btn btn-outline-primary"
      >
        <i class="la la-refresh mr-2"/>Sync Payees
      </a>
    </h1>
    <Widget title customHeader>
      <payee-filter-bar></payee-filter-bar>
      <div id="checkboxes">
        <div v-for="(stack,index) in banks" :key="index" class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="stack.checked"
            v-on:change="onFilterBank"
          >
          <label class="form-check-label">{{ stack.value }}</label>
        </div>
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
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger"; // eslint-disable-line
import PayeeFilterBar from "./PayeeFilterBar.vue";
import SyncPayees from "./SyncPayees";
import PayeeCard from "./PayeeCard";

import _ from "lodash";
import axios from "axios";
import { mapState } from "vuex";

const { Messenger } = window;
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
      perPage: 12,
      totalNumberOfPages: 1000000,
      page: 1,
      payeesList: [],
      filteredPayeesList: [],
      displayPayeesList: [],
      banks: [
        {
          checked: false,
          value: "cba"
        }
      ]
    };
  },
  methods: {
    showModal() {
      this.$refs.syncPayeesModal.show = true;
    },
    onFilterBank() {
      //TODO: return payees only for the selected banks
      this.displayPayeesList = _.filter(this.payeesList, function() {
        return true;
      });
    },
    onFilterSet(filterText) {
      this.searchFor = filterText;

      // the text should be case insensitive
      let txt = new RegExp(this.searchFor, "i");

      // search on name, description
      this.filteredPayeesList = _.filter(this.payeesList, function(item) {
        return (
          item.nickname.search(txt) >= 0 || item.description.search(txt) >= 0
        );
      });
      this.page = 1;
      this.totalNumberOfPages = Math.ceil(this.filteredPayeesList.length / this.perPage);
      this.displayPayeesList = this.paginate(this.filteredPayeesList);
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
          this.displayPayeesList = this.paginate(this.payeesList);
          this.totalNumberOfPages = Math.ceil(payees.length / this.perPage);
        })
        .catch(function() {});
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
      Messenger().post({
        message: value.nickname + " was deleted successfully!!!",
        type: "success",
        showCloseButton: true
      });
      this.init();
    }
  }
};
</script>

<style src="./Payees.scss" lang="scss" scoped />
