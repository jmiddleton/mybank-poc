import axios from 'axios';
import moment from 'moment';

const mformat = "YYYY-MM";
const state = {
    savings: [],
    isLoadingSavings: false,
    spendings: [],
    isLoadingSpendings: true,
    merchants: [],
    isLoadingMerchants: true
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
            console.log(error);
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
                        "page-size": 50
                    }
                }
            );
            commit('SET_SPENDINGS', response.data);
            state.isLoadingSpendings = false;
        } catch (error) {
            console.log(error);
        }
    },
    async loadMerchants({ commit }, query) {
        try {
            state.isLoadingMerchants = true;
            const response = await axios.get(
                "/analytics/merchants/" + query.month,
                {
                    params: { monthsToPrefetch: query.monthsToPrefetch | 0 }
                }
            );
            commit('SET_MERCHANTS', response.data);
            state.isLoadingMerchants = false;
        } catch (error) {
            console.log(error);
        }
    }
    // },
    // async loadCurrentSpendings({ commit }) {

    //     // if (!state.isLoadingCurrentSpendings) {
    //     //     try {
    //     //         clearInterval(state.interval);
    //     //     } catch {
    //     //         //nothing
    //     //     }
    //     // }

    //     try {
    //         state.isLoadingCurrentSpendings = true;
    //         const response = await axios.get("/analytics/spendings/" + moment().format(mformat));
    //         commit('SET_CURRENT_SPENDING', response.data);
    //         state.isLoadingCurrentSpendings = false;
    //     } catch (error) {
    //         console.log(error);
    //         //state.interval = setInterval(() => loadCurrentSpendings(), 10000);
    //     }
    // }
};

const mutations = {
    SET_SAVINGS(state, savings) {
        state.savings = savings.data.savings;
    },
    SET_SPENDINGS(state, spendings) {
        state.spendings = spendings.data.spendings;
    },
    SET_MERCHANTS(state, merchants) {
        state.merchants = merchants.data.merchants;
    },
    SET_CURRENT_SPENDING(state, spendings) {
        state.currentSpendings = spendings.data.spendings;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}