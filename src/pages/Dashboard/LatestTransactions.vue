<template>
  <Widget :title="'<h5>Latest Transactions</h5>'" customHeader collapse close>
    <p
      class="fs-mini text-muted"
    >Here's the list of your latest <strong>10</strong> transactions on accounts linked to MyBank. It helps you to identify which bank processed the transction.</p>

    <div class="categoriesList">
      <div
        :key="item.transactionId"
        v-for="item in latestTransactions"
        class="list-group-item list-group list-group-md"
      >
        <span class="notificationIcon thumb-xs">
          <img :src="'/img/categories/' + item.category + '.png'" alt="..." class="categoryIcon">
        </span>
        <p class="m-0 overflow-hidden">
          {{item.description}}
          <br>
          <span class="mr-1 float-right value6">$ {{item.amount}}</span>

          <span>
            <img
              class="thumb-xss bankIcon"
              :src="require('../../assets/banks/' + item.institution + '.png')"
              alt="..."
            >
            <small>{{item.postingDateTime | fromNow}}</small>
          </span>
        </p>
      </div>
    </div>
  </Widget>
</template>

<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";
import moment from "moment";
import { mapState } from "vuex";

const mformat = "YYYY-MM";

Vue.filter("fromNow", function(value) {
  if (value) {
    return moment(value).fromNow();
  }
});

export default {
  name: "LatestTransactions",
  components: {
    Widget
  },
  methods: {
    init() {
      this.$store.dispatch("transactions/loadLatestTransactions");
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState("transactions", ["latestTransactions"])
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>
