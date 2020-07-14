<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-cyan-7">
        <q-btn flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body1">Bagikan Soal</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-form class="q-gutter-sm" ref="form">
      <q-stepper v-model="step" color="cyan-7" style="width: 100vw;" animated keep-alive>
        <q-step :name="1" color="cyan-7" title="Isi" icon="settings" :done="step > 1">
          <q-select
            rounded
            color="cyan-7"
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
            rounded
            color="cyan-7"
            outlined
            dense
            option-label="name"
            :option-value="item => item"
            v-model="assigment.assigment_category"
            :options="AssigmentCategory.assigment_categories.filter(item=>{
              if(item.id == 4 || item.id == 6 || item.id == 9 ){
                return item
              }
            })"
            label="Kompetensi"
            :rules="[val => !!val || 'Harus diisi']"
            @input="
              item => {
                assigment.question_lists = []
                $store.commit('Assigment/resetBuildQuestionLists')
                assigment.assigment_category_id = item.id;
              }
            "
          />
          <q-select
            v-if="assigment.assigment_category_id == 9"
            rounded
            color="cyan-7"
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
            color="cyan-7"
            outlined
            dense
            label="Nama Kegiatan Penilaian"
            v-model="assigment.name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />

          <q-input
            rounded
            color="cyan-7"
            outlined
            dense
            label="Tahun pelajaran"
            v-model="assigment.education_year"
            lazy-rules
            disable
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />

          <q-select
            rounded
            color="cyan-7"
            outlined
            dense
            label="Semester"
            :options="semesters"
            v-model="assigment.semester"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />

          <q-stepper-navigation>
            <q-btn flat @click="step2()" color="cyan-7" label="Lanjut" />
          </q-stepper-navigation>
        </q-step>


        <q-step :name="2" color="cyan-7" title="Finish" icon="add_comment">
          <q-toggle
            v-model="assigment.isTimer"
            label="Aktifkan untuk set timer ketika mengerjakan soal"
          ></q-toggle>
          <q-input
            v-if="assigment.isTimer"
            type="number"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Timer dalam menit"
            v-model="assigment.timer"
          />
          <q-toggle
            v-model="assigment.isExpire"
            label="Aktifkan tanggal berlaku untuk soal? Seperti ketika anda ingin membuat soal ujian yang hanya bisa diisi/dibuka pada hari dan jam tertentu"
          />
          <q-input
            v-if="assigment.isExpire"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            v-model="assigment.start_at"
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Dari"
            disabled
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="assigment.start_at" mask="YYYY-MM-DD HH:mm" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="assigment.start_at" mask="YYYY-MM-DD HH:mm" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-if="assigment.isExpire"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            v-model="assigment.end_at"
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Sampai"
            disabled
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="assigment.end_at" mask="YYYY-MM-DD HH:mm" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="assigment.end_at" mask="YYYY-MM-DD HH:mm" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-toggle v-model="assigment.isPassword" label="Aktifkan untuk mengunci soal" />
          <q-input
            v-if="assigment.isPassword"
            v-model="assigment.password"
            type="password"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Kunci Penilaian"
          />

        <q-input
            outlined
            rounded
            color="cyan-7"
            v-model="assigment.grade_code"
            label="Kode kelas"
            hint=""
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />

          <q-input
            class="q-mb-lg"
            type="textarea"
            outlined
            rounded
            color="cyan-7"
            v-model="assigment.note"
            label="Tulis sesuatu untuk murid"
            hint="contoh: Perhatikan soal dengan baik dan juga jangan sampai telat mengerjakan karena ada batas waktu"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
            

          <q-stepper-navigation>
            <div class="row justify-between">
              <q-btn flat @click="step = 1" color="cyan-7" label="Back" class="q-ml-sm" />
              <q-btn
                :loading="loading"
                :disabled="loading"
                label="Bagikan"
                outline
                rounded
                type="submit"
                color="cyan-7"
                @click="shareAssigment()"
              />
            </div>
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>

    <q-dialog v-model="search.display" full-width full-height>
      <q-card>
        <q-card-section>
          <q-infinite-scroll @load="onLoad" :offset="250">
            <div class="q-pa-none">
              <div class="row justify-between">
                <div class="text-body1 text-cyan-7">Soal terkait</div>
                <q-btn
                  icon="close"
                  color="cyan-7"
                  flat
                  @click="()=>{
                search.display = false
                init()
              }"
                />
              </div>
              <q-intersection
                v-for="(assigment) in SuggestedQuestionList.items.data"
                :style="`min-height: 20vw;`"
                :key="assigment.id"
              >
                <unpublish-item-component :assigment="assigment"></unpublish-item-component>
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
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { debounce } from "quasar";

