<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-btn flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body1">Edit</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page>
      <div v-if="loading_question_lists">
        <div class="flex flex-center column self-center" style="height: 80vh">
          <q-spinner color="grey" size="5.5em" />
        </div>
      </div>
      <q-form class="q-gutter-sm" ref="form" v-if="!loading_question_lists">
        <q-stepper v-model="step" color="primary" style="width: 100%" animated>
          <q-step :name="1" title="Isi" icon="settings" :done="step > 1">
            <q-select
              rounded
              outlined
              dense
              :options="Grade.grades"
              v-model="assigment.grade"
              option-value="id"
              option-label="description"
              label="Kelas"
              :rules="[(val) => !!val || 'Harus diisi']"
              @input="(item) => (assigment.grade_id = item.id)"
            />
            <q-select
              rounded
              outlined
              dense
              option-label="name"
              :option-value="(item) => item"
              v-model="assigment.assigment_category"
              :options="AssigmentCategory.assigment_categories"
              label="Kompetensi"
              :rules="[(val) => !!val || 'Harus diisi']"
              @input="
                (item) => {
                  assigment.question_lists = [];
                  assigment.assigment_category_id = item.id;
                }
              "
            />
            <q-input
              rounded
              outlined
              dense
              label="Kompetensi Dasar"
              v-model="assigment.topic"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
            />
            <q-input
              rounded
              outlined
              dense
              label="Materi"
              v-model="assigment.subject"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
            />
            <q-input
              rounded
              outlined
              dense
              label="Indikator"
              v-model="assigment.indicator"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-stepper-navigation>
              <q-btn
                flat
                @click="
                  () =>
                    $refs.form.validate().then((success) => (success ? (step = 2) : null))
                "
                color="primary"
                label="Lanjut"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Rakit soal"
            icon="create_new_folder"
            :done="step > 2"
            style="margin-bottom: 30vh"
          >
            <div v-for="(question_list, ql) in assigment.question_lists" :key="ql">
              <div v-if="question_list.pivot.assigment_type.description == 'textfield'">
                <!--soal jawaban singkat-->
                <edit-text-question-component
                  :ql="ql"
                  @resetQuestionList="resetQuestionList"
                  :question_list="question_list"
                ></edit-text-question-component>
              </div>
              <div
                v-if="question_list.pivot.assigment_type.description == 'selectoptions'"
              >
                <!--soal pilihan ganda-->
                <edit-select-options-question-component
                  @resetQuestionList="resetQuestionList"
                  :ql="ql"
                  :question_list="question_list"
                ></edit-select-options-question-component>
              </div>
              <div v-if="question_list.pivot.assigment_type.description == 'textarea'">
                <!--soal jawaban uraian-->
                <edit-text-question-component
                  @resetQuestionList="resetQuestionList"
                  :ql="ql"
                  :question_list="question_list"
                ></edit-text-question-component>
              </div>
            </div>

            <q-stepper-navigation>
              <div class="row justify-between">
                <q-btn
                  flat
                  dense
                  @click="step = 1"
                  color="primary"
                  label="Back"
                  class="q-ml-sm"
                />

                <q-btn
                  v-if="assigment.question_lists && assigment.question_lists.length"
                  flat
                  @click="
                    () =>
                      $refs.form
                        .validate()
                        .then((success) => (success ? (step = 3) : null))
                  "
                  color="primary"
                  label="Lanjut"
                />
              </div>
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Selesai" icon="add_comment">
            <q-toggle
              v-model="assigment.isTimer"
              label="Aktifkan untuk set timer ketika mengerjakan soal"
            ></q-toggle>
            <q-input
              v-if="assigment.isTimer"
              type="number"
              rounded
              outlined
              dense
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
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
              outlined
              dense
              lazy-rules
              v-model="assigment.start_at"
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
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
                    <q-time
                      v-model="assigment.start_at"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              v-if="assigment.isExpire"
              rounded
              outlined
              dense
              lazy-rules
              v-model="assigment.end_at"
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
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
                    <q-time
                      v-model="assigment.end_at"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-toggle
              v-model="assigment.isPassword"
              label="Aktifkan untuk mengunci soal"
            />
            <q-input
              v-if="assigment.isPassword"
              v-model="assigment.password"
              type="password"
              rounded
              outlined
              dense
              class="q-mb-sm"
              label="Kunci Penilaian"
            />

            <q-input
              class="q-mb-lg"
              type="textarea"
              outlined
              rounded
              v-model="assigment.description"
              label="Tulis sesuatu untuk disampaikan kepada guru"
              hint="contoh: Silahkan dilihat jangan lupa like dan komentarnya"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-input
              class="q-mb-lg"
              type="textarea"
              outlined
              rounded
              v-model="assigment.note"
              label="Tulis sesuatu untuk disampaikan kepada murid"
              hint="contoh: Perhatikan soal dengan baik dan juga jangan sampai telat mengerjakan karena ada batas waktu"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-stepper-navigation>
              <div class="row justify-between">
                <q-btn
                  flat
                  @click="step = 2"
                  color="primary"
                  label="Back"
                  class="q-ml-sm"
                />
                <q-btn
                  :loading="loading"
                  :disabled="loading"
                  label="Terbitkan"
                  outline
                  rounded
                  type="submit"
                  color="primary"
                  @click="updateAssigment()"
                />
              </div>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-form>
    </q-page>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import EditTextQuestionComponent from "../../components/assigment/edit/TextQuestionComponent";
