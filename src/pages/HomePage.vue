<template>
  <div>
    <q-header
      elevated
    >
      <q-toolbar class="bg-cyan-7">
        <q-icon name="home" style="font-size: 1.5em;" />
        <q-toolbar-title>
          <div class="text-body1">Home</div>
        </q-toolbar-title>
        <q-btn flat rounded dense style="transform: rotate(-20deg);" icon="send" />
      </q-toolbar>
    </q-header>
    <q-pull-to-refresh @refresh="init">
      <q-carousel animated v-model="slide" :arrows="false" :navigation="false" infinite autoplay height="30vh">
        <q-carousel-slide :name="1" img-src="~assets/images/cover3.jpg" />
      </q-carousel>
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
          <q-infinite-scroll v-if="tab == 'publish'" @load="onLoadPublish" :offset="250">
            <div class="q-pa-none row items-start q-gutter-md" v-if="Publish.items.data">
              <q-intersection
                v-for="(assigment) in Publish.items.data"
                :key="assigment.id"
                style="min-height:20vh;width:100vw"
              
              >
                <publish-item-component :assigment="assigment"></publish-item-component>
              </q-intersection>
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
          <q-infinite-scroll v-if="tab == 'unpublish'" @load="onLoadUnpublish" :offset="250">
            <div class="q-pa-none" v-if="Unpublish.items.data">
              <q-intersection v-for="(assigment) in Unpublish.items.data" :key="assigment.id" style="min-height:10vh;width:100vw">
                <unpublish-item-component :assigment="assigment"></unpublish-item-component>
              </q-intersection>
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
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
      assigments: [],
      tab: "unpublish",
      slide:1
    };
  },
  computed: {
    ...mapState(["Assigment", "Setting",'Publish','Unpublish'])
  },
  created() {
    if (!this.Publish.items.data)
      this.$store.dispatch("Publish/index");
    if (!this.Unpublish.items.data)
      this.$store.dispatch("Unpublish/index");
  },
  mounted() {},
  methods: {
    init(done) {
      Promise.all([
        this.$store.dispatch("Auth/getAuth"),
        this.$store.dispatch("Publish/index"),
        this.$store.dispatch("Unpublish/index")
      ]).then(res => {
        if (done) done();
      });
    },
    onLoadPublish(index, done) {
      this.Publish.items.next_page_url
        ? this.$store.dispatch("Publish/next").then(res => done())
        : done();
    },
    onLoadUnpublish(index, done) {  
      this.Unpublish.items.next_page_url
        ? this.$store.dispatch("Unpublish/next").then(res => done())
        : done();
    }
  }
};
</script>

<style></style>
