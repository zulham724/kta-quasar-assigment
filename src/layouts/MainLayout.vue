<template>
  <q-layout view="hHh Lpr fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      <q-tabs
        v-model="tab"
        no-caps
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-tab name="home" icon="mail" label="Beranda" @click="$route.name == 'home' ? null : $router.push('/')" />
        <q-tab name="build" icon="explore" label="Rakit" @click="$route.name == 'build' ? null : $router.push('/build')" />
        <q-tab name="create" icon="add" label="Buat" @click="$route.name == 'create' ? null : $router.push('/create')" />
        <q-tab name="notif" icon="message" label="Notif" @click="$route.name == 'notif' ? null : $router.push('/notif')" />
        <q-tab name="account" icon="person" label="Akun" @click="$route.name == 'account' ? null : $router.push('/account')" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "MainLayout",
  data() {
    return {
      tab: this.$route.name
    };
  },
  computed:{
    ...mapState(['Setting']),

  },
  mounted(){
  }
};
</script>
