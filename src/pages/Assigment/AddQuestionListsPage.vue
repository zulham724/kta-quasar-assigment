<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-icon
          name="keyboard_backspace"
          style="font-size: 1.5em;"
          clickable
          @click="$router.push({ name: 'build', params: { _step: 2 } })"
        />
        <q-toolbar-title>
          <div class="text-body1">Tambah Soal</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page>
      <q-card>
        <q-card-section>
          <q-infinite-scroll @load="onLoad" :offset="250">
            <div class="q-pa-none q-gutter-y-xs">
              <div class="row q-gutter-sm">
                <div class="col">
                  <q-input
                      v-model="search"
                      dense
                      placeholder="Cari topik soal"
                      filled
                      type="search"
                      hint="contoh: rukun islam"
                      @input="onSearch"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                </div>
                <div class="col">
                <q-select
                dense
                label="Tampilkan soal"
                :options="options"
                 option-value="id"
                option-label="description"
                v-model="grade"
                />
                </div>
              </div>

              <div class="row justify-between">
                <div class="text-body1 text-blue">Soal terkait</div>
              </div>

              <div v-if="!SuggestedQuestionList.items.data">
                <q-item style="max-width: 300px" v-for="n in 5" :key="n">
                  <q-item-section avatar>
                    <q-skeleton type="QAvatar" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton type="text" />
                    </q-item-label>
                    <q-item-label caption>
                      <q-skeleton type="text" width="90%" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <q-intersection
                v-for="assigment in getFilteredQuestionList"
                :style="`min-height: 20vw;`"
                :key="assigment.id"
              >
                <unpublish-item-component
                  :assigment="assigment"
                ></unpublish-item-component>
              </q-intersection>
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { debounce } from "quasar";

export default {
  data() {
    return {
      loading: false,
      assigment: {
        is_publish: true,
        isTimer: false,
        isExpire: false,
        isPassword: false,
        is_public: true,
        grade_id: null
      },
      grade:{id:0,description:'Semua kelas'},
      options:[{id:0,description:'Semua kelas'}],
      search: "",
      question_lists: [],
      semesters: ["Gasal", "Genap"],
      names: [
        "Penilaian Harian",
        "Penilaian Tengah Semester",
        "Penilaian Akhir Semester",
        "Penilaian Akhir Tahun",
        "Ujian Sekolah",
        "Try Out"
      ]
    };
  },
  components: {
    UnpublishItemComponent: () =>
      import("components/assigment/unpublish/ItemComponent.vue")
  },
  computed: {
    ...mapState([
      "Grade",
      "Auth",
      "AssigmentCategory",
      "Setting",
      "Assigment",
      "SuggestedQuestionList"
    ]),
    getFilteredQuestionList(){
      if(this.grade.id==0)return this.SuggestedQuestionList.items.data;
      else return this.SuggestedQuestionList.items.data.filter(item=>{
        return item.grade.id==this.grade.id;
      });
    }
  },
  watch: {
    assigment: {
      handler: function() {
        this.$store.commit("Assigment/setBuild", { build: this.assigment });
      },
      deep: true
    }
  },
  created() {
    //this.init();
    this.getSuggestedQuestionLists();
    this.onSearch = debounce(this.onSearch, 500);
    this.options = [...this.options, ...this.Grade.grades]
    //this.$store.dispatch("AssigmentCategory/index");
    //this.getQuestionLists = debounce(this.getQuestionLists, 500);
  },
  methods: {
    debounce,
    onSearch() {
      this.getSuggestedQuestionLists(this.search);
    },
    step2() {
      this.init();
      this.getSuggestedQuestionLists();
    },
    init() {
      this.assigment = {
        ...this.Assigment.build
      };
      console.log(this.assigment);
      if (this.Grade.grades.length == 0) this.$store.dispatch("Grade/index");
      //this.$forceUpdate();
    },
    addQuestionList(assigment_type) {
      if (!this.assigment.question_lists) this.assigment.question_lists = [];

      this.assigment.question_lists.push({
        name: "",
        description: "",
        pivot: {
          creator_id: this.Auth.auth.id,
          user_id: this.Auth.auth.id,
          assigment_type: assigment_type,
          assigment_type_id: assigment_type.id
        },
        answer_lists: [
          {
            name: "",
            value: 100
          }
        ]
      });
      this.$forceUpdate();
    },
    addSelectedQuestionList(question_list) {
      if (!this.assigment.question_lists) this.assigment.question_lists = [];

      this.assigment.question_lists.push({
        name: question_list.name,
        description: question_list.description,
        pivot: {
          creator_id: question_list.assigments.length
            ? question_list.assigments[0].pivot.creator_id
            : null,
          user_id: question_list.assigments.length
            ? question_list.assigments[0].pivot.user_id
            : null,
          assigment_type: question_list.assigments.length
            ? question_list.assigments[0].pivot.assigment_type
            : null,
          assigment_type_id: question_list.assigments.length
            ? question_list.assigments[0].pivot.assigment_type_id
            : null
        },
        answer_lists: question_list.answer_lists
      });
      this.$store.commit("Assigment/setBuild", { build: this.assigment });
      this.$forceUpdate();
    },
    storeAssigment() {
      //console.log(this.assigment);return;
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$q.notify("Tunggu");
          this.$router.push("/");
          this.$store
            .dispatch("Assigment/store", this.assigment)
            .then(res => {
              // this.$store.commit('Assigment/addPublish',{publish:res.data})
              this.$store.commit("Assigment/resetBuild");
              this.$q.notify("Berhasil menerbitkan Paket Soal.");
            })
            .catch(err => {
              this.$q.notify("Terjadi kesalahan");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
      return false;
    },
    getQuestionLists(key) {
      if (key)
        this.$store.dispatch(`QuestionList/search`, key).then(res => {
          this.question_lists = res.data;
        });

      this.$forceUpdate();
    },
    getSuggestedQuestionLists(search) {
      if (
        !this.Assigment.build.assigment_category_id ||
        !this.Assigment.build.grade.educational_level_id
      ) {
        return this.$router.push({ name: "build" });
      }
      this.$store.dispatch("SuggestedQuestionList/index", {
        assigment_category_id: this.Assigment.build.assigment_category_id,
        educational_level_id: this.Assigment.build.grade.educational_level_id,
        search: search
      });
    },
    onLoad(index, done) {
      this.SuggestedQuestionList.items.next_page_url
        ? this.$store.dispatch("SuggestedQuestionList/next").then(res => done())
        : done();
    }
  }
};
</script>

<style></style>
