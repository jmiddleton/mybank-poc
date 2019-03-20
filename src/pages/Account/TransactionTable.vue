<template>
  <div class="table-responsive">
    <table v-if="transactions && transactions.length > 0" class="table table-hover center">
      <thead>
        <tr>
          <td>category</td>
          <td>date</td>
          <td>description</td>
          <td>amount</td>
        </tr>
      </thead>
      <tr :key="props.transactionId" v-for="props in transactions">
        <td class="type-width">
          <span class="notificationIcon thumb-sm">
            <img
              v-if="props.merchantCategoryCode && props.merchantCategoryCode !== 'null'"
              :src="require('../../assets/merchant-category/' + props.merchantCategoryCode + '.png')"
              alt="..."
            >
            <img
              v-else
              :src="require('../../assets/merchant-category/undefined.png')"
            >
          </span>
        </td>
        <td class="date-width">
          <p>
            <span class>{{props.valueDateTime | date('DD MMM YYYY')}}</span>
          </p>
        </td>
        <td class="description-left">
          <p class="mb-0">
            <span v-if="props.status === 'PENDING'" class="badge badge-warning badge-pill">Pending</span>&nbsp;
            <span>{{props.description}} - {{props.merchantName}}</span>
          </p>
          <p>
            <small>
              <span class="fw-semi-bold">Ref:</span>
              <span>&nbsp; {{props.reference}}</span>
              <span v-if="props.postingDateTime" >&nbsp;|&nbsp;Date: {{props.postingDateTime | date('DD/MM/YYYY')}}</span>
            </small>
          </p>
        </td>
        <td>
          <span class="float-right">$ {{props.amount}}</span>
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
      v-on:click="getTransactionsByAccountId()"
      v-cloak
    >Load More...</button>
    <span v-else class="center text-danger">
      <h5>{{ message }}</h5>
    </span>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import axios from "axios";
import { mapState, mapGetters } from "vuex";

export default {
  name: "TransactionTable",
  components: { Widget },
  data() {
    return {
      accountId: ""
    };
  },
  methods: {
    getTransactionsByAccountId() {
      this.$store.dispatch("transactions/loadTransactionsByAccountId", {
        accountId: this.accountId,
        firstPage: false
      });
    }
  },
  created() {
    this.accountId = this.$route.params.accountId;
    if (this.accountId !== undefined || this.accountId !== "") {
      this.$store.dispatch("transactions/loadTransactionsByAccountId", {
        accountId: this.accountId,
        firstPage: true
      });
    }
  },
  computed: mapState("transactions", ["transactions", "message", "nextkey"])
};
</script>

<style src="./AccountDetails.scss" lang="scss" scoped />