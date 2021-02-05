<template>
  <div>
    <q-pull-to-refresh @refresh="init">
      <q-header elevated>
        <q-toolbar class="bg-blue">
          <q-btn flat round dense @click="$router.back()">
            <q-icon name="arrow_back" style="font-size: 1.5em" />
          </q-btn>
          <q-toolbar-title>
            <div class="text-body1">Hasil yang dihapus</div>
          </q-toolbar-title>
         
        </q-toolbar>
      </q-header>

      <q-page>
        <div v-if="!DeletedStudentResult.items.data && !loading">
          <div class="row">
            <div class="col-12 q-pa-lg text-center">
              <div class="text-h5 text-black">Assigment masih kosong</div>
            </div>
          </div>
        </div>
        <q-infinite-scroll
          @load="onLoad"
          :offset="250"
          v-if="DeletedStudentResult.items.data"
        >
          <div class="q-pa-none row q-gutter-y-xs">
            <transition-group name="fadeLeft">
              <q-intersection
                style="min-height: 25vh; width: 100vw"
                class="q-pa-xs"
                v-for="assigment in DeletedStudentResult.items.data"
                :key="assigment.id"
              >
                <deleted-student-result-item-component
                  :assigment="assigment"
                ></deleted-student-result-item-component>
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

export default {
  components: {
    DeletedStudentResultItemComponent: () =>
      import("components/assigment/deletedstudentresult/ItemComponent.vue"),
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
    ...mapState(["Setting", "DeletedStudentResult"]),
  },
  created() {
    if (!this.DeletedStudentResult.items.data)
      this.$store.dispatch("DeletedStudentResult/index");
  },
  mounted() {},
  methods: {
    init(done) {
      Promise.all([
        this.$store.dispatch("Auth/getAuth"),
        this.$store.dispatch("DeletedStudentResult/index"),
      ]).then((res) => {
        if (done) done();
      });
    },
    onLoad(index, done) {
      this.DeletedStudentResult.items.next_page_url
        ? this.$store.dispatch("DeletedStudentResult/next").then((res) => done())
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
