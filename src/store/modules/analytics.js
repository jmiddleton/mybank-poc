import axios from 'axios';
import moment from 'moment';
import _ from "lodash";

const mformat = "YYYY-MM";
const state = {
    savings: [],
    isLoadingSavings: false,
    spendings: [],
    isLoadingSpendings: true,
    currentSpendings: [],
    spendingsByCategory: [],
    isLoadingSpendingsByCategory: true,
    monthlySpendings: [],
    isLoadingMontlySpendings: true,
    merchants: [],
    isLoadingMerchants: true,
    cashflow: [],
    isLoadingCashflow: true,
    error: ""
}

const actions = {
    async loadSavings({ commit }, query) {
        const month = moment(query.month, mformat).subtract(query.monthsToPrefetch, "months").format(mformat);

        try {
            state.isLoadingSavings = true;
            const response = await axios.get(
                "/analytics/savings/" + month, { "page-size": 4 }
            );
            commit('SET_SAVINGS', response.data);
            state.isLoadingSavings = false;
        } catch (error) {
            state.error = error;
        }
    },
    async loadSpendings({ commit }, query) {
        try {
            state.isLoadingSpendings = true;
            const response = await axios.get(
                "/analytics/spendings/" + query.month,
                {
                    params: {
                        monthsToPrefetch: query.monthsToPrefetch | 0,
                        'page-size': 50
                    }
                }
            );
            commit('SET_SPENDINGS', response.data);
            commit('SET_CURRENT_SPENDING', response.data);
            state.isLoadingSpendings = false;
        } catch (error) {
            state.error = error;
        }
    },
    async loadMonthlySpendings({ commit }, query) {
        try {
            state.isLoadingMontlySpendings = true;
            const response = await axios.get(
                "/analytics/spendings/" + query.month,
                {
                    params: {
                        monthsToPrefetch: query.monthsToPrefetch | 0,
                        'page-size': 50
                    }
                }
            );
            commit('SET_MONTHLY_SPENDINGS', response.data);
            state.isLoadingMontlySpendings = false;
        } catch (error) {
            state.error = error;
        }
    },
    async loadMerchants({ commit }, query) {
        try {
            state.isLoadingMerchants = true;
            const response = await axios.get(
                "/analytics/merchants/" + query.month,
                {
                    params: {
                        monthsToPrefetch: query.monthsToPrefetch | 0,
                        'page-size': 50
                    }
                }
            );
            commit('SET_MERCHANTS', response.data);
            state.isLoadingMerchants = false;
        } catch (error) {
            state.error = error;
        }
    },
    async loadSpendingsByCategory({ commit }, query) {
        try {
            state.isLoadingSpendingsByCategory = true;
            const response = await axios.get(
                "/analytics/spendings/" + query.month,
                {
                    params: {
                        monthsToPrefetch: query.monthsToPrefetch | 0,
                        'page-size': 50
                    }
                }
            );
            commit('SET_SPENDINGS_BY_CATEGORY', response.data);
            state.isLoadingSpendingsByCategory = false;
        } catch (error) {
            state.error = error;
        }
    },
    async loadCashflow({ commit }) {
        try {
            state.isLoadingCashflow = true;
            const response = await axios.get("/analytics/cashflow");
            commit('SET_CASHFLOW_DATA', response.data);
            state.isLoadingCashflow = false;
        } catch (error) {
            state.error = error;
        }
    }
};

const mutations = {
    SET_SAVINGS(state, savings) {
        state.savings = savings.data.savings;
    },
    SET_SPENDINGS(state, spendings) {
        state.spendings = spendings.data.spendings;
    },
    SET_SPENDINGS_BY_CATEGORY(state, spendings) {
        state.spendingsByCategory = spendings.data.spendings;
    },
    SET_MONTHLY_SPENDINGS(state, spendings) {
        state.monthlySpendings = spendings.data.spendings;
    },
    SET_MERCHANTS(state, merchants) {
        state.merchants = merchants.data.merchants;
    },
    SET_CURRENT_SPENDING(state, spendings) {
        //store current spendings
        const sps = spendings.data.spendings;
        if (sps) {
            const current = moment().format(mformat);
            state.currentSpendings = _.filter(sps, function (spend) {
                return spend && spend.month.indexOf(current) >= 0;
            });
        }
    },
    SET_CASHFLOW_DATA(state, cashflow) {
        state.cashflow = cashflow.data;
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}