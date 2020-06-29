<template>
  <div>
    <q-header
      elevated
      :style="`background-image:url(${Setting.assets.bgToolbar});background-size:cover;`"
    >
      <q-toolbar>
        <q-icon name="home" style="font-size: 1.5em;" />
      </q-toolbar>
      <q-toolbar inset>
        <q-toolbar-title>
          <div class="text-body1">Home</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div id="top"></div>
    <q-pull-to-refresh @refresh="init">
    <q-tabs v-model="tab" dense class="q-mt-sm text-grey-10">
      <q-tab name="unpublish">
        <q-icon name="description"></q-icon>
        <div class="text-caption">Butir Soal</div>
      </q-tab>
      <q-tab name="publish">
        <q-icon name="bookmarks"></q-icon>
        <div class="text-caption">Paket Soal</div>
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="publish" class="q-pa-none">
        <list-publish-component></list-publish-component>
      </q-tab-panel>
      <q-tab-panel name="unpublish" class="q-pa-none">
        <list-unpublish-component></list-unpublish-component>
      </q-tab-panel>
    </q-tab-panels>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {
    ListPublishComponent: () =>
      import("components/assigment/ListPublishComponent.vue"),
    ListUnpublishComponent: () =>
      import("components/assigment/ListUnpublishComponent.vue")
  },
  data() {
    return {
      assigments: [],
      tab: "unpublish"
    };
  },
  computed: {
    ...mapState(["Assigment", "Setting"])
  },
  created() {},
  mounted() {},
  methods: {
    init(done) {
      Promise.all([
        this.$store.dispatch("Assigment/getPublish"),
        this.$store.dispatch("Assigment/getUnpublish")
      ]).then(res => {
        if (done) done();
      });
    }
  }
};
</script>

<style></style>
