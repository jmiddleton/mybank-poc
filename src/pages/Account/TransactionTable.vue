<template>
  <div class="table-responsive">
    <h4>Transaction History</h4>
    <table v-if="transactions && transactions.length > 0" 
      class="table table-striped table-lg mt-lg mb-0">
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
                  <img :src="require('../../assets/categories/' + txn.category + '.png')" alt="...">
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
            <span class>{{txn.valueDateTime | date('DD MMM YYYY')}}</span>
          </p>
        </td>
        <td class="description-left">
          <p class="mb-0">
            <span v-if="txn.status === 'PENDING'" class="badge badge-warning badge-pill">Pending</span>&nbsp;
            <span>{{txn.description}} - {{txn.merchantName}}</span>
          </p>
          <p>
            <small>
              <span class="fw-semi-bold">Ref:</span>
              <span>&nbsp; {{txn.reference}}</span>
              <span
                v-if="txn.postingDateTime"
              >&nbsp;|&nbsp;Date: {{txn.postingDateTime | date('DD/MM/YYYY')}}</span>
            </small>
          </p>
        </td>
        <td>
          <span class="float-right">$ {{txn.amount}}</span>
        </td>
      </tr>
    </table>
    <span v-else class="center">
      <h5>Transactions not available</h5>
    </span>

    <button
      :disabled="!nextkey || nextkey === ''"
      v-if="nextkey && nextkey.length > 0"
      class="width-250 btn btn-outline-primary"
      v-on:click="getTransactionsByAccountId(false)"
    >Load More...</button>
    <span v-else class="center text-danger">
      <h5>{{ message }}</h5>
    </span>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import { mapState } from "vuex";

export default {
  name: "TransactionTable",
  components: { Widget },
  data() {
    return {
      accountId: ""
    };
  },
  methods: {
    getTransactionsByAccountId(isFirstPage) {
      this.$store.dispatch("transactions/loadTransactionsByAccountId", {
        accountId: this.accountId,
        firstPage: isFirstPage
      });
    },
    changeCategory(txn, code) {
      txn.category = code;
      this.$store.dispatch("transactions/changeCategory", txn);
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
    "nextkey",
    "categories"
  ])
};
</script>

<style src="./AccountDetails.scss" lang="scss" scoped />