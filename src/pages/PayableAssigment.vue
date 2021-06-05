<template>
  <div>
    <q-pull-to-refresh @refresh="init">
      <q-header elevated>
        <q-toolbar class="bg-blue">
          <q-icon name="poll" style="font-size: 1.5em" />
          <q-toolbar-title>
            <div class="text-body1">Kandidat Soal Berbayar</div>
          </q-toolbar-title>
          <!-- <q-btn flat round dense @click="$router.push({name:'deletedstudentresult'})">
          <q-icon name="o_auto_delete" />
        </q-btn> -->
        </q-toolbar>
      </q-header>

      <q-page class="scroll overflow-hidden">
        <q-tabs
          v-model="tab"
          narrow-indicator
          dense
          align="justify"
          class="text-primary"
        >
          <q-tab name="question_item" icon="mail" label="Butir Soal"> </q-tab>
          <q-tab name="question_package" icon="alarm" label="Paket Soal">
          </q-tab>
        </q-tabs>

        <div
          v-if="loading"
          class="flex flex-center column self-center"
          style="height:80vh"
        >
          <q-spinner color="grey" size="5.5em" />
        </div>

        <q-infinite-scroll @load="onLoadCheck" :offset="250" style="">
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="question_item" class="q-gutter-xs">
              <!-- <div class="text-h6">Butir Soal Berbayar</div> -->

              <div
                v-for="item in PayableQuestionItem.items.data"
                :key="`payable_question_item-${item.id}`"
              >
                <PaybaleQuestionItem
                  @handleScroll="handleScrollEvent"
                  :id="`question_item-${item.id}`"
                  :ref="`question_item-${item.id}`"
                  :item="item"
                ></PaybaleQuestionItem>
              </div>
              <!-- <q-expansion-item>
              <q-card>
                <q-card-section>
                
                </q-card-section>
              </q-card>
            </q-expansion-item> -->
            </q-tab-panel>

            <q-tab-panel name="question_package">
              <div class="text-h6">Paket Soal Berbayar</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
          </q-tab-panels>
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
import { mapState } from "vuex";
import { scroll } from "quasar";
import EventBus from "../eventBus";

const { getScrollTarget, setScrollPosition } = scroll;

export default {
  props: {
    tabInit: {
      type: String,
      default: "question_item"
    },
    elementId: {
      type: String,
      default: null
    }
  },
  components: {
    PaybaleQuestionItem: () =>
      import("components/assigment/payable/question_item/ItemComponent.vue")
  },
  data() {
    return {
      tab: "question_item",
      loading: false
    };
  },
  computed: {
    ...mapState(["Setting", "PayableQuestionItem", "PayableQuestionPackage"])
  },
  created() {
    this.tab = this.tabInit;
  },
  async mounted() {
    // jika data awal belum diload, maka panggil init()
    if (!this.checkIsDataInitialized(this.tab)) {
      await this.init();
    }
    // jika parameter pertama adalah 'question_item' dan parameter kedua tidak kosong, maka
    if (this.tabInit == "question_item" && this.elementId) {
      const question_list_id = parseInt(this.elementId);
      // jika tidak ada, maka load 1 item tsb, tambah ke state.items.data, kemudian panggil handleScroll()
      if (!this.isExists("question_item", question_list_id)) {
        try {
          const res = await this.$store.dispatch(
            "PayableQuestionItem/getItem",
            question_list_id
          );
          console.log('res',res);
          this.$store.commit("PayableQuestionItem/addTop", res);
        } catch(err) {
          console.log(err);
          this.$q.notify(err);
        }
      }
    }
    // jika parameter pertama adalah 'question_package' dan parameter kedua tidak kosong, maka
    else if (this.tabInit == "question_package" && this.elementId) {
      const assigment_id = parseInt(this.elementId);
      // jika item ada dalam state.items.data, maka panggil handleScroll()
      if (this.isExists("question_package", assigment_id)) {
        // jika tidak ada, maka load 1 item tsb, tambah ke state.items.data, kemudian panggil handleScroll()
        this.handleScroll();
      }
    }
  },
  methods: {
    handleScrollEvent(id) {
      if (id == this.elementId) {
        this.handleScroll();
      }
    },
    checkIsDataInitialized(type = "question_item") {
      if (type == "question_item" && !this.PayableQuestionItem.items.data) {
        return false;
      } else if (
        type == "question_package" &&
        !this.PayableQuestionPackage.items.data
      ) {
        return false;
      }
      return true;
    },
    // cek apakah item ada di state vuex

    isExists(type, id) {
      let item;
      if (type == "question_item") {
        // butir soal
        item = this.PayableQuestionItem.items.data.find(e => e.id == id);
      } else {
        // paket soal
        item = this.PayableQuestionPackage.items.data.find(e => e.id == id);
      }
      if (item) return true;
      return false;
    },
    handleScroll() {
      const ref_id = this.tabInit + "-" + this.elementId;
      const ele = document.getElementById(ref_id); // You need to get your element here
      const ref_child = this.$refs[ref_id];
      console.log("ref_id", ref_id);
      console.log("ele", ele);
      if (!ref_child) return;
      ref_child[0].setExpandable();
      // console.log('ref_id',ref_id)
      console.log("ele", ele);

      setTimeout(() => {
        ele.scrollIntoView();
        // const target = getScrollTarget(ele);
        // console.log('target',target)
        // const offset = ele.offsetTop
        // const duration = 1000;
        // setScrollPosition(target, offset, duration);
      }, 500);
    },
    async init(done) {
      this.loading = true;
      if (this.tab == "question_item") {
        try {
          const res = await this.$store.dispatch("PayableQuestionItem/index");
          return res;
          // this.handleScroll();
        } finally {
          this.loading = false;
          if (done) done();
          return Promise.resolve(false);
        }
      } else {
        try {
          const res = await this.$store.dispatch(
            "PayableQuestionPackage/index"
          );
          return res;
        } finally {
          this.loading = false;
          if (done) done();
          return Promise.resolve(false);
        }
      }
    },
    onLoadQuestionItem(index, done) {
      this.PayableQuestionItem.items.next_page_url
        ? this.$store.dispatch("PayableQuestionItem/next").then(res => done())
        : done();
    },
    onLoadQuestionPackage(index, done) {
      this.PayableQuestionItem.items.next_page_url
        ? this.$store.dispatch("PayableQuestionItem/next").then(res => done())
        : done();
    },
    onLoadCheck(index, done) {
      if (this.tab == "question_item") {
        this.onLoadQuestionItem(index, done);
      } else if (this.tab == "question_package") {
        this.onLoadQuestionPackage(index, done);
      } else {
        done();
      }
    }
  }
};
</script>
