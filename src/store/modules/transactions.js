import axios from 'axios';
import _ from "lodash";
import clean from "obj-clean";

const state = {
    transactions: [],
    message: 'Load more...',
    isLoading: true,
    categories: [],
    filter: {
        firstPage: true,
        category: '',
        month: '',
        pagesize: 25,
        nextkey: ''
    },
}

const actions = {
    loadTransactionsByAccountId({ commit }, accountId) {
        const filter = state.filter;
        state.isLoading = true;

        if (filter.firstPage) {
            filter.nextkey = '';
            state.transactions = [];
        }
        axios
            .get("/accounts/" + accountId + "/transactions", {
                params: clean(state.filter)
            })
            .then(r => r.data)
            .then(txnResult => {
                commit('SET_TXN', txnResult);
                state.isLoading = false;
            });
    },
    async getCategories({ commit }) {
        const response = await axios.get('/categories');
        commit('SET_CATEGORIES', response.data);
    },
    async changeCategory({ commit }, txn) {
        if (txn && txn.accountId) {
            const accountId = txn.accountId.substring(0, txn.accountId.indexOf('#'));
            await axios.put('/accounts/' + accountId + "/transactions/" + txn.transactionId, txn);
            commit('SET_CATEGORY', txn);
        }
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
        state.filter.nextkey = nextLink.get("nextkey");
        if (!state.filter.nextkey) {
            state.message = 'No more transactions';
        }
    },
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_CATEGORY(state, txn) {
        const transaction = _.find(state.transactions, { 'transactionId': txn.transactionId });
        if (transaction) {
            transaction.category = txn.category;
        }
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}