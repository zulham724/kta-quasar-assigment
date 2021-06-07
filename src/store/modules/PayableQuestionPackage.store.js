/* Module1.store.js */
import axios from "axios";
// import moment from "moment";

// State object
const state = {
  items: {}
};

// Mutations
const mutations = {
  set(state, payload) {
    state.items = payload.items;
  },
  setIsPaid(state, { assigment_id, value }) {
    const data = state.items.data.find(e => e.id == assigment_id);
    if (data) {
      data.is_paid = value;
    }
  },
  deleteItem(state, assigment_id) {
    const index = state.items.data.findIndex(e => e.id == assigment_id);
    if (index > -1) {
      state.items.data.splice(index, 1);
    } else {
      console.log("ini hapus PayableQuestionPackage");
      //   alert("ini hapus");
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
  setPaid({ commit }, { assigment_id, value }) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${this.state.Setting.url}/api/v1/question_package/setispaid/${assigment_id}`,
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
  getItem({}, assigment_id) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${this.state.Setting.url}/api/v1/question_package/payable/${assigment_id}`
        )
        .then(res => {
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
