<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-icon name="fa fa-file-alt" style="font-size: 1.5em" />
        <q-toolbar-title>
          <div class="text-body1">Rakit Soal Berprofit</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page>
      <q-form
        class="q-gutter-sm"
        ref="form"
        @submit="storeAssigment"
        style="width: 100%"
      >
        <q-stepper
          v-model="step"
          color="blue"
          style="width: 100%"
          animated
          keep-alive
        >
          <q-step
            :name="1"
            color="blue"
            title="Isi"
            icon="settings"
            :done="step > 1"
          >
            <q-select
              :loading="loading"
              rounded
              color="blue"
              outlined
              dense
              :options="Grade.grades"
              v-model="assigment.grade"
              option-value="id"
              option-label="description"
              label="Kelas"
              :rules="[val => !!val || 'Harus diisi']"
              @input="item => (assigment.grade_id = item.id)"
            />
            <q-select
              :loading="loading"
              rounded
              color="blue"
              outlined
              dense
              option-label="name"
              :option-value="item => item"
              v-model="assigment.assigment_category"
              :options="
                AssigmentCategory.assigment_categories.filter(item => {
                  if (item.id == 4 || item.id == 6 || item.id == 9) {
                    return item;
                  }
                })
              "
              label="Kompetensi"
              :rules="[val => !!val || 'Harus diisi']"
              @input="
                item => {
                  assigment.question_lists = [];
                  $store.commit('Assigment/resetBuildQuestionLists');
                  $store.commit('SuggestedQuestionList/reset');
                  assigment.assigment_category_id = item.id;
                }
              "
            />
            <q-select
              :loading="loading"
              v-if="assigment.assigment_category_id == 9"
              rounded
              color="blue"
              outlined
              dense
              label="Nama Kegiatan Penilaian"
              :options="names"
              v-model="assigment.name"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />
            <q-input
              v-else
              rounded
              color="blue"
              outlined
              dense
              label="Nama Kegiatan Penilaian"
              v-model="assigment_name"
              lazy-rules
              @blur="setAssigmentName"
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-input
              rounded
              color="blue"
              outlined
              dense
              label="Topik"
              v-model="assigment.topic"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-input
              rounded
              color="blue"
              outlined
              dense
              label="Tahun pelajaran"
              v-model="assigment.education_year"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-select
              rounded
              color="blue"
              outlined
              dense
              label="Semester"
              :options="semesters"
              v-model="assigment.semester"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-stepper-navigation>
              <q-btn
                :loading="loading"
                flat
                @click="step2()"
                color="blue"
                label="Lanjut"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Rakit"
            icon="create_new_folder"
            :done="step > 2"
            color="blue"
            style="margin-bottom: 30vh"
          >
            <div v-if="loading" class="row justify-center">
              <q-spinner color="primary" size="3em" />
            </div>
            <div
              v-for="(question_list, ql) in assigment.question_lists"
              :key="ql"
            >
              <div
                v-if="
                  question_list.pivot.assigment_type.description == 'textfield'
                "
              >
                <build-text-question-component
                  @removeQuestionList="
                    index => {
                      assigment.question_lists.splice(index, 1);
                    }
                  "
                  :question_list="question_list"
                  :ql="ql"
                ></build-text-question-component>
              </div>
              <div
                v-if="
                  question_list.pivot.assigment_type.description ==
                    'selectoptions'
                "
              >
                <build-selectoptions-question-component
                  @removeQuestionList="
                    () => {
                      assigment.question_lists.splice(ql, 1);
                    }
                  "
                  :question_list="question_list"
                  :ql="ql"
                ></build-selectoptions-question-component>
              </div>
              <div
                v-if="
                  question_list.pivot.assigment_type.description == 'textarea'
                "
              >
                <build-text-question-component
                  @removeQuestionList="
                    () => {
                      assigment.question_lists.splice(ql, 1);
                    }
                  "
                  :question_list="question_list"
                  :ql="ql"
                ></build-text-question-component>
              </div>
            </div>

            <q-stepper-navigation>
              <div
                class="row justify-between q-pb-md text-body2"
                v-if="
                  !Assigment.build.question_lists ||
                    Assigment.build.question_lists.length == 0
                "
              >
                Soal masih kosong. Silahkan klik Tambah Soal
              </div>
              <div class="row justify-between">
                <q-btn
                  flat
                  dense
                  @click="step = 1"
                  color="blue"
                  label="Back"
                  class="q-ml-sm"
                />
                <q-btn
                  color="blue"
                  rounded
                  label="Tambah Soal"
                  @click="
                    () => {
                      //search.display = true;
                      $router.push('addpayablequestionlists');
                      //$forceUpdate();
                    }
                  "
                />
                <q-btn
                  v-if="
                    assigment.question_lists && assigment.question_lists.length
                  "
                  flat
                  @click="
                    () =>
                      $refs.form
                        .validate()
                        .then(success => (success ? (step = 3) : null))
                  "
                  color="blue"
                  label="Lanjut"
                />
              </div>
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" color="blue" title="Finish" icon="add_comment">
            <div class="row justify-center">
              <div class="row">
                <div class="col-12">
                  <div class="text-h6 text-primary text-center">
                    Apakah Anda yakin diterbitkan?
                  </div>
                  <div class="text-body text-grey text-center">
                    Pastikan soal yang Anda buat sudah benar
                  </div>
                </div>
              </div>
              <div class="row q-pa-md">
                <div class="col-12">
                  <q-btn
                    :loading="loading"
                    :disabled="loading"
                    outline
                    rounded
                    size="20px"
                    color="blue"
                    icon="publish"
                    label="Terbitkan"
                    type="submit"
                  />
                </div>
              </div>
            </div>

            <q-stepper-navigation>
              <div class="row justify-between">
                <q-btn
                  flat
                  @click="step = 2"
                  color="blue"
                  label="Back"
                  class="q-ml-sm"
                />
              </div>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-form>
    </q-page>
    <!--<q-dialog v-model="search.display" full-width full-height>
      <q-card>
        <q-card-section>
          <q-infinite-scroll @load="onLoad" :offset="250">
            <div class="q-pa-none q-gutter-y-xs">
              <div class="row justify-between">
                <div class="text-body1 text-blue">Soal terkait</div>
                <q-btn
                  icon="close"
                  color="blue"
                  flat
                  @click="
                    () => {
                      search.display = false;
                      init();
                    }
                  "
                />
              </div>
              <q-intersection
                v-for="assigment in SuggestedQuestionList.items.data"
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
    </q-dialog>-->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { debounce } from "quasar";

