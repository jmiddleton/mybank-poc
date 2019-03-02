import axios from 'axios';
import _ from "lodash";

const state = {
  payeesList: [],
  payee: {}
}

const mutations = {
  SET_PAYEES (state, payees) {
    let length= payees.length;
    let last_page = Math.ceil(length / state.per_page);

    state.payeesList= {
      "pagination": {
        "total": length,
        "per_page": state.per_page,
        "current_page": 1,
        "last_page": last_page,
        "next_page_url": "per_page=50&page=2",
        "prev_page_url": null,
        "from": 1,
        "to": 10
      }, 
      data: payees
    };
  }
}

const getters = {
  getPayees: state => { 
    return state.payeesList.data;
  },
  getPayeeById: (state) => (id) => {
    axios
      .get('https://5a2u1vztie.execute-api.ap-southeast-2.amazonaws.com/dev/payees/'+ id)
      .then(r => r.data)
      .then(payee => {
        return payee;
      }).catch(function (error) {
        console.log(error);
      });
  }
}

const actions = {
  loadPayees ({ commit }, data) {
    axios
      .get('https://5a2u1vztie.execute-api.ap-southeast-2.amazonaws.com/dev/payees')
      .then(r => r.data)
      .then(payees => {
        commit('SET_PAYEES', payees);
      }).catch(function (error) {
        console.log(error);
      });
  },
  createPayee ({ commit }, formPayee) {
    var newpayee = {
      "payeeId": formPayee.payeeId,
      "customerId": "12345",
      "name": formPayee.name,
      "description": formPayee.description,
      "BSB": formPayee.BSB,
      "accountNumber": formPayee.accountNumber,
      "payeeType": formPayee.payeeType
    };
  
    axios
      .post('https://5a2u1vztie.execute-api.ap-southeast-2.amazonaws.com/dev/payees', newpayee)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  deletePayee ({ commit }, payeeId) {
    axios
      .delete('https://5a2u1vztie.execute-api.ap-southeast-2.amazonaws.com/dev/payees/' + payeeId)
      .then(function (response) {
        //let index = state.payeesList.data.indexOf(response);
        //state.payeesList.data.splice(index, 1);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  updatePayee ({ commit }, payee) {
    axios
      .put('https://5a2u1vztie.execute-api.ap-southeast-2.amazonaws.com/dev/payees/' + payee.payeeId, payee)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}