export default {
props: {
    assigmentId: null
  },
  data() {
    return {
      loading: false,
      step: 1,
      assigment: null,
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
    UnpublishItemComponent: () =>
      import("components/assigment/unpublish/ItemComponent.vue")
  },
  computed: {
    ...mapState(["Grade", "Auth", "AssigmentCategory", "Setting", "Assigment",'SuggestedQuestionList'])
  },
//   watch: {
//     assigment: {
//       handler: function() {
//         this.$store.commit("Assigment/setBuild", { build: this.assigment });
//       },
//       deep: true
//     }
//   },
  created() {
    this.init();
    this.$store.dispatch("AssigmentCategory/index");
    //this.getQuestionLists = debounce(this.getQuestionLists, 500);
  },
  methods: {
    debounce,
    step2() {
        this.step=2
        // this.$refs.form
        //     .validate()
        //     .then(success => {
        //        if(success){
        //            console.log('asu')
        //            this.step=2
        //        }
        //        else console.log('asda')
        //     });
        // this.$forceUpdate();
        // console.log(this.assigment);
    },
    init() {
      this.assigment = {
          id:this.assigmentId,
        ...this.Assigment.build
      };
      delete this.assigment.question_lists;
      console.log(this.assigment)
      if (this.Grade.grades.length == 0) this.$store.dispatch("Grade/index");
      this.$forceUpdate();
    },
    // addQuestionList(assigment_type) {
    //   if (!this.assigment.question_lists) this.assigment.question_lists = [];

    //   this.assigment.question_lists.push({
    //     name: "",
    //     description: "",
    //     pivot: {
    //       creator_id: this.Auth.auth.id,
    //       user_id: this.Auth.auth.id,
    //       assigment_type: assigment_type,
    //       assigment_type_id: assigment_type.id
    //     },
    //     answer_lists: [
    //       {
    //         name: "",
    //         value: 100
    //       }
    //     ]
    //   });
    //   this.$forceUpdate();
    // },
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
    shareAssigment() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$q.notify("Tunggu");
          //this.$router.push("/");
          this.$store.dispatch("Assigment/share", this.assigment)
            .then(res => {
              // this.$store.commit('Assigment/addPublish',{publish:res.data})
              //this.$store.commit("Assigment/resetBuild");
              
              this.$q.dialog({
                title: 'Berhasil dibagikan',
                message: `Silahkan salin kode soal berikut: <b>${res.data.code}</b><br><div class='text-caption'>Paket soal yang telah dibuat dapat dilihat di menu Hasil</div>`,
                html: true
                }).onOk(() => {
                    this.$router.push("/");
                }).onCancel(() => {
                     this.$router.push("/");
                }).onDismiss(() => {
                    this.$router.push("/");
                })
              //this.$q.notify("Berhasil membagikan Paket Soal");
            })
            .catch(err => {
              this.$q.notify("Terjadi kesalahan");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    getQuestionLists(key) {
      if (key)
        this.$store.dispatch(`QuestionList/search`, key).then(res => {
          this.question_lists = res.data;
        });

      this.$forceUpdate();
    },
    getSuggestedQuestionLists() {
      this.$store
        .dispatch("SuggestedQuestionList/index", {
          assigment_category_id: this.assigment.assigment_category_id,
          educational_level_id: this.Auth.auth.profile.educational_level_id
        })
    },
    onLoad(index,done){
      this.SuggestedQuestionList.items.next_page_url
        ? this.$store.dispatch("SuggestedQuestionList/next").then(res => done())
        : done();
    },
  }
};
</script>

<style></style>
