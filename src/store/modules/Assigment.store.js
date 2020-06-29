/* Module1.store.js */
import axios from "axios";

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

// State object
const state = {
    assigments: {},
    build: null,
    create: null,
    publish: {},
    unpublish: {}
};

// Mutations
const mutations = {
    set(state, payload) {
        state.assigments = payload.assigments;
    },
    remove(state, payload) {
        const index = state.assigments.data.findIndex(
            item => item.id == payload.id
        );
        state.assigments.data.splice(index, 1);
    },
    add(state, payload) {
        state.assigments.data = [payload.assigment, ...state.assigments.data];
    },
    next(state, payload) {
        // let new_array = removeDuplicates([...state.assigments.data, ...payload.assigments.data], 'id')
        state.assigments = {
            ...payload.assigments,
            data: [...state.assigments.data, ...payload.assigments.data]
        };
    },
    setBuild(state, payload) {
        state.build = {
            ...payload.build,
            question_lists: payload.build.question_lists ? [...payload.build.question_lists] : []
        };
    },
    resetBuild(state) {
        state.build = null
    },
    addPublish(state, payload) {
        state.publish.data = [payload.publish, ...state.publish.data];
    },
    setPublish(state, payload) {
        state.publish = payload.publish;
    },
    removePublish(state, payload) {
        const index = state.publish.data.findIndex(
            item => item.id == payload.id
        );
        state.publish.data.splice(index, 1);
    },
    nextPublish(state, payload) {
        state.publish = {
            ...payload.publish,
            data: [...state.publish.data, ...payload.publish.data]
        };
    },
    addUnpublish(state, payload) {
        state.unpublish.data = [payload.unpublish, ...state.unpublish.data];
    },
    setUnpublish(state, payload) {
        state.unpublish = payload.unpublish;
    },
    removeUnpublish(state, payload) {
        const index = state.unpublish.data.findIndex(
            item => item.id == payload.id
        );
        state.unpublish.data.splice(index, 1);
    },
    nextUnpublish(state, payload) {
        state.unpublish = {
            ...payload.unpublish,
            data: [...state.unpublish.data, ...payload.unpublish.data]
        };
    },
};

// Actions
const actions = {
    index({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/assigment`)
                .then(res => {
                    commit("set", { assigments: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getPublish({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/assigments/publish`)
                .then(res => {
                    commit("setPublish", { publish: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getUnpublish({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/assigments/unpublish`)
                .then(res => {
                    commit("setUnpublish", { unpublish: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    store({ commit }, access) {
        return new Promise((resolve, reject) => {
            axios
                .post(`${this.state.Setting.url}/api/v1/assigment`, access)
                .then(res => {
                    commit("add", { assigment: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    update({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            let access = {
                ...payload,
                _method: "put"
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/assigment/${access.id}`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    show({ commit }, id) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/assigment/${id}`)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    next({ commit, state }) {
        return new Promise((resolve, reject) => {
            console.log(state.assigments.next_page_url);
            axios
                .get(`${state.assigments.next_page_url}`)
                .then(res => {
                    commit("next", { assigments: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    nextPublish({ commit, state }) {
        return new Promise((resolve, reject) => {
            console.log(state.publish.next_page_url);
            axios
                .get(`${state.publish.next_page_url}`)
                .then(res => {
                    commit("nextPublish", { publish: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    nextUnpublish({ commit, state }) {
        return new Promise((resolve, reject) => {
            console.log(state.unpublish.next_page_url);
            axios
                .get(`${state.unpublish.next_page_url}`)
                .then(res => {
                    commit("nextPublish", { unpublish: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    prev() {},
    page() {},
    destroy({ commit }, id) {
        return new Promise((resolve, reject) => {
            let access = {
                _method: "delete"
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/assigment/${id}`, access)
                .then(res => {
                    commit("remove", { id: id });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    like({ commit }, id) {
        return new Promise((resolve, reject) => {
            const access = {
                assigment_id: id
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/assigmentlike`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    dislike({ commit }, id) {
        return new Promise((resolve, reject) => {
            const access = {
                _method: "delete"
            };
            axios
                .post(`${this.state.Setting.url}/api/v1/assigmentlike/${id}`, access)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    comment({ commit }, id) {
        return new Promise((resolve, reject) => {});
    },
    unComment() {
        return new Promise((resolve, reject) => {});
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