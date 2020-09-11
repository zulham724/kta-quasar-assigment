import VueEcho from "vue-echo-laravel";
import Vue from "vue";
//import Echo from "laravel-echo"
import store from "./../store";
const token = store().getters["Auth/token"];
const auth = store().getters["Auth/auth"];
const url = store().getters["Setting/url"];
import { mapState } from 'vuex'


//window.io = require("socket.io-client");
window.Pusher = require('pusher-js');
Vue.prototype.$connect = (token)=>{
  
    return new Promise((resolve, reject)=>{
        if (!Vue.prototype.$echo && token.token_type!=null) {
            console.log('token')
            console.log(token.token_type)
            Vue.use(VueEcho, {
              //broadcaster: "socket.io",
              broadcaster: "pusher",
              key:"3fa4f5ea1c2d2c09d457",
              //host: "http://localhost:8000",
              authEndpoint: url+'/broadcasting/auth',
              cluster:'ap1',
              forceTLS: true,
              auth: {
                headers: { 
                  Authorization: `${token.token_type} ${token.access_token}`
                }
              }
            });
          }else{
              console.log('token kosong')
          }
          resolve('konek gan')
    })
    // if (token.access_token) {
    //     console.log('token')
    //     console.log(token.token_type)
    //     Vue.use(VueEcho, {
    //       //broadcaster: "socket.io",
    //       broadcaster: "pusher",
    //       key:"3fa4f5ea1c2d2c09d457",
    //       //host: "http://localhost:8000",
    //       authEndpoint: url+'/broadcasting/auth',
    //       cluster:'ap1',
    //       forceTLS: true,
    //       auth: {
    //         headers: { 
    //           Authorization: `${token.token_type} ${token.access_token}`
    //         }
    //       }
    //     });
    //   }else{
    //       console.log('token kosong')
    //   }
    //   return "asu";      
}
//subsribe pada channel App.User.{id}
Vue.prototype.$subscribeNotification = ()=>{
    let channel = "App.User." + auth.id;
    console.log("channel notification:" + channel);

    Vue.prototype.$echo.private(channel).notification(notification => {
          console.log(notification);
          store().dispatch(
              "EchoNotification/addNotification",
              notification
          );
      });
}

//!!!fungsi $initNotification belum bisa karena store().getters masih me-return value yang lama padahl state'nya sudah diganti
//jika data Notifikasi belum ada, maka difetch dulu baru di subscribe ke channel
Vue.prototype.$initNotification = ()=>{
  //jika dada Notifikasi belum ada, maka kirim ajax 
  if (!store().getters["EchoNotification/test"]) {
      alert('belum ada gan')
      Promise.all([store().dispatch("EchoNotification/index"), store().dispatch('EchoNotification/getCount')]).then(res => {
        //alert(store.getters['EchoNotification/test'])
        Vue.prototype.$subscribeNotification();
      });
      
  } else {
    Vue.prototype.$subscribeNotification();
  }
}
//Vue.prototype.$initNotification();
//!!!fungsi $initNotification belum bisa karena store().getters masih me-return value yang lama padahl state'nya sudah diganti