import EditSelectOptionsQuestionComponent from "../../components/assigment/edit/SelectOptionsQuestionComponent";
export default {
  components: {
    EditTextQuestionComponent,
    EditSelectOptionsQuestionComponent,
  },
  props: {
    assigmentId: null,
  },
  data() {
    return {
      loading_question_lists: true,
      loading: false,
      step: 1,
      assigment: {
        isExpire: false,
        isPassword: false,
        isTimer: false,
        grade_id: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState(["Grade", "Auth", "AssigmentCategory", "Setting"]),
  },
  created() {
    if (this.Grade.grades.length == 0) this.$store.dispatch("Grade/index");
    this.$store.dispatch("AssigmentCategory/index");
  },
  methods: {
    resetQuestionList(index) {
      const original = this.assigment.original_question_lists[index];
      this.assigment.question_lists[index].name = original.name;
      this.assigment.question_lists[index].images = [...original.images];
      // let answer_lists = this.assigment.question_lists[index].answer_lists;
      this.assigment.question_lists[index].answer_lists = [
        ...original.answer_lists.map((e) => {
          return { ...e, images: [...e.images] };
        }),
      ];
      // for (let i = 0; i < answer_lists.length; i++) {
      //   answer_lists[i] = { ...original.answer_lists[i] };
      //   answer_lists[i].images = [...original.answer_lists[i].images];
      // }
      // original.images.forEach((image) => {
      //   this.assigment.question_lists[index].images.push(image);
      // });
      // this.assigment.question_lists[index].images

      //   JSON.stringify(this.assigment.original_question_lists[index])
      // );
      // console.log("resetQuestionList", this.assigment.question_lists[index]);
    },
    async init() {
      try {
        this.loading_question_lists = true;
        const res = await this.$store.dispatch("Assigment/show", this.assigmentId);
        this.assigment = res.data;

        this.assigment.isTimer = this.assigment.isTimer ? true : false;
        this.assigment.isExpire = this.assigment.isExpire ? true : false;
        this.assigment.isPassword = this.assigment.isPassword ? true : false;
        this.assigment.password = null;

        this.assigment.original_question_lists = [];
        for (let i = 0; i < this.assigment.question_lists.length; i++) {
          // deep copy object dgn menggunakan json parse
          this.assigment.original_question_lists[i] = JSON.parse(
            JSON.stringify(this.assigment.question_lists[i])
          );
        }
        console.log("assigment", this.assigment);
        this.loading_question_lists = false;
        return Promise.resolve(1);
      } catch (err) {
        this.$q.notify(err.message);
        return Promise.reject(0);
      }
    },
    addQuestionList(assigment_type) {
      if (!this.assigment.question_lists) this.assigment.question_lists = [];
      console.log("babi");
      this.assigment.question_lists.push({
        name: "",
        description: "",
        pivot: {
          creator_id: this.Auth.auth.id,
          user_id: this.Auth.auth.id,
          assigment_type: assigment_type,
          assigment_type_id: assigment_type.id,
        },
        answer_lists: [
          {
            name: "",
            value: 100,
          },
        ],
      });
      this.$forceUpdate();
    },
    async updateAssigment() {
      try {
        const success = await this.$refs.form.validate();
        if (success) {
          this.loading = true;
          this.$q.notify("Tunggu");
          let res = await this.$store.dispatch("Assigment/update", this.assigment);
          res = await this.$store.dispatch("Auth/getAuth");
          this.$q.notify("Berhasil memperbarui soal");
          this.$router.push("/");
        }
      } catch (err) {
        this.$q.notify(err.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
