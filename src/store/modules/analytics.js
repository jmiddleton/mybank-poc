import axios from 'axios';
import moment from 'moment';
import _ from "lodash";

const mformat = "YYYY-MM";

const categoryConfig = {
    Business: { icon: "/img/categories/Business.png", color: "#ffc247" },
    Cash: { icon: "/img/categories/Cash.png", color: "#1EC9E8" },
    Donations: { icon: "/img/categories/Donations.png", color: "#9964e3" },
    EatingOut: { icon: "/img/categories/EatingOut.png", color: "#78c448" },
    Education: { icon: "/img/categories/Education.png", color: "#547fff" },
    Entertainment: {
        icon: "/img/categories/Entertainment.png",
        color: "#17a2b8"
    },
    FeesAndInterest: {
        icon: "/img/categories/FeesAndInterest.png",
        color: "#E4A537"
    },
    General: { icon: "/img/categories/General.png", color: "#B62070" },
    Groceries: { icon: "/img/categories/Groceries.png", color: "#A7B620" },
    Health: { icon: "/img/categories/Health.png", color: "#20B6B6" },
    Housing: { icon: "/img/categories/Housing.png", color: "#ffc247" },
    Income: { icon: "/img/categories/Income.png", color: "#ffc247" },
    Others: { icon: "/img/categories/Others.png", color: "#ffc247" },
    PersonalCare: {
        icon: "/img/categories/PersonalCare.png",
        color: "#ffc247"
    },
    Shopping: { icon: "/img/categories/Shopping.png", color: "#FF7272" },
    Transfers: { icon: "/img/categories/Transfers.png", color: "#ffc247" },
    Transport: { icon: "/img/categories/Transport.png", color: "#CE3D1D" },
    Travel: { icon: "/img/categories/Travel.png", color: "#9964e3" },
    Uncategorized: {
        icon: "/img/categories/Uncategorized.png",
        color: "#D7E1E9"
    },
    Utilities: { icon: "/img/categories/Utilities.png", color: "#ffc247" }
}

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
    error: "",
    categoryConfig: categoryConfig
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