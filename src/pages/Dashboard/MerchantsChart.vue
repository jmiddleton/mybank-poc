<template>
  <section class="categoriesList">
    <div>
      <label ref="merchantsSidebar"/>
      <div v-for="merchant in slidebarData" :key="merchant.id" class="categoryItem sidebarAlert">
        <span class="float-right">
          <strong>$ {{merchant.total}}</strong>
        </span>
        <small>{{merchant.title}}</small>
        <div class="sidebarProgress progress-md">
          <b-progress :variant="merchant.color" :value="merchant.total" :max="maxvalue"/>
          <small>{{merchant.footer}}</small>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";

const mformat = "YYYY-MM";

export default {
  name: "MerchantsChart",
  props: ["currentMonth"],
  data() {
    return {
      slidebarData: []
    };
  },
  methods: {
    generateSlidebarData() {
      this.slidebarData = [];

      if (!this.$refs.merchantsSidebar) {
        return;
      }

      this.$refs.merchantsSidebar.innerText = "";
      if (!this.merchants) {
        return this.slidebarData;
      }

      for (let i = 0; i < this.merchants.length; i++) {
        const merchant = this.merchants[i];

        if (!moment(merchant.month, mformat).isSame(this.currentMonth)) {
          continue;
        }

        const value = Math.abs(merchant.totalSpent);
        var serie = {
          id: i,
          title: merchant.merchantName,
          total: value,
          footer: merchant.totalOfTrans + " transactions",
          color: "info"
        };

        if (this.maxvalue < value) {
          this.maxvalue = value + value * 0.8;
        }

        this.slidebarData.push(serie);
      }

      if (this.slidebarData.length === 0) {
        this.$refs.merchantsSidebar.innerText = "No data found";
      } else {
        this.$refs.merchantsSidebar.innerText = "";
      }
    },
    loadMerchants(month) {
      const query = {
        month: month,
        monthsToPrefetch: 0
      };
      this.$store.dispatch("analytics/loadMerchants", query);
    }
  },
  mounted() {
    this.loadMerchants(moment().format(mformat));
  },
  computed: {
    ...mapState("analytics", ["merchants"])
  },
  watch: {
    currentMonth(newValue) {
      this.loadMerchants(newValue);
    },
    merchants(newValue) {
      this.generateSlidebarData();
    }
  }
};
</script>
