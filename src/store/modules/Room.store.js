/* Module1.store.js */
import axios from "axios";
// State object
const state = {
  items: {},
  is_meeting: false,
  currentRoom: {}
};

// Mutations
const mutations = {
  setIsMetting(state, value) {
    state.is_meeting = value;
  },
  setCurrentRoom(state, value) {
    state.currentRoom = { ...value };
  }
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
        type: "class"
      };
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
      };
      axios
        .post(`${this.state.Setting.url}/api/v1/rooms/join`, access)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  closeMeetingClass({ dispatch, rootGetters }, { room }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/rooms/${room.id}/userlist`)
        .then(res => {
          const auth = rootGetters["Auth/auth"];
          res.data.non_admin_users.forEach(user => {
            // console.log(`Kelas ${room.name} sudah dimulai oleh ${auth.name}`);
            const payload = {
              title: `Kelas Sudah Ditutup`,
              body: `${auth.name} menutup kelas '${room.name}'`,
              params: {
                sender_id: auth.id,
                target_id: user.id,
                target_type: `ClassMeeting`,
                text: `${auth.name} sedang memulai kelas ${room.name}`
              },
              to: `/topics/close_video_meeting_${user.id}`
            };
            console.log(payload);
            dispatch("Notif/send", payload, { root: true });
          });

          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  notifAllStudent({ commit, dispatch, rootGetters }, { room }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/rooms/${room.id}/userlist`)
        .then(res => {
          const auth = rootGetters["Auth/auth"];
          res.data.non_admin_users.forEach(user => {
            // console.log(`Kelas ${room.name} sudah dimulai oleh ${auth.name}`);
            const payload = {
              title: `Kelas Sudah Dimulai`,
              body: `${auth.name} memulai kelas '${room.name}'`,
              params: {
                sender_id: auth.id,
                target_id: user.id,
                room,
                target_type: `ClassMeeting`,
                text: `${auth.name} sedang memulai kelas ${room.name}`
              },
              to: `/topics/class_video_meeting_${user.id}`
            };
            console.log(payload);
            dispatch("Notif/send", payload, { root: true });
          });

          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

// Getter functions
const getters = {
  isMeeting: state => state.is_meeting,
  currentRoom: state => state.currentRoom
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
