/* Module1.store.js */
import axios from "axios";
// State object
const state = {};

// Mutations
const mutations = {};

// Actions
const actions = {
    getPaymentVendors({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/paymentvendor`)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getUniquePayment({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios
                .post(`${this.state.Setting.url}/api/v1/payments/getuniquepayment`, {
                    ...payload
                })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    confirmUniquePayment() {
        return new Promise((resolve, reject) => {
            axios
                .post(`${this.state.Setting.url}/api/v1/payments/confirmuniquepayment`)
                .then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err)
                })
        })
    },
    getPaymentUrl({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .post(`${this.state.Setting.url}/api/v1/payment/paymentUrl`)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getDetailPayments({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/payments/bymonthyear`)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getPaymentProvinces({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    `${this.state.Setting.url}/api/v1/payments/bymonthyear/${payload.month}/${payload.year}`
                )
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getPaymentCities({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    `${this.state.Setting.url}/api/v1/payments/bymonthyear/city/${payload.province_id}/${payload.month}/${payload.year}`
                )
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getPaymentCityUsers({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    `${this.state.Setting.url}/api/v1/payments/bymonthyear/cityusers/${payload.city_id}/${payload.month}/${payload.year}`
                )
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
};

// Getter functions
const getters = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};