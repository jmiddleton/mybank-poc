import axios from 'axios';
import _ from "lodash";

const base_path = "http://localhost:3000/cds-au/v1/banking";
const state = {
  categories: [
    {
      id: "TRANS_AND_SAVINGS_ACCOUNTS",
      name: "Saving Accounts"
    },{
      id: "TERM_DEPOSITS",
      name: "Term Deposits"
    },{
      id: "TRAVEL_CARDS",
      name: "Travel Cards"
    },{
      id: "REGULATED_TRUST_ACCOUNTS",
      name: "Trust Accounts"
    },{
      id: "RESIDENTIAL_MORTGAGES",
      name: "Mortgages"
    },{
      id: "CRED_AND_CHRG_CARDS",
      name: "Credit Cards"
    },{
      id: "PERS_LOANS",
      name: "Personal Loans"
    },{
      id: "MARGIN_LOANS",
      name: "Margin Loans"
    },{
      id: "LEASES",
      name: "Leases"
    },{
      id: "TRADE_FINANCE",
      name: "Trades"}
  ],
  accounts: [],
  balances: [],
  totalBalance: 0,
  totalAvailableBalance: 0,
  account: {},
  balance: 0
}

const getters = {
  categories: state => {
    return state.categories;
  },
  accountsByCategory: state =>{
    var result= _.reduce(state.accounts, function(result, account) {
      (result[account.productCategory] || (result[account.productCategory] = [])).push(account);
      return result;
    }, {});
    return result;
  },
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
      .get(base_path + '/accounts')
      .then(r => r.data)
      .then(accounts => {
        commit('SET_ACCOUNTS', accounts);
      })
  },
  getAccountById({ commit }, accountId) {
    axios
      .get(base_path + '/accounts/' + accountId)
      .then(r => r.data)
      .then(account => {
        commit('SET_ACCOUNT', account);
      }).catch(function (error) {
        console.log(error);
      })
  },
  loadAccountBalances({ commit }) {
    axios
      .get(base_path + '/accounts/balances')
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
    state.account = account.data;
  },
  SET_BALANCES(state, balances) {
    state.balances = balances.data.balances;
    state.totalBalance = 0;
    state.totalAvailableBalance = 0;

    state.balances.forEach(balance => {
      if (balance.balanceUType === 'deposit') {
        state.totalBalance = state.totalBalance + parseFloat(balance.deposit.currentBalance.amount);
        state.totalAvailableBalance = state.totalAvailableBalance + parseFloat(balance.deposit.availableBalance.amount);
      } else {
        state.totalBalance = Math.round(state.totalBalance - parseFloat(balance.lending.accountBalance.amount), 2);
        state.totalAvailableBalance = state.totalAvailableBalance + parseFloat(balance.lending.availableBalance.amount);
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