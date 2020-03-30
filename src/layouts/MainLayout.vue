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
        <q-tab name="home" icon="mail" label="Home" @click="$router.push('/')" />
        <q-tab name="info" icon="explore" label="Search" @click="$router.push('/search')" />
        <q-tab name="order" icon="add" label="Buat" @click="$router.push('/add')" />
        <q-tab name="discussion" icon="message" label="Notif" @click="$router.push('/notif')" />
        <q-tab name="account" icon="person" label="Akun" @click="$router.push('/account')" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      tab: null
    };
  }
};
</script>
