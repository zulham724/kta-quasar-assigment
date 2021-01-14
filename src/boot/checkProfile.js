import store from "./../store";
//jika user belum logout, maka akan direfresh saat pertama kali membuka apliaksi
// console.log('checkprofile',store().getters['Auth/auth'])
if(store().getters['Auth/auth']){
  console.log('checkProfile',store().getters['Auth/auth'])
  store().dispatch('Auth/getAuth')
}