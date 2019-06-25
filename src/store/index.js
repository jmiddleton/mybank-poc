import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import layout from './layout';
import payeesModule from './modules/payees.js';
import accountsModule from './modules/accounts.js';
import transactionsModule from './modules/transactions.js';
import analyticsModule from './modules/analytics.js';
//import router from '../Routes';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.headers.common['x-api-key'] = process.env.VUE_APP_API_KEY;

// Add a response interceptor
axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  if (error && error.message && error.message === "Network Error") {
    Vue.prototype.$auth.setErrorMessage(
      {
        message: "MyBank server is currently not able to process your request." +
          " Please try in few seconds.",
        variant: "danger"
      }
    );
  } else if (error.response && error.response.status === 401) {
    Vue.prototype.$auth.logout();
  }
  return Promise.reject(error);
});

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  modules: {
    layout,
    payees: payeesModule,
    accounts: accountsModule,
    transactions: transactionsModule,
    analytics: analyticsModule
  },
  state: {
  },
  actions: {
  },
  mutations: {
  }
});
