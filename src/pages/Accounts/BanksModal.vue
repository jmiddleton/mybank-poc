
<template>
  <!-- Modal Component -->
  <b-modal id="modal-scrollable" title="Consent Request" v-model="show">
    <form-wizard color="#547fff" stepSize="xs" title subtitle>
      <tab-content title="1. Introduction" icon="glyphicon glyphicon-user">
        <p>This consent request will guide you to securely allow MyBank to access your bank accounts. The process includes the following steps:</p>
        <ul class="news-list stretchable">
          <li>
            <span class="icon bg-secondary text-white">
              <i class="glyphicon glyphicon-user"></i>
            </span>
            <div class="news-item-info">
              <h5 class="name m-0 mb-xs">Consent Request</h5>
              <p
                class="fs-mini"
              >To be able to process and analyse your account details, MyBank first needs your consent to securely and reliable access your bank.</p>
            </div>
          </li>
          <li>
            <span class="icon bg-secondary text-white">
              <i class="glyphicon glyphicon-retweet"></i>
            </span>
            <div class="news-item-info">
              <h5 class="name m-0 mb-xs">Retrieve Accounts</h5>
              <p
                class="fs-mini"
              >Once Consent is accepted, your bank will give us access to retrieve accounts, balance, payees, direct debit, upcoming payments and transaction details.</p>
            </div>
          </li>
          <li>
            <span class="icon bg-secondary text-white">
              <i class="fa fa-bar-chart-o"></i>
            </span>
            <div class="news-item-info">
              <h5 class="name m-0 mb-xs">Visualise your data</h5>
              <p class="fs-mini">
                The information will be processed and make it available for you to easily visualise
                all your accounts in one place.
                Different charts will show you spendings by categories, cashflow and savings.
              </p>
            </div>
          </li>
        </ul>
      </tab-content>
      <tab-content title="2. Consent" icon="glyphicon glyphicon-check">
        <p class="fs-mini">
          Ok, now we need your consent to access the following data.
          Please read carefully each section.
          The more you consent, the more accurate will be your financial view.
        </p>
        <div class="scrolledList">
          <div
            v-for="(element, index) in accordionFirstContent"
            class="panel mb-xs"
            :key="`accord-one-${index.toString()}`"
          >
            <div
              class="card-header panel-header bg-light"
              role="button"
              @click="toggleAccordion('accordionFirst', index)"
            >
              <div>
                <a class="accordion-toggle" role="button">
                  {{element.title}}
                  <i
                    :class="`fa fa-angle-down ${accordionFirst[index] ? 'expanded' : ''}`"
                  />
                </a>
              </div>
            </div>
            <b-collapse id="accordion-first" class="panel-body" :visible="accordionFirst === index">
              <div class="card-body" v-html="element.body"/>
            </b-collapse>
          </div>
        </div>

        <p class="fs-mini">
          You will give MyBank access to your accounts for:
          <select v-model="duration">
            <option value="12">12 Month</option>
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
          </select>
        </p>
      </tab-content>
      <tab-content title="3. Connect to a Bank" icon="glyphicon glyphicon-link">
        <div class="widgetBody widget-body p-0">
          Select from the list the bank you would like to synchronise.
          The page will be redirected to your bank to complete the authorisation process.
          <div class="bankList">
            <div v-if="banks && banks.length > 0" class="list-group-item list-group list-group-xs">
              <a
                href="#"
                @click="selectBank(bank)"
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

                  <span
                    v-if="selectedBank && bank.code == selectedBank.code"
                    class="text-success float-right"
                  >
                    <i class="glyphicon glyphicon-ok"></i>
                  </span>
                </div>
              </a>
            </div>
            <div v-else>
              <span>
                <i class="la la-refresh la-spin"/> Loading list of banks...
              </span>
            </div>
          </div>
        </div>
      </tab-content>
      <button class="btn btn-md btn-outline-primary" slot="next">Continue</button>
      <button class="btn btn-md btn-outline-primary" slot="prev">Previous</button>
      <button class="btn btn-md btn-outline-primary" slot="finish" @click="authorise()">Finish</button>
    </form-wizard>
    <div slot="modal-footer"></div>
  </b-modal>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
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
      selectedBank: undefined,
      duration: 12,
      progress: 1,
      accordionFirst: -1,
      accordionFirstContent: [
        {
          title: "Customer Information",
          body: `<p>
          <b-form-group class="abc-checkbox abc-checkbox-success">
            <input type="checkbox" id="chk_1" value="common_basic_customer">
            <label for="chk_1">Customer details</label> that identifies the customer and any persons authorised to act on the consumer’s account and will include, at a minimum:
               <li>The customer’s name, which may include a business name and number(s) (such as ABN, ACN)</li>
               <li>The customer’s contact details, which may include phone numbers, email addresses, and physical addresses.</li>
          </b-form-group>
          </p>`
        },
        {
          title: "Account Details",
          body: `<p>
          <b-form-group class="abc-checkbox abc-checkbox-success">
            <input type="checkbox" id="chk_2" checked value="bank_basic_accounts">
            <label for="chk_2">Basic information</label> identifying the account, including the account number, and account name(s). 
            The balance for the account(s), including current balance and available funds.
          </b-form-group>
          </p>
          <p>
          <b-form-group class="abc-checkbox abc-checkbox-success">
            <input type="checkbox" id="chk_3" value="bank_detailed_accounts">
            <label for="chk_3">Detailed information</label> of the customer’s accounts and balances.
          </b-form-group>
          </p>`
        },
        {
          title: "Transaction",
          body: `<p>
              <b-form-group class="abc-checkbox abc-checkbox-success">
                <input type="checkbox" id="chk_4" value="bank_transactions"/>
                <label for="chk_4">Access transaction data</label> for accounts including:
                <li>The date on which the transaction occurred</li>
                <li>The amount debited or credited pursuant to a transaction</li>
                <li>Any description of the transaction</li>
                <li>Descriptive categorisation of the transaction</li>
              </b-form-group>
              </p>`
        },
        {
          title: "Upcoming Payments & Direct Debits",
          body: `<p>
            <b-form-group class="abc-checkbox abc-checkbox-success">
              <input type="checkbox" id="chk_5" value="bank_regular_payments" />
              <label for="chk_5">Scheduled payments</label>
                , which may include regular payments, payments to billers, international payments.
                 Direct debit deductions, which will include, to the extent available:
              <li>Identifying information for the merchant/party making the debit</li>
              <li>The amount debited</li>
              <li>The date of the transaction</li>
            </b-form-group>         
            </p>`
        }
      ]
    };
  },
  updateProgress(prevIndex, nextIndex) {
    if (nextIndex >= 0) {
      Vue.set(this, "progress", nextIndex + 1);
    }
  },
  methods: {
    selectBank(bank) {
      this.selectedBank = bank;
    },
    authorise() {
      let foundOne = false;
      let scopes = [];

      for (var i = 1; i < 6; i++) {
        let checked = $("#chk_" + i).is(":checked");
        if (checked) {
          foundOne = true;
          scopes.push($("#chk_" + i).val());
        }
      }

      if (!foundOne) {
        window.alert("At least one consent is required to access your bank.");
        return;
      }
      if (!this.selectedBank) {
        window.alert("Please select the bank you want to access.");
        return;
      }

      Vue.prototype.$auth.authorise(
        "/app/accounts",
        "/link-accounts",
        this.selectedBank,
        undefined,
        scopes,
        this.duration
      );
    },
    toggleAccordion(field, index) {
      if (this[field] !== index) {
        Vue.set(this, field, index);
      } else {
        Vue.set(this, field, -1);
      }
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