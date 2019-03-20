import axios from 'axios';
import _ from "lodash";

const state = {
    transactions: [],
    nextkey: '',
    message: 'Load more...'
}

const getters = {

}

const actions = {
    loadTransactionsByAccountId({ commit }, filter) {
        if (filter.firstPage) {
            state.nextkey = '';
            state.transactions= [];
        }
        axios
            .get("/accounts/" + filter.accountId + "/transactions", {
                params: {
                    "page-size": 25,
                    "text": "searchtext",
                    "start-time": "",
                    "end-time": "",
                    "nextkey": state.nextkey
                }
            })
            .then(r => r.data)
            .then(txnResult => {
                commit('SET_TXN', txnResult);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};

const mutations = {
    SET_TXN(state, txnResult) {
        state.message = 'Load more...';

        var txns = txnResult.data.transactions;
        for (let i = 0; i < txns.length; i++) {
            state.transactions.push(txns[i]);
        }

        const nextLink = new URLSearchParams(txnResult.links.next);
        state.nextkey = nextLink.get("nextkey");
        if (!state.nextkey) {
            state.message = 'No more transactions';
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