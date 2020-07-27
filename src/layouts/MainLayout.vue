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
        class="text-white bg-primary"
        active-color="white"
        inline-label
      >
        <q-tab
          name="home"
          class="q-pa-xs"
          @click="$route.name == 'home' ? null : $router.push('/')"
        >
          <q-icon name="home" size="md"></q-icon>
            <div v-if="$route.name == 'home'" class="text-weight-bold">
              Beranda
            </div>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="create"
          @click="$route.name == 'create' ? null : $router.push('/create')"
        >
          <q-icon name="add" size="md"></q-icon>
          <div v-if="$route.name == 'create'" class="text-weight-bold">
            Buat Soal
          </div>
        </q-tab>

        <q-tab
          class="q-pa-xs"
          name="build"
          @click="$route.name == 'build' ? null : $router.push('/build')"
        >
          <q-icon name="home" size="md"></q-icon>
          <div v-if="$route.name == 'build'" class="text-weight-bold q-pr-sm">
            Rakit
          </div>
          <q-badge floating color="cyan-7" v-if="Assigment.build">{{
            Assigment.build.question_lists
              ? Assigment.build.question_lists.length
              : 0
          }}</q-badge>
        </q-tab>

        <q-tab
          name="studentresultlist"
          @click="
            $route.name == 'studentresultlist'
              ? null
              : $router.push('/studentresultlist')
          "
        >
          <q-icon name="message" size="md"></q-icon>


          <div
            v-if="$route.name == 'studentresultlist'"
            class="text-weight-bold"
          >
            Hasil
          </div>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="account"
          @click="$route.name == 'account' ? null : $router.push('/account')"
        >
          <q-avatar size="35px">
            <q-img
              :src="`${Setting.storageUrl}/${Auth.auth.avatar}`"
              no-default-spinner
            />
          </q-avatar>
          <div v-if="$route.name == 'account'" class="text-weight-bold q-pl-sm">
            Profile
          </div>
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
    ...mapState(["Setting", "Assigment", "Auth"])
  },
  mounted() {}
};
</script>
