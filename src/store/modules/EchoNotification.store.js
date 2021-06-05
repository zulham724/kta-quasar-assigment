/* Module1.store.js */
import axios from "axios";
// State object
import Echo from "laravel-echo";
import Vue from "vue";

const state = {
  items: {},
  unread_count: 0,
  Echo: null
};

// Mutations
const mutations = {
  set(state, payload) {
    // payload.posts.data.map(item => item.isReadMore = false)
    state.items = {
      ...payload.items,
      data: [
        ...payload.items.data.map(item => {
          return { ...item };
        })
      ]
    };
    //console.log('anjim')
    //console.log(state.items)
  },
  next(state, payload) {
    // payload.posts.data.map(item => item.isReadMore = false)

    let filereditems = payload.items.data.filter(item => {
      return state.items.data.find(e => e.id == item.id) ? false : true;
    });
    state.items = {
      ...payload.items,
      data: [...state.items.data, ...filereditems]
    };
  },
  addNotification(state, notification) {
    if (!state.items.data.find(e => e.id == notification.data.id)) {
      let new_item = {
        id: notification.data.id,
        type: notification.type,
        data: { data: { ...notification.data } }
      };
      console.log("new item");
      console.log(new_item);
      //delete new_item.comment;
      console.log("addNotification");
      console.log(state.items.data);
      state.items.data.unshift(new_item);
      state.unread_count++;
    }
  },
  // sama dengan addNotification, bedanya untuk menghandle struktur json data yang berbeda
  addNotification2(state, notification) {
    if (!state.items.data.find(e => e.id == notification.id)) {
      let new_item = {
        id: notification.id,
        type: notification.type,
        created_at: notification.created_at,
        key: notification.key,
        data: { ...notification }
      };
      // if(notification.type.includes('Payable')){
      //   console.log('Payable newitem',new_item);
      // }
      // hapus data yang lama dari array
      if (notification.key) {
        const oldItemIndex = state.items.data.findIndex(e => {
          return (
            e.type == notification.type &&
            e.data[notification.key]["id"] == notification[notification.key]["id"]
          );
        });
        console.log("oldItem index", oldItemIndex);
        if(oldItemIndex>-1){
          const removing = state.items.data.splice(oldItemIndex, 1);
          console.log("removed oldData", removing);
        }
      }

     
      state.items.data.unshift(new_item);
      state.unread_count++;
    }
  },
  deletePayableQuestionListNotification(state,notification_id){
    const index = state.items.data.findIndex(e=>e.id===notification_id);
    if(index>-1){
      state.items.data.splice(index, 1);
    }
  }, 
  setCount(state, count) {
    state.unread_count = count;
  },
  deleteItems(state) {
    state.items = {};
  }
};

// Actions
const actions = {
  index({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${this.state.Setting.url}/api/v1/notification?type=assigmentnotification,assigmentsharednotification,payablequestionlistnotification,payableassigmentlistnotification`
        )
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
      // console.log(state.posts.next_page_url);
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
  //   addNotification({ commit, state, dispatch }, notification) {
  //     commit("addNotification", notification);
  //   },
  getCount({ commit }) {
    return new Promise((resolve, reject) => {
      // console.log(state.posts.next_page_url);
      axios
        .get(`${this.state.Setting.url}/api/v1/notification_total`)
        .then(res => {
          commit("setCount", res.data.unread_notifications_count);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  markAsRead({ commit }) {
    return new Promise((resolve, reject) => {
      // console.log(state.posts.next_page_url);
      axios
        .post(`${this.state.Setting.url}/api/v1/notification_markasread`)
        .then(res => {
          commit("setCount", 0);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  initNotification({ state, dispatch }, payload) {
    if (!state.items.data) {
      Promise.all([dispatch("index"), dispatch("getCount")]).then(res => {
        console.log("init Notifikasi gan");
        console.log(state.items.data);
        console.log(state.unread_count);
        dispatch("connectServer")
          .then(res => {
            console.log("connectServer sukses > ");
            console.log(res);
            dispatch("subscribeNotification");
          })
          .catch(err => {
            alert(err);
          });
      });
      // this.$store.dispatch("EchoNotification/index");
      // this.$store.dispatch('EchoNotification/getCount');
    } else {
      //console.log('fail connectServer')
      console.log(state.items.data);
      dispatch("subscribeNotification");
    }
  },
  connectServer({ state, rootState }) {
    console.log("connect to Notification server");
    const url = rootState.Setting.url;
    return new Promise((resolve, reject) => {
      let token = rootState.Auth.token;
      if (!window.Echo && token.token_type != null) {
        console.log("token for Notification broadcast");
        console.log(token);
        window.Echo = new Echo({
          //broadcaster: "socket.io",
          broadcaster: "pusher",
          key: "c59b9918ea05165dbe03",
          //host: "http://localhost:8000",
          authEndpoint: url + "/broadcasting/auth",
          cluster: "ap1",
          forceTLS: true,
          auth: {
            headers: {
              Authorization: `${token.token_type} ${token.access_token}`
            }
          }
        });
      } else {
        console.log("token kosong");
      }
      resolve(window.Echo);

      // Vue.prototype.$connect(token).then(res=>{
      //   resolve()
      // }).catch((err)=>{
      //   reject(err)
      // })
    });
  },
  subscribeNotification({ commit, rootState }) {
    //console.log(this.state.Auth)
    if (rootState.Auth.auth.id && window.Echo) {
      // let channel = "App.Models.User." + this.state.Auth.auth.id;
      let channel = "notification." + this.state.Auth.auth.id;
      console.log("Subscribing to notification channel: " + channel);
      //console.log(Vue.prototype.$echo)
      const events = ["AssigmentTeacherEvent", "AssigmentSharedEvent"];
      events.forEach(event => {
        console.log("event", event);
        window.Echo.private(channel).listen(event, notification => {
          console.log(notification.data);
          notification.type = event;
          commit("addNotification", notification);
        });
      });
      window.Echo.private(channel).notification(notification => {
        console.log("notifikasi", notification.type);
        console.log("data notifikasi", notification);
        commit("addNotification2", notification);
      });
      // window.Echo.private(channel).listen(events[0], notification => {
      //   console.log(notification.data);
      //   notification.type = events[0];
      //   commit("addNotification", notification);
      // }).listen(events[1], notification=>{
      //   console.log(notification.data);
      //   notification.type = events[1];
      //   commit("addNotification", notification);
      // }).listen(events[2], notification=>{
      //   console.log(notification.data);
      //   notification.type = events[2];
      //   commit("addNotification", notification);
      // }).listen(events[3], notification=>{
      //   console.log(notification.data);
      //   notification.type = events[3];
      //   commit("addNotification", notification);
      // });
    } else {
      console.log("user belum login atau belum connect ke server broadcast");
    }
  }
};

// Getter functions
const getters = {
  cokk: state => state.items.data,
  test(state) {
    return state.items;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
