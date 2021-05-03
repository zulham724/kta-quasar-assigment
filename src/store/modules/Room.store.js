/* Module1.store.js */
import axios from "axios";
// State object
const state = {
    items: {}
};

// Mutations
const mutations = {
  
};

// Actions
const actions = {
    index({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/room?type=class`)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    destroy({ commit }, id) {
        return new Promise((resolve, reject) => {
            let access = {
                _method: "delete"
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/room/${id}`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    store({ commit }, roomName) {
        return new Promise((resolve, reject) => {
            let access = {
                name: roomName,
                type: 'class'
            }
            axios
                .post(`${this.state.Setting.url}/api/v1/room`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    join({ commit }, roomCode) {
        return new Promise((resolve, reject) => {
            let access = {
                code: roomCode
            }
            axios
                .post(`${this.state.Setting.url}/api/v1/rooms/join`, access)
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
