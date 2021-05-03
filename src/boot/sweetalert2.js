// import something here
import Swal from "sweetalert2";

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default  ({ Vue }) => {
  Vue.prototype.$Swal = Swal;
  // something to do
}
