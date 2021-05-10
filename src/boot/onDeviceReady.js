// import store from "./../store";
import requestPermission from "../lib/requestPermission";
import appVersion from "../lib/appVersion";
export default ({ app, router, store, Vue }) => {
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    // Now safe to use device APIs
    requestPermission();
    appVersion({ store });
    
    // console.log("navigator.camera", navigator.camera);
   

    const token = store.getters["Auth/token"];

    if (token.access_token) {
      store.dispatch("Notif/init");
    }
  }
};
