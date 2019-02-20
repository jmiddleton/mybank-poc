import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import layout from './layout';

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  modules: {
    layout,
  },
  state: {
    accounts: [],
    balances: [],
    totalBalance: 0,
    totalAvailableBalance: 0
  },
  actions: {
    loadAccountSummary ({ commit }) {
      axios
        .get('http://localhost:4000/accounts')
        .then(r => r.data)
        .then(accounts => {
          commit('SET_ACCOUNTS', accounts);
        })
    },
    loadAccountBalances ({ commit }) {
      axios
        .get('http://localhost:4000/balances')
        .then(r => r.data)
        .then(balances => {
          commit('SET_BALANCES', balances);
        })
    }
  },
  mutations: {
    SET_ACCOUNTS (state, accounts) {
      state.accounts= accounts.data.accounts;
    },
    SET_BALANCES (state, balances) {
      state.balances= balances.data.balances;

      state.balances.forEach(balance => {
        state.totalBalance = state.totalBalance + parseFloat(balance.deposit.currentBalance.amount);
        state.totalAvailableBalance = state.totalAvailableBalance + parseFloat(balance.deposit.availableBalance.amount);
      });
    }
  }
});
