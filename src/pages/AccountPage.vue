<template>
  <div>
    <q-header
      elevated
      :style="
        `background-image:url(${Setting.assets.bgToolbar});background-size:cover;`
      "
    >
      <q-toolbar>
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
                <q-img
                  :src="`${Setting.storageUrl}/${Auth.auth.avatar}`"
                  no-default-spinner
                />
              </q-avatar>
            </div>
          </div>
          <div class="col-3 self-center">
            <div class="row justify-center">
              <div class="text-body1 text-bold">
                {{ Auth.auth.assigments.length }}
              </div>
            </div>
            <div class="row justify-center">
              <div class="text-caption">Paket Soal</div>
            </div>
          </div>
          <div class="col-3 self-center">
            <div class="row justify-center">
              <div class="text-body1 text-bold">
                {{ Auth.auth.count_sessions }}
              </div>
            </div>
            <div class="row justify-center">
              <div class="text-caption">Dikerjakan</div>
            </div>
          </div>
          <div class="col-3 self-center">
            <div class="row justify-center">
              <div class="text-body1 text-bold">
                {{ Auth.auth.count_question_lists }}
              </div>
            </div>
            <div class="row justify-center">
              <div class="text-caption">Butir Soal</div>
            </div>
          </div>
        </div>
        <div class="row q-pt-md">
          <div class="text-body2 text-teal q-pb-sm" v-if="Auth.auth.kta_id">
            No Anggota: {{ Auth.auth.kta_id }}
          </div>
        </div>
        <div class="row">
          <div class="text-caption q-pb-sm">
            {{ Auth.auth.email }}
          </div>
        </div>
        <div class="row">
          <div class="text-caption" v-linkified>
            {{ Auth.auth.profile.long_bio }}
          </div>
        </div>
      </div>

      <!-- list item -->
      <div
        class="row justify-center q-mt-lg"
        style="opacity:0.5"
        v-if="
          Auth.auth.assigments.length == 0
        "
      >
        <div class="col">
          <center>
            <q-icon name="rate_review" size="40vw" color="grey" />
            <div class="text-body1 text-bold text-grey q-mb-lg">Kosong</div>
          </center>
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-intersection
          v-for="assigment in Auth.auth.assigments"
          :key="assigment.id"
          :style="`min-height: 30vh;width: 100vw`"
        >
          <item-component :assigment="assigment"></item-component>
        </q-intersection>
      </div>
      <!-- end list item  -->
    </q-pull-to-refresh>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components:{
    ItemComponent: ()=> import('components/assigment/ItemComponent.vue')
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
