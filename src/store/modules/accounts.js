
import axios from 'axios';
import _ from "lodash";

const categoriesMap = new Map();
categoriesMap.set("TRANS_AND_SAVINGS_ACCOUNTS", "Saving Accounts");
categoriesMap.set("CRED_AND_CHRG_CARDS", "Credit Cards");
categoriesMap.set("TERM_DEPOSITS", "Term Deposits");
categoriesMap.set("PERS_LOANS", "Personal Loans");
categoriesMap.set("MARGIN_LOANS", "Margin Loans");
categoriesMap.set("TRAVEL_CARDS", "Travel Cards");
categoriesMap.set("REGULATED_TRUST_ACCOUNTS", "Trust Accounts");
categoriesMap.set("RESIDENTIAL_MORTGAGES", "Mortgages");
categoriesMap.set("LEASES", "Leases");
categoriesMap.set("TRADE_FINANCE", "Trades");

const state = {
  categories: categoriesMap,
  accounts: [],
  balances: [],
  scheduledPayments: [],
  directDebits: [],
  totals: new Map(),
  account: {},
  balance: 0,
  hasAccounts: undefined,
  isLoadingAccounts: false
}

const getters = {
  accountsByCategory: state => {
    var result = _.reduce(state.accounts, function (result, account) {
      const category = state.categories.get(account.productCategory);
      (result[category] || (result[category] = [])).push(account);
      return result;
    }, {});

    //TODO: sort accounts by categoriesMap
    // result = _.sortBy(result, function(a, b){
    //   state.categories.indexOf(a.key) - state.categories.indexOf(b.key);
    // });

    return result;
  },
  accountsList: state => {
    return state.accounts;
  }
}

const actions = {
  async loadAccountSummary({ commit }) {
    state.isLoadingAccounts = true;
    try {
      const response = await axios.get('/accounts');
      commit('SET_ACCOUNTS', response.data);
      state.isLoadingAccounts = false;
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        state.hasAccounts = false;
      }
    }
  },
  async getAccountById({ commit }, accountId) {
    try {
      const response = await axios.get('/accounts/' + accountId)
      commit('SET_ACCOUNT', response.data);
    } catch (error) {
      commit('SET_ACCOUNT');
    }
  },
  async loadAccountBalances({ commit }) {
    try {
      const response = await axios.get('/accounts/balances')
      commit('SET_BALANCES', response.data);
    } catch (error) {
      commit('SET_BALANCES');
    }
  },
  async loadScheduledPayments({ commit }) {
    try {
      const response = await axios.get('/payments')
      commit('SET_SCHEDULED_PAYMENTS', response.data);
    } catch (error) {
      commit('SET_SCHEDULED_PAYMENTS');
    }
  },
  async loadDirectDebits({ commit }) {
    try {
      const response = await axios.get('/direct-debits')
      commit('SET_DIRECT_DEBITS', response.data);
    } catch (error) {
      commit('SET_DIRECT_DEBITS');
    }
  }
};

const mutations = {
  SET_ACCOUNTS(state, response) {
    state.accounts = [];

    if (response && response.data) {
      state.accounts = response.data.accounts;
      if (state.accounts && state.accounts.length > 0) {
        state.hasAccounts = true;
      } else {
        state.hasAccounts = false;
      }
    } else {
      state.hasAccounts = false;
    }
  },
  SET_ACCOUNT(state, response) {
    state.account = [];
    if (response) {
      state.account = response.data;
    }
  },
  SET_BALANCES(state, response) {
    state.totals = new Map();

    if (response && response.data) {
      state.balances = response.data.balances;

      state.balances.forEach(balance => {
        let total = state.totals.get(balance.productCategory);
        if (!total) {
          total = {
            balance: 0,
            available: 0
          };
        }

        total.balance = Math.round(total.balance + parseFloat(balance.currentBalance), 2);
        total.available = Math.round(total.available + parseFloat(balance.availableBalance), 2);

        state.totals.set(balance.productCategory, total);
      });
    }
  },
  SET_SCHEDULED_PAYMENTS(state, response) {
    state.scheduledPayments = [];
    if (response) {
      state.scheduledPayments = response.data;
    }
  },
  SET_DIRECT_DEBITS(state, response) {
    state.directDebits = [];
    if (response) {
      state.directDebits = response.data;
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}