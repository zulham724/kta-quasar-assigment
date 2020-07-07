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
        active-color="cyan-7"
        indicator-color="transparent"
      >
        <q-tab
          class="q-pa-xs"
          name="home"
          @click="$route.name == 'home' ? null : $router.push('/')"
        >
          <q-icon name="mail" size="xs"></q-icon>
          <div class="text-caption">Beranda</div>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="create"
          @click="$route.name == 'create' ? null : $router.push('/create')"
        >
          <q-icon name="add" size="xs"></q-icon>
          <div class="text-caption">Buat</div>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="build"
          @click="$route.name == 'build' ? null : $router.push('/build')"
        >
          <q-btn flat icon="explore" size="sm">
            <q-badge
              floating
              color="cyan-7"
              v-if="Assigment.build"
            >{{Assigment.build.question_lists ? Assigment.build.question_lists.length : 0}}</q-badge>
          </q-btn>
          <div class="text-caption">Rakit</div>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="notif"
          @click="$route.name == 'notif' ? null : $router.push('/notif')"
        >
          <q-icon name="message" size="xs"></q-icon>
          <div class="text-caption">Hasil</div>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="account"
          @click="$route.name == 'account' ? null : $router.push('/account')"
        >
          <q-icon name="person" size="xs"></q-icon>
          <div class="text-caption">Akun</div>
        </q-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MainLayout",
  data() {
    return {
      tab: this.$route.name
    };
  },
  computed: {
    ...mapState(["Setting", "Assigment"])
  },
  mounted() {}
};
</script>
