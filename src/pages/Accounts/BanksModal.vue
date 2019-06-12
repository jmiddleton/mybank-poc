
<template>
  <!-- Modal Component -->
  <b-modal id="modal-scrollable" scrollable title="Connect to a Bank" v-model="show">
    <form-wizard color="#9b59b6" stepSize="xs" title subtitle>
      <tab-content title="1. Introduction" icon="glyphicon glyphicon-user">
        <ul class="timeline">
          <li>
            <span class="eventIcon">
              <img
                :src="require('../../assets/avatar.png')"
                alt="..."
                class="notificationIcon thumb-sm rounded-circle"
              >
            </span>
            <section class="event">
              <h5>Access your data</h5>
              <p
                class="fs-mini"
              >To be able to process and analyse your data first we need your consent to retrieve it from your bank.</p>
            </section>
          </li>
          <li>
            <span class="eventIcon">
              <img
                :src="require('../../assets/avatar.png')"
                alt="..."
                class="notificationIcon thumb-sm rounded-circle"
              >
            </span>
            <section class="event">
              <h5>Retrieve data</h5>
              <p
                class="fs-mini"
              >After consent, your bank will give us access to retrieve accounts, balance, payees, direct debit, upcoming payments and transaction details</p>
            </section>
          </li>
          <li>
            <span class="eventIcon">
              <img
                :src="require('../../assets/avatar.png')"
                alt="..."
                class="notificationIcon thumb-sm rounded-circle"
              >
            </span>
            <section class="event">
              <h5>Visualise your data</h5>
              <p
                class="fs-mini"
              >Once the information is in MyBank, you will be able to visualise and analyse your spendings, cashflow and savings accross all your bank accounts.</p>
            </section>
          </li>
        </ul>
      </tab-content>
      <tab-content title="2. Account Consent" icon="glyphicon glyphicon-check">
        <p
          class="fs-mini"
        >Ok, now we need your consent to access the following data, please select as much as you can, the more you consent, the more accurate will be your financial status.</p>

        <b-form-group class="abc-checkbox">
          <input type="checkbox" id="checkbox-default">
          <label for="checkbox-default">Account Details and Balances</label>
        </b-form-group>
        <b-form-group class="abc-checkbox">
          <input type="checkbox" id="checkbox-txn">
          <label for="checkbox-txn">Transactions</label>
        </b-form-group>
        <b-form-group class="abc-checkbox">
          <input type="checkbox" id="checkbox-dd">
          <label for="checkbox-dd">Direct Debits and Upcoming Payments</label>
        </b-form-group>
      </tab-content>
      <tab-content title="3. Connect to a Bank" icon="glyphicon glyphicon-link">
        <div class="widgetBody widget-body p-0">
          Select from the list the bank you would like to sync with MyBank.
          The page will be redirected to your bank to complete the consent process.
          <div v-if="banks && banks.length > 0" class="list-group-item list-group list-group-lg">
            <a
              href="#"
              @click="authorise(bank)"
              class="list-group-item"
              v-for="bank in banks"
              :key="bank.code"
            >
              <span class="notificationIcon thumb-sm">
                <img
                  :src="require('../../assets/banks/' + bank.logo_url)"
                  alt="..."
                  class="rounded-circle"
                >
              </span>
              <div>
                <h6 class="m-0">{{bank.name}}</h6>
                <small class="text-muted">{{bank.url}}</small>
              </div>
            </a>
          </div>
          <div v-else>
            <span>
              <i class="la la-refresh la-spin"/> Loading list of banks...
            </span>
          </div>
        </div>
      </tab-content>
      <button class="btn btn-md btn-info" slot="next">Continue</button>
      <button class="btn btn-md btn-info" slot="prev">Previous</button>
      <button class="btn btn-md btn-info" slot="finish">Finish</button>
    </form-wizard>
    <div slot="modal-footer"></div>
  </b-modal>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

export default {
  name: "BanksModal",
  components: {
    FormWizard,
    TabContent
  },
  data() {
    return {
      show: false,
      banks: [],
      progress: 1
    };
  },
  updateProgress(prevIndex, nextIndex) {
    if (nextIndex >= 0) {
      Vue.set(this, "progress", nextIndex + 1);
    }
  },
  methods: {
    authorise(bank) {
      Vue.prototype.$auth.authorise("/app/accounts", "/link-accounts", bank);
    }
  },
  watch: {
    show() {
      //TODO: move to a state
      axios
        .get("/banks")
        .then(r => r.data)
        .then(banks => {
          this.banks = banks;
        });
    }
  }
};
</script>

<style src="./Accounts.scss" lang="scss" scoped />