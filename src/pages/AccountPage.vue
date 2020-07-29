<template>
  <div>
    <q-pull-to-refresh @refresh="onRefresh" v-if="Auth.auth">
      <q-header>
        <q-toolbar class="bg-blue">
          <q-icon name="person" style="font-size: 1.5em;" />
          <q-toolbar-title>
            <div class="text-body2">No Anggota: {{ Auth.auth.kta_id }}</div>
          </q-toolbar-title>
          <q-btn flat icon="logout" @click="logout()" />
        </q-toolbar>
      </q-header>

      <div class="row">
        <div class="col-12">
            <!--begin pengubung-->
          <div 
            id="penghubung"
            style="position: relative;
  height: 20px;"
            class="bg-blue"
          ></div>
            <!--end penghubung-->

          <!--begin header-append-->
          <div
            id="header_append"
          >
            <div id="kotak_biru" style="position: absolute;
  height:60px;width:100vw;"
            class="bg-blue">
              
            </div>

            <!--begin dikerjakan-->
            <div
              id="dikerjakan"
              class="text-black"
              style="position:absolute;margin-top:60px;padding-left:20px"
            >
              <div class="row justify-start">
                <div class="text-h5">
                  {{ Auth.auth.count_sessions }}
                </div>
              </div>
              <div class="row justify-center" style="margin-top: -5px;">
                <div class="text-caption">Dikerjakan</div>
              </div>
            </div><!--end dikerjakan-->

            <!--begin lingkaran-->
            <div class="row justify-center">
              <div id="lingkaran" style="z-index:1">
                <div
                  style="border-radius:50%;border:4px solid white;"
                  class="bg-grey-3"
                >
                  <q-avatar size="100px" @click="zoom(Auth.auth.avatar)">
                    <q-img
                      :src="`${Setting.storageUrl}/${Auth.auth.avatar}`"
                      no-default-spinner
                    />
                  </q-avatar>
                </div>
              </div>
            </div>
            <!--end lingkaran-->
            <div class="row justify-center">
              <div class="text-body1 text-primary text-weight-bold">
                {{ Auth.auth.name }}
              </div>
            </div>
            <div class="row justify-center">
              <div
                class="text-caption q-pl-md q-pr-md q-pb-md q-pt-sm"
                v-linkified
              >
                {{ Auth.auth.profile.long_bio }}
              </div>
            </div>
          </div>
          <!--end header-append-->
        </div>
        <!--end col-->
      </div>
      <!--end row-->

      <div class="row">
        <div class="col-12">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey-10"
          >
            <q-tab name="unpublish">
              <q-icon name="description" color="blue"></q-icon>
              <div class="text-caption">
                <b>{{ Auth.auth.count_question_lists }}</b> Butir Soal
              </div>
            </q-tab>
            <q-tab name="publish">
              <q-icon name="bookmarks" color="blue"></q-icon>
              <div class="text-caption">
                <b>{{
                  Auth.auth.assigments.filter(item => item.is_publish).length
                }}</b>
                Paket Soal
              </div>
            </q-tab>
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="publish" class="q-pa-none">
              <div class="q-pa-none row items-start q-gutter-y-sm">
                <q-intersection
                  v-for="assigment in Auth.auth.publish_assigments"
                  :key="assigment.id"
                  style="min-height:50px;width:100vw"
                >
                  <publish-item-component
                    :assigment="assigment"
                    :isAuth="true"
                  ></publish-item-component>
                </q-intersection>
              </div>
            </q-tab-panel>
            <q-tab-panel name="unpublish" class="q-pa-none">
              <div class="q-pa-none q-gutter-y-xs">
                <q-intersection
                  v-for="assigment in Auth.auth.unpublish_assigments"
                  :key="assigment.id"
                  :style="`min-height:50px;width: 100vw`"
                >
                  <unpublish-item-component
                    :assigment="assigment"
                  ></unpublish-item-component>
                </q-intersection>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
      <!--end col-->
      <!--end row-->
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
