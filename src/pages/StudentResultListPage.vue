<template>
  <div>
    <q-pull-to-refresh @refresh="init">
      <q-header elevated>
        <q-toolbar class="bg-blue">
          <q-icon name="poll" style="font-size: 1.5em" />
          <q-toolbar-title>
            <div class="text-body1">Hasil</div>
          </q-toolbar-title>
          <q-btn flat round dense @click="$router.push({name:'deletedstudentresult'})">
          <q-icon name="o_auto_delete" />
        </q-btn>
        </q-toolbar>
      </q-header>

    <q-page>
      <div v-if="!StudentResult.items.data && !loading">
        <div class="row">
          <div class="col-12 q-pa-lg text-center">
            <div class="text-h5 text-black">Assigment masih kosong</div>
          </div>
        </div>
      </div>
      <q-infinite-scroll @load="onLoad" :offset="250" v-if="StudentResult.items.data">
          <div class="q-pa-none row q-gutter-y-xs">
          <transition-group name="fadeLeft" style="width:100%">
          <q-intersection
            style="min-height: 25vh; width: 100%;"
            class="q-pa-xs"
            v-for="(assigment) in StudentResult.items.data"
            :key="assigment.id"
          >
        
            <student-result-item-component
              :assigment="assigment"
            ></student-result-item-component>
          </q-intersection>
          </transition-group>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
      </q-page>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { Notify } from "quasar";

export default {
  components: {
    StudentResultItemComponent: () =>
      import("components/assigment/studentresult/ItemComponent.vue"),
  },
  data() {
    return {
      assigments: {
        data: [],
      },
      tab: "teacher",
      loading: false,
    };
  },
  computed: {
    ...mapState(["Setting", "Assigment", "StudentResult"]),
  },
  created() {
    if (!this.StudentResult.items.data) this.$store.dispatch("StudentResult/index");
  },
  mounted() {},
  methods: {
    init(done) {
      Promise.all([
        this.$store.dispatch("Auth/getAuth"),
        this.$store.dispatch("StudentResult/index"),
      ]).then((res) => {
        if (done) done();
      });
    },
    onLoad(index, done) {
      this.StudentResult.items.next_page_url
        ? this.$store.dispatch("StudentResult/next").then((res) => done())
        : done();
    },
  },
};
</script>

<style>
#rcorners1 {
  border-radius: 8px;
  background: #bae7e7;
  padding-left: 10px;
  width: 150px;
}
</style>
