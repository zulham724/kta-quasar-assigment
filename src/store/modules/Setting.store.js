/* Module1.store.js */
import axios from 'axios'
// State object
const state = {
    // url: 'https://agpaiidigital.org',
    storageUrl: 'http://cdn-agpaiidigital.online',
    url: process.env.DEV ? 'http://192.168.1.17:8000' : 'https://agpaiidigital.org',
    // url: process.env.DEV ? 'http://192.168.56.1:8000' : 'https://agpaiidigital.org',
    // url: 'https://agpaiidigital.org',
    // storageUrl: 'http://localhost:8000/storage',
    assets: {
        bgToolbar: 'statics/bg-toolbar.jpeg'
    }
}

// Mutations
const mutations = {

}

// Actions
const actions = {
    index({ commit }) {
        return new Promise((resolve, reject) => {
          axios.get(`${this.state.Setting.url}/api/v1/settings`).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
}

// Getter functions
const getters = {
    url: state => state.url
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}