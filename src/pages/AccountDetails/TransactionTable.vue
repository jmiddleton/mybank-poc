<template>
  <div>
    <h4>
      Transaction History
      <div class="float-right">
        <b-dropdown
          :text="filter.category !== '' ? filter.category : 'All categories'"
          variant="outline-primary"
          class="m-1"
        >
          <b-dropdown-item @click="setCategoryFilter('')">
            <span class="category thumb-sm">...</span>
            All categories
          </b-dropdown-item>
          <b-dropdown-item
            @click="setCategoryFilter(cat.code)"
            :key="cat.code"
            v-for="cat in categories"
          >
            <span class="category thumb-sm">
              <img :src="'/img/categories/' + cat.code + '.png'" alt="...">
            </span>
            {{cat.name}}
          </b-dropdown-item>
        </b-dropdown>
        <vue-monthly-picker
          @selected="handleSelect"
          class="outline-primary btn btn-md"
          dateFormat="YYYY-MM"
          clearable
          v-model="selectedMonth"
        ></vue-monthly-picker>

        <b-button class="btn-success btn-md" @click="searchTransactions()">Filter</b-button>
      </div>
    </h4>
    <table
      v-if="transactions && transactions.length > 0"
      class="table table-striped table-lg mt-lg mb-0"
    >
      <thead>
        <tr>
          <td>category</td>
          <td>date</td>
          <td>description</td>
          <td>amount</td>
        </tr>
      </thead>
      <tr :key="txn.transactionId" v-for="txn in transactions">
        <td class="type-width">
          <b-nav class="ml-auto">
            <b-nav-item-dropdown extra-menu-classes="fadeInUp" right>
              <template slot="button-content">
                <span class="category thumb-sm">
                  <img :src="'/img/categories/' + txn.category + '.png'" alt="...">
                </span>
              </template>
              <div class="categoriesDropDown">
                <b-dropdown-item
                  @click="changeCategory(txn, cat.code)"
                  :key="cat.code"
                  v-for="cat in categories"
                >
                  <span class="category thumb-sm">
                    <img :src="'/img/categories/' + cat.code + '.png'" alt="...">
                  </span>
                  {{cat.name}}
                </b-dropdown-item>
              </div>
            </b-nav-item-dropdown>
          </b-nav>
        </td>
        <td class="date-width">
          <p>
            <span v-if="txn.status === 'PENDING'">{{txn.valueDateTime | date('DD MMM YYYY')}}</span>
            <span v-if="txn.status === 'POSTED'">{{txn.postingDateTime | date('DD MMM YYYY')}}</span>
          </p>
        </td>
        <td class="description-left">
          <p class="mb-0">
            <span v-if="txn.status === 'PENDING'" class="badge badge-warning badge-pill">Pending</span>
            <span>{{txn.description}} - {{txn.merchantName}}</span>
          </p>
          <div>
            <small>
              <span class="fw-semi-bold">Ref:</span>
              {{txn.reference | truncate(20, '...')}}
            </small>
          </div>
        </td>
        <td>
          <span>${{txn.amount}}</span>
        </td>
      </tr>
    </table>
    <span v-else class="center">
      <h5>Transactions not available</h5>
    </span>

    <button
      :disabled="!filter.nextkey || filter.nextkey === ''"
      v-if="filter.nextkey && filter.nextkey.length > 0"
      class="width-250 btn btn-outline-primary"
      v-on:click="getTransactionsByAccountId(false)"
    >
      <span v-if="!isLoading">Load More...</span>
      <span v-else>
        <i class="la la-refresh la-spin"/> Loading...
      </span>
    </button>
    <span v-else class="center text-danger">
      <h5>{{ message }}</h5>
    </span>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import { mapState } from "vuex";
import VueMonthlyPicker from "vue-monthly-picker";

export default {
  name: "TransactionTable",
  components: { Widget, VueMonthlyPicker },
  data() {
    return {
      accountId: "",
      selectedMonth: ""
    };
  },
  methods: {
    getTransactionsByAccountId(isFirstPage) {
      this.filter.firstPage = isFirstPage;

      this.$store.dispatch(
        "transactions/loadTransactionsByAccountId",
        this.accountId
      );
    },
    changeCategory(txn, code) {
      txn.category = code;
      this.$store.dispatch("transactions/changeCategory", txn);
    },
    searchTransactions() {
      this.getTransactionsByAccountId(true);
    },
    setCategoryFilter(code) {
      this.filter.category = code;
    },
    handleSelect(value) {
      this.filter.month = value.format("YYYY-MM");
    }
  },
  created() {
    this.accountId = this.$route.params.accountId;
    if (this.accountId !== undefined || this.accountId !== "") {
      this.getTransactionsByAccountId(true);
    }
    this.$store.dispatch("transactions/getCategories");
  },
  computed: mapState("transactions", [
    "transactions",
    "message",
    "categories",
    "filter",
    "isLoading"
  ]),
  filters: {
    truncate: function(text, length, suffix) {
      if (text) {
        return text.substring(0, length) + suffix;
      }
      return "";
    }
  }
};
</script>

<style src="./AccountDetails.scss" lang="scss" scoped />