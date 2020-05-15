<template>
  <div>
    <q-header
      elevated
      :style="`background-image:url(${Setting.assets.bgToolbar});background-size:cover;`"
    >
      <q-toolbar>
        <q-icon name="home" style="font-size: 1.5em;" />
        <q-space />

        <!-- <q-btn
          flat
          round
          icon="send"
          style="transform: rotate(-20deg);"
          @click="$router.push('/globalchat')"
        /> -->
      </q-toolbar>
      <q-toolbar inset>
        <q-toolbar-title>
          Home
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div id="top"></div>
    <q-pull-to-refresh @refresh="refresh">
      <q-infinite-scroll @load="onLoad" :offset="250">
        <div class="q-pt-md row items-start q-gutter-md">
          <q-intersection
            v-for="(assigment) in Assigment.assigments.data"
            :key="assigment.id"
            transition="scale"
            :style="`min-height: 45vh;width: 100vw`"
          >
            <assigment-item-component
              :assigment="assigment"
            ></assigment-item-component>
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
    AssigmentItemComponent: () =>
      import("components/AssigmentItemComponent.vue"),
  },
  data() {
    return {
      assigments: [],
    };
  },
  computed: {
    ...mapState(["Assigment",'Setting']),
  },
  created() {
    if (!this.Assigment.assigments.data)
      this.$store.dispatch("Assigment/index");
  },
  mounted() {

  },
  methods: {
    onLoad(index, done) {
      this.Assigment.assigments.next_page_url
        ? this.$store.dispatch("Assigment/next").then((res) => done())
        : done();
    },
    refresh(done) {
      this.$store.dispatch("Assigment/index").then(res=>{
        done()
      })
    },
  },
};
</script>

<style></style>
