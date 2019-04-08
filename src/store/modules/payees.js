import axios from 'axios';

const state = {
  payeesList: [],
  payee: {}
}

const mutations = {
  SET_PAYEE(state, payee) {
    state.payee = payee;
  },
  SET_PAYEES(state, payees) {
    let length = payees.length;
    let last_page = Math.ceil(length / state.per_page);

    state.payeesList = {
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
    return state.payeesList;
  },
  getPayee: state => {
    return state.payee;
  }
}

const actions = {
  getPayeeById: ({ commit }) => (id) => {
    axios
      .get('/payees/' + id)
      .then(r => r.data)
      .then(payee => {
        commit('SET_PAYEE', payee);
      });
  },
  loadPayees({ commit }) {
    axios
      .get('/payees')
      .then(r => r.data)
      .then(payees => {
        commit('SET_PAYEES', payees);
      });
  },
  createPayee({ commit }, newPayee) {
    axios
      .post('/payees', newPayee);
  },
  deletePayee({ commit }, payeeId) {
    axios
      .delete('/payees/' + payeeId);
      //.then(function (response) {
        //let index = state.payeesList.data.indexOf(response);
        //state.payeesList.data.splice(index, 1);
      //});
  },
  updatePayee({ commit }, payee) {
    axios
      .put('/payees/' + payee.payeeId, payee);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}