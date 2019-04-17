import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import layout from './layout';
import payeesModule from './modules/payees.js';
import accountsModule from './modules/accounts.js';
import transactionsModule from './modules/transactions.js';
//import router from '../Routes';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.headers.common['x-api-key'] = process.env.VUE_APP_API_KEY;

// Add a response interceptor
axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  if (error.response.status === 401) {
    Vue.prototype.$auth.logout();
    //router.push("/error");
  }
  return Promise.reject(error.response);
});

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  modules: {
    layout,
    payees: payeesModule,
    accounts: accountsModule,
    transactions: transactionsModule
  },
  state: {
  },
  actions: {
  },
  mutations: {
  }
});
