
import axios from 'axios';
import _ from "lodash";

const state = {
  categories: [
    {
      id: "TRANS_AND_SAVINGS_ACCOUNTS",
      name: "Saving Accounts"
    }, {
      id: "TERM_DEPOSITS",
      name: "Term Deposits"
    }, {
      id: "TRAVEL_CARDS",
      name: "Travel Cards"
    }, {
      id: "REGULATED_TRUST_ACCOUNTS",
      name: "Trust Accounts"
    }, {
      id: "RESIDENTIAL_MORTGAGES",
      name: "Mortgages"
    }, {
      id: "CRED_AND_CHRG_CARDS",
      name: "Credit Cards"
    }, {
      id: "PERS_LOANS",
      name: "Personal Loans"
    }, {
      id: "MARGIN_LOANS",
      name: "Margin Loans"
    }, {
      id: "LEASES",
      name: "Leases"
    }, {
      id: "TRADE_FINANCE",
      name: "Trades"
    }
  ],
  accounts: [],
  balances: [],
  totalBalance: 0,
  totalAvailableBalance: 0,
  account: {},
  balance: 0,
  hasAccounts: undefined
}

const getters = {
  accountsByCategory: state => {
    var result = _.reduce(state.accounts, function (result, account) {
      (result[account.productCategory] || (result[account.productCategory] = [])).push(account);
      return result;
    }, {});

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
    try {
      const response = await axios.get('/accounts');
      commit('SET_ACCOUNTS', response.data);
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
  }
};

const mutations = {
  SET_ACCOUNTS(state, response) {
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
    if (response) {
      state.account = response.data;
    }
  },
  SET_BALANCES(state, response) {
    state.totalBalance = 0;
    state.totalAvailableBalance = 0;

    if (response && response.data) {
      state.balances = response.data.balances;

      state.balances.forEach(balance => {
        if (balance.balanceUType === 'deposit') {
          state.totalBalance = Math.round(state.totalBalance + parseFloat(balance.deposit.currentBalance.amount), 2);
          state.totalAvailableBalance = state.totalAvailableBalance + parseFloat(balance.deposit.availableBalance.amount);
        } else {
          state.totalBalance = Math.round(state.totalBalance - parseFloat(balance.lending.accountBalance.amount), 2);
          state.totalAvailableBalance = state.totalAvailableBalance + parseFloat(balance.lending.availableBalance.amount);
        }
      });
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}