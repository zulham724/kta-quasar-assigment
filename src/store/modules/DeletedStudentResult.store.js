/* Module1.store.js */
import axios from "axios";
// State object
const state = {
    items: {},
};

// Mutations
const mutations = {
    set(state, payload) {
        state.items = payload.items;
    },
    remove() {
        const index = state.items.data.findIndex(item => item.id == payload.id);
        state.items.data.splice(index, 1);
    },
    add(state, data) {
        const index = state.items.data.findIndex(e=>e.id==data.id);
        if(index==-1){
            state.items.data = [...state.items.data, {...data}];
            console.log('add deletedstudenresult',state.items.data)
        }
        
    },
    next(state, payload) {
        state.items = {
            ...payload.items,
            data: [...state.items.data, ...payload.items.data]
        };
    },
    update() {},
    deleteById(state, id){
        const index=state.items.data.findIndex(e=>e.id==id);
        if(index>-1){
            state.items.data.splice(index, 1);
        }
    },
    sortItems(state){
       state.items.data.sort(function(a,b){
           if(a.id>b.id)return -1;
           if(a.id<b.id)return 1;
           return 0;
       });
    },
};
// Actions
const actions = {
    index({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.state.Setting.url}/api/v1/assigments/getdeleteditems`)
                .then(res => {
                    commit("set", { items: res.data });
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
    next({ commit, state }) {
        return new Promise((resolve, reject) => {
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
    add({state, dispatch, commit}, data){
        return new Promise((resolve, reject) => {
           if(!state.items.data){
               console.log('kosong gan')
               dispatch('index').then(res=>{
                   commit('add', data);
                   resolve();
               })
           }else{
            commit('add', data);
            resolve();
           }
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
