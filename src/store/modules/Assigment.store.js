/* Module1.store.js */
import axios from "axios";
import moment from "moment";
import { format } from "quasar";

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
    is_paid: false,
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
  studentResultSession: [],
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
      question_lists: payload.build.question_lists
        ? [...payload.build.question_lists]
        : []
    };
  },
  resetBuild(state, param = {}) {
    let is_paid = false;
    if (param.is_paid) is_paid = param.is_paid;
    state.build = {
      is_paid,
      is_publish: true,
      isTimer: false,
      isExpire: false,
      isPassword: false,
      grade_id: null,
      question_lists: [],
      education_year: `${moment().format("YYYY")}/${moment()
        .add(1, "years")
        .format("YYYY")}`
    };
  },
  resetBuildQuestionLists(state) {
    state.build.question_lists = [];
  },
  addQuestionList(state, payload) {
    console.log(payload);
    if (!state.build.question_lists) state.build = { question_lists: [] };
    state.build.question_lists.push({
      id: payload.question_list.id,
      name: payload.question_list.name,
      description: payload.question_list.description,
      pivot: {
        ...payload.question_list.pivot
      },
      answer_lists: payload.question_list.answer_lists,
      audio: payload.question_list.audio,
      images: payload.question_list.images,
    
    });
    console.log(state.build);
  },
  setStudentResultSession(state, payload) {
    state.studentResultSession = payload;
    console.log(state.studentResultSession);
  },
  updateGrade(state, value) {
    state.build.grade = value;
  },
  setIsPaid(state, value) {
    state.build.is_paid = value;
  }
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
  store({ commit }, { access, audio }) {
    return new Promise((resolve, reject) => {
      console.log("access", access);
      // resolve('c');
      // return;
      const keys = Object.keys(access);
      console.log("keys", keys);
      // resolve(e);
      // return;
      let form = new FormData();
      access.question_lists.forEach((v, k) => {
        console.log("audio dan image");
        if (v.audio.blob) {
          form.append(`audio[${k}]`, v.audio.blob);
        } else {
          form.append(`audio[${k}]`, "");
        }

        // gambar dri question_lists
        let images = [];
        if (v.images.length) {
          v.images.forEach((image, i) => {
            form.append(`images[${k}][${i}]`, image);
          });
        }
        //looping question_lists.*.answer_lists
        v.answer_lists.forEach((v2, k2) => {
          if (v2.type == "image") {
            v2.images.forEach((image, i) => {
              form.append(
                `question_lists[${k}][answer_lists][${k2}][images][${i}]`,
                image
              );
            });
          }
        });
      });

      // keys.forEach((v,k)=>{
      //   if((access[v] instanceof Array)==false){
      //     form.append(v,access[v]);
      //   }

      // });
      // access.question_lists.forEach((v,k)=>{
      //   form.append(`question_lists[${k}][name]`,v.name);
      //   form.append(`question_lists[${k}][description]`,v.description);
      //   // pivot object
      //   form.append(`question_lists[${k}][pivot][assigment_type]`,v.pivot.assigment_type);
      //   form.append(`question_lists[${k}][pivot][assigment_type_id]`,v.pivot.assigment_type_id);
      //   form.append(`question_lists[${k}][pivot][creator_id]`,v.pivot.creator_id);
      //   form.append(`question_lists[${k}][pivot][creator_id]`,v.pivot.creator_id);

      //   // answer_list array
      //   v.answer_lists.forEach((v2,k2)=>{
      //     form.append(`question_lists[${k}][answer_lists][${k2}]`)
      //   });

      // });

      // console.log('form',form)
      form.append("data", JSON.stringify(access));
      axios
        .post(`${this.state.Setting.url}/api/v1/assigment`, form, {
          headers: {
            "content-type": "multipart/form-data"
          }
        })
        .then(res => {
          // commit("add", { assigment: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  storeBuild({ commit }, access) {
    console.log('access', access);
    // return;
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
    console.log("payload", payload);
    const formData = new FormData();
    function buildFormData(formData, data, parentKey) {
      if (
        data &&
        typeof data === "object" &&
        !(data instanceof Date) &&
        !(data instanceof File) &&
        !(data instanceof Blob)
      ) {
        Object.keys(data).forEach(key => {
          buildFormData(
            formData,
            data[key],
            parentKey ? `${parentKey}[${key}]` : key
          );
        });
      } else {
        const value = data == null ? "" : data;

        formData.append(parentKey, value);
      }
    }

    buildFormData(formData, payload);
    // alert(asu);

    return new Promise((resolve, reject) => {
      let access = {
        ...payload,
        _method: "put"
      };

      formData.append("_method", "PUT");
      axios
        .post(
          `${this.state.Setting.url}/api/v1/assigment/${access.id}`,
          formData,
          {
            headers: {
              "content-type": "multipart/form-data"
            }
          }
        )
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
  share({ commit }, access) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.state.Setting.url}/api/v1/assigments/share`, access)
        .then(res => {
          // commit("add", { assigment: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getSharedPublish({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.state.Setting.url}/api/v1/assigments/getsharedpublish`)
        .then(res => {
          // commit("add", { assigment: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  nextSharedPublish({ commit }, next_page_url) {
    // console.log("tes");
    // console.log(next_page_url);
    return new Promise((resolve, reject) => {
      axios
        .get(`${next_page_url}`)
        .then(res => {
          //commit("next", { assigments: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getStudentAssigments({ commit }, assigment_id) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${this.state.Setting.url}/api/v1/assigments/getstudentassigments/${assigment_id}`
        )
        .then(res => {
          console.log("hasi");
          console.log(res.data);
          //commit("next", { assigments: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  ///BEGIN-SESSION///
  getStudentSession({ commit }, session_id) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${this.state.Setting.url}/api/v1/session/getsessionid/${session_id}`
        )
        .then(res => {
          //console.log(res.data);
          //commit("next", { assigments: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  saveScore({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.state.Setting.url}/api/v1/session/savescore`, payload)
        .then(res => {
          //console.log(res.data);
          //commit("next", { assigments: res.data });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  resetBuildQuestionLists({ commit }) {
    return new Promise((resolve, reject) => {
      commit("resetBuildQuestionLists");
      resolve();
    });
  },
  ///END-SESSION////
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
  like({ commit, dispatch }, id) {
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
  },
  setPublic({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.state.Setting.url}/api/v1/assigments/setpublic`, payload)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  deleteAssigment({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${this.state.Setting.url}/api/v1/assigments/${payload.id}/softdelete`
        )
        .then(res => {
          resolve(res);
        });
    });
  },
  restoreAssigment({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${this.state.Setting.url}/api/v1/assigments/${payload.id}/restore`
        )
        .then(res => {
          resolve(res);
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
