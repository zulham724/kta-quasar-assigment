<template>
  <div>
    <q-header
      elevated
    >
      <q-toolbar class="bg-cyan-7">
        <q-icon name="home" style="font-size: 1.5em;" />
        <q-toolbar-title>
          <div class="text-body1">{{ Auth.auth.name }}</div>
        </q-toolbar-title>
        <q-btn flat icon="logout" @click="logout()" />
      </q-toolbar>
    </q-header>

    <q-pull-to-refresh @refresh="onRefresh" v-if="Auth.auth">
      <div class="q-pa-md">
        <div class="row">
          <div class="col-3">
            <div class="row justify-start align-center">
              <q-avatar size="20vw" @click="zoom(Auth.auth.avatar)">
                <q-img :src="`${Setting.storageUrl}/${Auth.auth.avatar}`" no-default-spinner />
              </q-avatar>
            </div>
          </div>
          <div class="col-3 self-center">
            <div class="row justify-center">
              <div
                class="text-body1 text-bold"
              >{{ Auth.auth.assigments.filter(item=>item.is_publish).length }}</div>
            </div>
            <div class="row justify-center">
              <div class="text-caption">Paket Soal</div>
            </div>
          </div>
          <div class="col-3 self-center">
            <div class="row justify-center">
              <div class="text-body1 text-bold">{{ Auth.auth.count_sessions }}</div>
            </div>
            <div class="row justify-center">
              <div class="text-caption">Dikerjakan</div>
            </div>
          </div>
          <div class="col-3 self-center">
            <div class="row justify-center">
              <div class="text-body1 text-bold">{{ Auth.auth.count_question_lists }}</div>
            </div>
            <div class="row justify-center">
              <div class="text-caption">Butir Soal</div>
            </div>
          </div>
        </div>
        <div class="row q-pt-md">
          <div
            class="text-body2 text-cyan-7 q-pb-sm"
            v-if="Auth.auth.kta_id"
          >No Anggota: {{ Auth.auth.kta_id }}</div>
        </div>
        <div class="row">
          <div class="text-caption q-pb-sm">{{ Auth.auth.email }}</div>
        </div>
        <div class="row">
          <div class="text-caption" v-linkified>{{ Auth.auth.profile.long_bio }}</div>
        </div>
      </div>

      <q-tabs v-model="tab" dense class="q-mt-sm text-grey-10">
        <q-tab name="unpublish">
          <q-icon name="description" color="cyan-7"></q-icon>
          <div class="text-caption">Butir Soal</div>
        </q-tab>
        <q-tab name="publish">
          <q-icon name="bookmarks" color="cyan-7"></q-icon>
          <div class="text-caption">Paket Soal</div>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="publish" class="q-pa-none">
          <div class="q-pa-none row items-start q-gutter-md">
            <q-intersection
              v-for="(assigment) in Auth.auth.publish_assigments"
              :key="assigment.id"
              :style="`min-height: 45vh;width: 100vw`"
            >
              <publish-item-component :assigment="assigment"></publish-item-component>
            </q-intersection>
          </div>
        </q-tab-panel>
        <q-tab-panel name="unpublish" class="q-pa-none">
          <div class="q-pa-none">
            <q-intersection v-for="(assigment) in Auth.auth.unpublish_assigments" :key="assigment.id">
              <unpublish-item-component :assigment="assigment"></unpublish-item-component>
            </q-intersection>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    PublishItemComponent: () =>
      import("components/assigment/publish/ItemComponent.vue"),
    UnpublishItemComponent: () =>
      import("components/assigment/unpublish/ItemComponent.vue")
  },
  data() {
    return {
      tab: "unpublish"
    };
  },
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  methods: {
    logout() {
      this.$store.dispatch("Auth/logout").then(res => {
        this.$router.push("/login");
      });
    },
    onRefresh(done) {
      this.$store.dispatch("Auth/getAuth").then(res => {
        done();
      });
    }
  }
};
</script>

<style></style>
