<template>
  <q-layout view="lHh Lpr lFf">

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
        <q-tab name="home" icon="mail" label="Beranda" @click="$router.push('/')" />
        <q-tab name="build" icon="explore" label="Rakit" @click="$router.push('/build')" />
        <q-tab name="create" icon="add" label="Buat" @click="$router.push('/create')" />
        <q-tab name="notif" icon="message" label="Notif" @click="$router.push('/notif')" />
        <q-tab name="account" icon="person" label="Akun" @click="$router.push('/account')" />
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
