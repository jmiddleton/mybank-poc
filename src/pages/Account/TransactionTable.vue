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
              v-if="props.merchantCategoryCode"
              :src="require('../../assets/merchant-category/' + props.merchantCategoryCode + '.png')"
              alt="..."
            >
          </span>
        </td>
        <td class="date-width">
          <p>
            <span class>{{props.postingDateTime | date('DD MMM YYYY')}}</span>
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
              <span>&nbsp;|&nbsp;Value Date: {{props.valueDateTime | date('DD/MM/YYYY')}}</span>
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
      v-if="transactions && transactions.length > 0"
      class="width-150 btn btn-outline-primary"
      v-on:click="getTransactionsByAccountId()"
      v-cloak
    >{{ buttonText }}</button>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "TransactionTable",
  components: { Widget },
  data() {
    return {
      page: 0,
      transactions: [],
      buttonText: "Load more..."
    };
  },
  methods: {
    getTransactionsByAccountId() {
      axios
        .get("/accounts/" + this.accountId + "/transactions")
        .then(r => r.data)
        .then(txnResult => {
          if (txnResult.data) {
            var from = this.page * 10;
            var txns = txnResult.data.transactions.slice(from, from + 10);
            var len = txns.length;
            if (len > 0) {
              // Loop on data and push in transactions
              for (let i = 0; i < txns.length; i++) {
                this.transactions.push(txns[i]);
              }
              this.page++;
            } else {
              this.buttonText = "No more transactions";
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    this.accountId = this.$route.params.accountId;
    if (this.accountId !== undefined || this.accountId !== "") {
      this.getTransactionsByAccountId();
    }
  }
};
</script>

<style src="./AccountDetails.scss" lang="scss" scoped />