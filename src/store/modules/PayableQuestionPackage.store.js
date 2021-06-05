/* Module1.store.js */
import axios from "axios";
// import moment from "moment";

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
   items:[],
};

// Mutations
const mutations = {
    set(state, payload) {
        state.items = payload.items;
        // console.log('janck',payload.items);
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
        state.items = {
            ...payload.items,
            data: [...state.items.data, ...payload.items.data]
        };
    },
   
 
};

// Actions
const actions = {
    index({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/question_package/payable`)
                .then(res => {
                    commit("set", { items: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    next({ commit, state }) {
        return new Promise((resolve, reject) => {
            console.log(state.items.next_page_url);
            axios
                .get(`${state.items.next_page_url}`)
                .then(res => {
                    commit("next", { items: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
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