export default {
  props: {
    _step: null
  },
  data() {
    return {
      assigment_name: "",
      loading: false,
      step: 1,
      assigment: {
        is_paid: true,
        is_publish: true,
        isTimer: false,
        isExpire: false,
        isPassword: false,
        is_public: true,
        grade_id: null
      },
      search: {
        dispay: false,
        key: ""
      },
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
    BuildTextQuestionComponent: () =>
      import("components/assigment/build/TextQuestionComponent.vue"),
    BuildSelectoptionsQuestionComponent: () =>
      import("components/assigment/build/SelectOptionsQuestionComponent.vue")
    //UnpublishItemComponent: () =>import("components/assigment/unpublish/ItemComponent.vue")
  },
  computed: {
    ...mapState([
      "Grade",
      "Auth",
      "AssigmentCategory",
      "Setting",
      "Assigment",
      "SuggestedQuestionList"
    ])
  },
  watch: {
    assigment: {
      handler: function() {
        console.log("setBuild ", this.assigment);
        // console.log(this.assigment.name);
        this.setBuild();
        // this.$store.commit("Assigment/setBuild", {
        //   build: this.assigment
        // });
      },
      deep: true
    }
  },
  created() {
    if (this._step) {
      this.step = this._step;
    }

    this.setBuild = debounce(this.setBuild, 500);

    // jika ada soal biasa dgn question_lists>0, tampilkan dialog konfirmasi
    if (this.IsEmptyAssigmentQuestionLists()) {
      this.$store.commit("Assigment/setIsPaid", true);
      //set auth
      this.loading = true;
      this.initAssigment();
    } else {
      this.$q
        .dialog({
          title: "Konfirmasi",
          cancel: {
            label: "Tidak",
            flat: true
          },
          ok: {
            label: "Ya, Lanjutkan",
            flat: true,
            outline: true
          },

          message:
            "Ada Rakit Soal Non-profit yang belum Anda submit sebelumnya. Lanjutkan rakit soal non-profit?"
        })
        .onOk(() => {
          // lanjutkan merakit soal berprofit
          this.$router.push("build");
        })
        .onCancel(() => {
          // jgn lanjutkan merakit soal biasa, jadi hapus semua butir soal
          this.$store.commit("Assigment/resetBuild", { is_paid: true });

          // this.$store.commit("Assigment/setIsPaid", true);
          //set auth
          this.loading = true;
          this.initAssigment();
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
  },
  mounted() {
    //console.log(this.assigment)
    if (this.Assigment.build.name)
      this.assigment_name = this.Assigment.build.name;
    //this.getQuestionLists = debounce(this.getQuestionLists, 500);
  },
  methods: {
    //debounce,
    initAssigment() {
      // dispatch Auth/getAuth di paling awal agar mengupdate Auth.auth.profile
      this.$store.dispatch("Auth/getAuth").then(() => {
        //dispatch Grade/index diurutan ke-2 karena action ini mengambil Auth.auth.profile.education_level_id
        this.$store.dispatch("Grade/index").finally(() => {
          this.loading = false;
          this.$store.dispatch("AssigmentCategory/index").then(() => {
            this.init();
          });
        });
      });
    },
    IsEmptyAssigmentQuestionLists() {
      if (
        !this.Assigment.build.is_paid &&
        this.Assigment.build.question_lists.length
      ) {
        return false;
      }
      return true;
    },
    setBuild() {
      this.$store.commit("Assigment/setBuild", {
        build: this.assigment
      });
    },
    step2() {
      this.init();
      // this.getSuggestedQuestionLists();
      this.$refs.form
        .validate()
        .then(success => (success ? (this.step = 2) : null));
      //this.$forceUpdate();
    },
    setAssigmentName() {
      if (this.assigment_name.trim() != "") {
        this.assigment.name = this.assigment_name;
      }
    },
    init() {
      //jika build.educational_level_id beda dgn Auth.profile.educational_level_id, maka Reset
      if (
        this.Assigment.build.grade &&
        this.Assigment.build.grade.educational_level_id !=
          this.Auth.auth.profile.educational_level_id
      ) {
        console.log("reset karena education_level_id berbeda");
        this.$store.commit("Assigment/resetBuild");
      }
      this.assigment = {
        ...this.Assigment.build
      };
      console.log("init ");
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
      this.$store.commit("Assigment/setBuild", {
        build: this.assigment
      });
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
            .dispatch("Assigment/storeBuild", this.assigment)
            .then(res => {
              // this.$store.commit('Assigment/addPublish',{publish:res.data})
              this.$store.commit("Assigment/resetBuild");
              this.$q.notify("Berhasil menerbitkan Paket Soal.");
            })
            .catch(err => {
              console.log(err);
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
    getSuggestedQuestionLists() {
      this.$store.dispatch("SuggestedQuestionList/index", {
        assigment_category_id: this.assigment.assigment_category_id,
        educational_level_id: this.Auth.auth.profile.educational_level_id
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
