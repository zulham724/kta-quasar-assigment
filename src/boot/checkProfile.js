import store from "./../store";
//jika user belum logout, maka akan direfresh saat pertama kali membuka apliaksi
if(store().getters['Auth/auth'].id){
  console.log('checkProfile',store().getters['Auth/auth'])
  store().dispatch('Auth/getAuth')
}