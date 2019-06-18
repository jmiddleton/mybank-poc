<template>
  <div class="card p-1">
    <span class="badge fw-thin rounded-0" style="position: absolute; top: 0px; left: 0px;">
      <img
        v-if="payee.institution"
        class="thumb-xs"
        :src="require('../../assets/banks/'+payee.institution+'.png')"
      >
    </span>
    <div style="position: absolute; top: 0px; right: 5px;">
      <a class="text-secondary" @click="editRow(payee)">
        <span class="glyphicon glyphicon-edit"></span>
      </a>&nbsp;
      <a class="text-secondary" @click="deleteRow(payee)">
        <span class="glyphicon glyphicon-trash"></span>
      </a>
    </div>
    <div class="text-center">
      <img
        v-if="payee.type === 'DOMESTIC'"
        class="icon-size thumb-sm"
        :src="require('../../assets/banks/payee.png')"
      >
      <img
        v-if="payee.type === 'BILLER'"
        class="icon-size thumb-md"
        :src="require('../../assets/banks/bpay.png')"
      >
      <img
        v-if="payee.type === 'INTERNATIONAL'"
        class="icon-size thumb-sm"
        :src="require('../../assets/banks/international.png')"
      >
      <div>
        <h5 class="card-title">{{ payee.nickname | capitalize }}</h5>
        <p>{{ payee.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    deleteRow(data) {
      if (confirm("Are you sure you want to delete the record?")) {
        this.$store.dispatch("payees/deletePayee", data);
      }
    },
    editRow(data) {
      this.$router.push({ path: "/app/payees/" + data.payeeId });
    }
  },
  filters: {
    // this filter will can be used to capitalise words
    capitalize: payee => {
      return payee.toUpperCase();
    }
  },
  props: {
    payee: {
      type: Object,
      required: true
    }
  }
};
</script>
<style src="./Payees.scss" lang="scss" scoped />