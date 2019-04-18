import axios from 'axios';

const state = {
    transactions: [],
    nextkey: '',
    message: 'Load more...',
    categories: []
}

const actions = {
    loadTransactionsByAccountId({ commit }, filter) {
        if (filter.firstPage) {
            state.nextkey = '';
            state.transactions = [];
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
            });
    },
    async getCategories({ commit }) {
        const response = await axios.get('/categories');
        commit('SET_CATEGORIES', response.data);
    },
    async changeCategory({ commit }, txn){
        const accountId = txn.accountId.substring(1, txn.accountId.indexOf('#'));
        await axios.put('/accounts/' + accountId + "/transactions/" + txn.transactionId, txn);
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
    },
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}