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
          transition="slide-left"
          class="q-pa-xs"
          
          @click="$route.name == 'home' ? null : $router.push('/')"
        >
          <q-icon name="home" size="sm"></q-icon>
          <transition
            appear
            enter-active-class="animated fadeInLeft"
          >
            <div v-show="$route.name == 'home'" class="text">
              Beranda
            </div>
          </transition>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="create"
          @click="$route.name == 'create' ? null : $router.push('/create')"
        >
          <q-icon name="add" size="sm"></q-icon>
          <transition
            appear
            enter-active-class="animated fadeInLeft"
          >
            <div v-show="$route.name == 'create'" class="text">
              Buat Soal
            </div>
          </transition>
        </q-tab>

        <q-tab
          class="q-pa-xs"
          name="build"
          @click="$route.name == 'build' ? null : $router.push('/build')"
        >
          <q-icon name="fa fa-file-alt" class="text-white" size="sm"></q-icon>
          <transition
            appear
            enter-active-class="animated fadeInLeft"
          >
            <div
              v-show="$route.name == 'build'"
              class="text q-pr-sm"
            >
              Rakit
            </div>
          </transition>
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
          <q-icon name="poll" size="sm"></q-icon>

          <transition
            appear
            enter-active-class="animated fadeInLeft"
          >
            <div
              v-show="$route.name == 'studentresultlist'"
              class="text"
            >
              Hasil
            </div>
          </transition>
        </q-tab>
        <q-tab
          class="q-pa-xs"
          name="account"
          @click="$route.name == 'account' ? null : $router.push('/account')"
        >
          <q-avatar size="35px">
            <div style="position:absolute;">
              <q-icon size="35px" name="ion-md-contact" />
            </div>
            <q-img
              :src="`${Setting.storageUrl}/${Auth.auth.avatar}`"
              no-default-spinner
            />
          </q-avatar>
          <transition
            appear
            enter-active-class="animated fadeInLeft"
          >
            <div
              v-show="$route.name == 'account'"
              class="text q-pl-sm"
            >
              Profile
            </div>
          </transition>
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
  created() {},
  mounted() {}
};
</script>
