import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
// import store from "./../store";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function({ Vue, store }) {
  const Router = new VueRouter({
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    console.log('push',Router.push);

    if (from.name == "jitsi" && store.getters["Room/isMeeting"]) {
      Vue.prototype.$Swal
        .fire({
          title: "Tutup kelas?",
          text: "Yakin Anda mau menutup kelas ini?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya"
        })
        .then(result => {
          if (result.isConfirmed) {
            const currentRoom = store.getters["Room/currentRoom"];
            store.dispatch("Room/closeMeetingClass", { room: currentRoom });
            return next();

          }
        });
      return next(false);
    } else return next();
  });

  return Router;
}
