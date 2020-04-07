<template>
  <div>
    <q-header
      elevated
      :style="`background-image:url(${Setting.assets.bgToolbar});background-size:cover;`"
    >
      <q-toolbar>
        <q-icon name="home" style="font-size: 1.5em;" />
        <q-toolbar-title>
          Prof Dr. Zulham Azwar Achmad
        </q-toolbar-title>
        <q-btn flat round icon="close" @click="logout()" />
      </q-toolbar>
    </q-header>
    <div style="height: 100vh">
      <div class="row full-height">
        <div class="col-12 self-center">
          <center>
            <div class="text-body1">Dalam kontruksi</div>
            <q-btn @click="logout()" color="white" text-color="black" label="Atau Logout" />
          </center>
        </div>
      </div>
    </div>
    <!-- <q-btn @click="logout()" color="white" text-color="black" label="Logout" /> -->

    <!-- <q-pull-to-refresh @refresh="onRefresh">
      <div class="q-pa-sm">
        <div class="row full-height">
          <div class="col-3 self-center">
            <q-avatar style="height: 20vw; width: 20vw;">
              <img :src="`${Setting.storageUrl}/${Auth.auth.avatar}`" />
            </q-avatar>
          </div>
          <div class="col-9">
            <div class="row">
              <div class="col-4">
                <div class="text-body1">Halo</div>
              </div>
              <div class="col-4">
                <div class="text-body1">Halo</div>
              </div>
              <div class="col-4">
                <div class="text-body1">Halo</div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="text-body1">Halo</div>
              </div>
              <div class="col-4">
                <div class="text-body1">Halo</div>
              </div>
              <div class="col-4">
                <div class="text-body1">Halo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </q-pull-to-refresh> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["Setting", "Auth"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("Auth/logout").then((res) => {
        this.$router.push("/login");
      });
    },
    onRefresh(done) {
      this.$store.dispatch("Auth/getAuth").then((res) => {
        done();
      });
    },
  },
};
</script>

<style></style>
