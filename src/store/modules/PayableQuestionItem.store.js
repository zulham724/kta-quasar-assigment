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
  items: {}
};

// Mutations
const mutations = {
  set(state, payload) {
    state.items = payload.items;
    // console.log('janck',payload.items);
  },
  setIsPaid(state, { question_list_id, value }) {
    const data = state.items.data.find(e => e.id == question_list_id);
    if (data) {
      data.is_paid = value;
    }
  },
  deleteItem(state, question_list_id) {
    const index = state.items.data.findIndex(e => e.id == question_list_id);
    if (index > -1) {
      state.items.data.splice(index, 1);
    } else {
      alert("anjing");
    }
  },
  remove(state, payload) {
    const index = state.assigments.data.findIndex(
      item => item.id == payload.id
    );
    state.assigments.data.splice(index, 1);
  },
  addTop(state, item) {
    state.items.data.unshift(item);
  },
  next(state, payload) {
    // let new_array = removeDuplicates([...state.assigments.data, ...payload.assigments.data], 'id')
    state.items = {
      ...payload.items,
      data: [...state.items.data, ...payload.items.data]
    };
  }
};

// Actions
const actions = {
  index({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/question_item/payable`)
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
  setPaid({ commit }, { question_list_id, value }) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${this.state.Setting.url}/api/v1/question_item/setispaid/${question_list_id}`,
          { value }
        )
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getItem({}, question_list_id) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${this.state.Setting.url}/api/v1/question_item/payable/${question_list_id}`
        ).then(res => {
          resolve(res.data);
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
