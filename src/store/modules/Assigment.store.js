/* Module1.store.js */
import axios from "axios";
import moment from "moment";

// function removeDuplicates(originalArray, prop) {
//     var newArray = [];
//     var lookupObject = {};

//     for (var i in originalArray) {
//         lookupObject[originalArray[i][prop]] = originalArray[i];
//     }

//     for (i in lookupObject) {
//         newArray.push(lookupObject[i]);
//     }
//     return newArray;
// }

// State object
const state = {
    assigments: {},
    build: {
        is_publish: true,
        isTimer: false,
        isExpire: false,
        isPassword: false,
        grade_id: null,
        question_lists: [],
        education_year: `${moment().format("YYYY")}/${moment()
      .add(1, "years")
      .format("YYYY")}`
    },
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
        state.build = null;
    },
    resetBuildQuestionLists(state) {
        state.build.question_lists = [];
    },
    addQuestionList(state, payload) {
        console.log(payload);
        if (!state.build.question_lists) state.build = { question_lists: [] };
        state.build.question_lists.push({
            name: payload.question_list.name,
            description: payload.question_list.description,
            pivot: {
                ...payload.question_list.pivot
            },
            answer_lists: payload.question_list.answer_lists
        });
        console.log(state.build);
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
    store({ commit }, access) {
        return new Promise((resolve, reject) => {
            axios
                .post(`${this.state.Setting.url}/api/v1/assigment`, access)
                .then(res => {
                    // commit("add", { assigment: res.data });
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
