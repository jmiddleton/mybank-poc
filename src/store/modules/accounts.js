import axios from 'axios';
import _ from "lodash";

const base_path = "http://localhost:4000";
const state = {
  accounts: [],
  balances: [],
  totalBalance: 0,
  totalAvailableBalance: 0,
  account: {}
}

const getters = {
  accountsList: state => { 
    return state.accounts;
  },
  account: state => { 
    return state.account;
  },
  balances: state => { 
    return state.balances;
  },
  totalBalance: state => { 
    return state.totalBalance;
  },
  totalAvailableBalance: state => { 
    return state.totalAvailableBalance;
  }
}

const actions = {
  loadAccountSummary({ commit }) {
    axios
      .get(base_path+'/accounts')
      .then(r => r.data)
      .then(accounts => {
        commit('SET_ACCOUNTS', accounts);
      })
  },
  getAccountById({ commit }, accountId) {
    axios
      .get(base_path+'/accountDetails/' + accountId)
      .then(r => r.data)
      .then(account => {
        commit('SET_ACCOUNT', account);
      }).catch(function (error) {
        console.log(error);
      })
  },
  loadAccountBalances({ commit }) {
    axios
      .get(base_path+'/balances')
      .then(r => r.data)
      .then(balances => {
        commit('SET_BALANCES', balances);
      })
  }
};

const mutations = {
  SET_ACCOUNTS(state, accounts) {
    state.accounts = accounts.data.accounts;
  },
  SET_ACCOUNT(state, account) {
    //TODO: for the real api use account.data
    state.account = account;
  },
  SET_BALANCES(state, balances) {
    state.balances = balances.data.balances;
    state.totalBalance = 0;
    state.totalAvailableBalance = 0;

    state.balances.forEach(balance => {
      if (balance.balanceUType === 'deposit') {
        state.totalBalance = state.totalBalance + parseFloat(balance.deposit.currentBalance.amount);
        state.totalAvailableBalance = state.totalAvailableBalance + parseFloat(balance.deposit.availableBalance.amount);
      }
    });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}