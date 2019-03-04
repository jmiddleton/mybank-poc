import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import layout from './layout';
import payeesModule from './modules/payees.js';
import accountsModule from './modules/accounts.js';

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  modules: {
    layout,
    payees: payeesModule,
    accounts: accountsModule
  },
  state: {
  },
  actions: {
    
  },
  mutations: {
  }
});
