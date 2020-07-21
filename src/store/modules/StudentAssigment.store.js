/* Module1.store.js */
import axios from "axios";
// State object
const state = {
    assigments:[],
    items: []
};

// Mutations
const mutations = {
    set(state, payload) {
        state.items = [...state.items, payload.items];
    },
    setAssigment(state, payload){
      
        state.assigments = [...state.assigments, payload.assigment];
    },
    remove() {
        const index = state.items.data.findIndex(item => item.id == payload.id);
        state.items.data.splice(index, 1);
    },
    add() {
        state.items.data = [payload.items, ...state.items.data];
    },
    next(state, payload) {
        let index=state.items.findIndex(e=>e.assigment_id==payload.assigment_id);
        state.items[index].sessions = {
            ...payload.sessions,
            data: [...state.items[index].sessions.data, ...payload.sessions.data]
        }
      
    },
    update() {}
};
// Actions
const actions = {
    getAssigment({commit, state}, assigment_id){
        return new Promise((resolve, reject) => {

            let cek=state.assigments.find(e=>e.id==assigment_id);
            if(cek){
                resolve(cek)
            }
            else{
                // console.log("cek");
                // console.log(state.assigments);
                axios
                    .get(`${this.state.Setting.url}/api/v1/assigments/getassigmentinfo/${assigment_id}`)
                    .then(res => {
                        commit("setAssigment", { assigment: res.data });
                        resolve(res.data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    },
    index({ commit, state }, assigment_id) {
        return new Promise((resolve, reject) => {
            let cek=state.items.find(e=>e.assigment_id==assigment_id);
            
            if(cek){
                resolve(cek);
            }else{
                axios
                    .get(`${this.state.Setting.url}/api/v1/assigments/getstudentassigments/${assigment_id}`)
                    .then(res => {
                        let items={assigment_id:assigment_id,sessions:res.data}
                        //console.log(items);
                        commit("set", {items:items});
                        resolve(items);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
            
        });
    },
    store({ commit }, access) {
        return new Promise((resolve, reject) => {
            axios
                .post(`${this.state.Setting.url}/api/v1/assigment`, access)
                .then(res => {
                    commit("add", { items: res.data });
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    update({ commit }, access) {
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
    next({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
           // console.log(session);
            axios
                .get(`${payload.sessions.next_page_url}`)
                .then(res => {
                    let items={assigment_id:payload.assigment_id, sessions:res.data}
                    commit("next", items);
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
                .post(`${this.state.Setting.url}/api/v1/assigment/${id}`, access)
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
