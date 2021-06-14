<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-icon name="add" style="font-size: 1.5em" />
        <q-toolbar-title>
          <div class="text-body1">Buat Soal</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page>
      <q-form class="q-gutter-sm" ref="form" style="width: 100%">
        <q-stepper v-model="step" color="blue" style="width: 100%" animated>
          <q-step
            :name="1"
            title="Isi"
            color="blue"
            icon="settings"
            :done="step > 1"
          >
            <q-select
              rounded
              outlined
              dense
              color="blue"
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
              color="blue"
              outlined
              dense
              option-label="name"
              :option-value="item => item"
              v-model="assigment.assigment_category"
              :options="
                AssigmentCategory.assigment_categories.filter(
                  item => item.id != 9
                )
              "
              label="Kompetensi"
              :rules="[val => !!val || 'Harus diisi']"
              @input="
                item => {
                  assigment.question_lists = [];
                  assigment.assigment_category_id = item.id;
                }
              "
            />
            <q-input
              rounded
              color="blue"
              outlined
              dense
              label="Kompetensi Dasar"
              v-model="assigment.topic"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />
            <q-input
              rounded
              color="blue"
              outlined
              dense
              autogrow
              label="Materi"
              v-model="assigment.subject"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />
            <q-input
              rounded
              color="blue"
              outlined
              dense
              autogrow
              label="Indikator"
              v-model="assigment.indicator"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            />

            <q-stepper-navigation>
              <q-btn
                flat
                @click="
                  () =>
                    $refs.form
                      .validate()
                      .then(success => (success ? (step = 2) : null))
                "
                color="blue"
                label="Lanjut"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Buat"
            icon="create_new_folder"
            :done="step > 2"
            style="margin-bottom: 30vh"
            color="blue"
          >
            <div
              v-for="(question_list, ql) in assigment.question_lists"
              :key="ql"
            >
              <div
                v-if="
                  question_list.pivot.assigment_type.description == 'textfield'
                "
              >
                <!--soal jawaban singkat-->
                <create-text-question-component
                  :ql="ql"
                  :question_list="question_list"
                  @deleteQuestionList="deleteQuestionList"
                  @addAudioToQuestionList="addAudioToQuestionList"
                  @removeAudio="removeAudio"
                ></create-text-question-component>
              </div>
              <div
                v-if="
                  question_list.pivot.assigment_type.description ==
                    'selectoptions'
                "
              >
                <!--soal pilihan ganda-->
                <create-select-options-question-component
                  :ql="ql"
                  :question_list="question_list"
                  @deleteQuestionList="deleteQuestionList"
                  @addAudioToQuestionList="addAudioToQuestionList"
                  @removeAudio="removeAudio"
                ></create-select-options-question-component>
              </div>
              <div
                v-if="
                  question_list.pivot.assigment_type.description == 'textarea'
                "
              >
                <!--soal jawaban uraian-->
                <create-text-question-component
                  :ql="ql"
                  :question_list="question_list"
                  @deleteQuestionList="deleteQuestionList"
                  @addAudioToQuestionList="addAudioToQuestionList"
                  @removeAudio="removeAudio"
                ></create-text-question-component>
              </div>
            </div>

            <q-stepper-navigation>
              <div class="row justify-between">
                <q-btn
                  flat
                  dense
                  @click="step = 1"
                  color="blue"
                  label="Back"
                  class="q-ml-sm"
                />
                <div v-if="assigment.assigment_category">
                  <!--jika ada question_lists, maka hanya tampilkan 1 button-->
                  <div
                    v-if="
                    assigment_type &&
                      assigment.question_lists &&
                        assigment.question_lists.length
                    "
                  >
                    <q-btn
                      flat
                      color="primary"
                      label="Tambah Butir soal"
                      @click="addQuestionList(assigment_type)"
                      outline
                      rounded
                    ></q-btn>
                  </div>

                  <div v-else>
                    <q-fab
                      flat
                      color="primary"
                      label="Butir soal"
                      outline
                      rounded
                      direction="down"
                    >
                      <div
                        v-for="assigment_type in assigment.assigment_category
                          .assigment_types"
                        :key="assigment_type.id"
                      >
                        <q-fab-action
                          color="primary"
                          icon="list"
                          :label="assigment_type.name"
                          @click="addQuestionList(assigment_type)"
                        />
                      </div>
                    </q-fab>
                  </div>
                </div>

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

          <q-step :name="3" title="Finish" color="blue" icon="add_comment">
            <div class="row justify-center">
              <q-btn
                :loading="loading"
                :disabled="loading"
                outline
                rounded
                size="35px"
                color="blue"
                icon="publish"
                label="Terbitkan"
                type="submit"
                @click="storeAssigment($event)"
              />
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
      <!-- <q-btn @click="test">test</q-btn> -->
    </q-page>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CreateTextQuestionComponent from "../components/assigment/create/TextQuestionComponent";
import CreateSelectOptionsQuestionComponent from "../components/assigment/create/SelectOptionsQuestionComponent";
import EditorComponent from "../components/Editor/EditorComponent";
export default {
  components: {
    EditorComponent,
    CreateTextQuestionComponent,
    CreateSelectOptionsQuestionComponent
  },
  data() {
    return {
      assigment_type: null,
      config: {
        placeholderText: "Tulis soal Anda di sini",
        tableStyles: {
          "fr-dashed-borders": "Dashed Borders",
          "fr-alternate-rows": "Alternate Rows"
        },
        events: {
          initialized: function() {
            console.log("initialized");
          }
        }
      },
      loading: false,
      step: 1,
      assigment: {
        isExpire: false,
        isPassword: false,
        isTimer: false,
        grade_id: null,
        question_lists: []
      }
    };
  },
  computed: {
    ...mapState(["Grade", "Auth", "AssigmentCategory", "Setting"])
  },
  created() {
    if (this.Grade.grades.length == 0) this.$store.dispatch("Grade/index");
    this.$store.dispatch("AssigmentCategory/index");
  },
  mounted() {},
  methods: {
    deleteQuestionList(ql) {
      //ql=index question_list
      this.assigment.question_lists.splice(ql, 1);
      //this.$forceUpdate()
    },
    removeAudio(ql) {
      this.assigment.question_lists[ql].audio = {};
    },
    addAudioToQuestionList({ audio, ql }) {
      //ql=index question_list
      this.assigment.question_lists[ql].audio = audio;
      console.log("ql =", ql);
      console.log(audio.file.localURL);
    },
    recordAudio(index) {
      let vm = this;
      console.log(index);
      //this.assigment.question_lists[index]
      navigator.device.audiorecorder.recordAudio(
        //membuka audio recoder
        function(data) {
          //data adalah hasil dri record
          console.log(data);
          const obj = JSON.parse(data);
          console.log(obj.full_path);

          //membaca file hasil record audio
          window.resolveLocalFileSystemURL(
            "file://" + obj.full_path,
            function(entry) {
              entry.file(
                function(file) {
                  //tambah object audio
                  vm.assigment.question_lists[index].audio = {
                    file: file,
                    nativePath: obj.full_path
                  };
                  console.log(vm.assigment.question_lists[index].audio);
                },

                function(error) {
                  console.log("error gan", error);
                }
              );
            },
            function(error) {
              console.log(error);
            }
          );

          //tambah object audio
          // vm.assigment.question_lists.audio = {
          //   file:
          //   nativePath: obj.full_path,

          // }
          // var my_media = new Media(
          //   obj.full_path,
          //   function(data){
          //     console.log(data)
          //   },
          //   function (err) {
          //     console.log("gagal play", err);
          //   }
          // );
          // my_media.play();
        },
        function() {
          console.log("anjay");
        }
      );
    },
    test: function() {
      console.log(this.assigment.question_lists);
      // navigator.device.audiorecorder.recordAudio(
      //   //membuka audio recoder
      //   function (data) {
      //     //data adalah hasil dri record
      //     console.log(data);
      //     const obj = JSON.parse(data);
      //     console.log(obj.full_path);

      //     window.resolveLocalFileSystemURL(
      //       "file://" + obj.full_path,
      //       function (entry) {
      //         console.log("fileEntry is file?" + entry.isFile.toString());
      //         entry.file(
      //           function (file) {
      //             onsole.log(file);
      //           },
      //           function (error) {
      //             console.log("error gan", error);
      //           }
      //         );
      //       },
      //       function (error) {
      //         console.log(error);
      //       }
      //     );

      //     var my_media = new Media(
      //       obj.full_path,
      //       function (data) {
      //         console.log(data);
      //       },
      //       function (err) {
      //         console.log("gagal play", err);
      //       }
      //     );
      //     my_media.play();
      //   },
      //   function () {
      //     console.log("anjay");
      //   }
      // );
    },
    addQuestionList(assigment_type) {
      this.assigment_type = assigment_type;
      // if (!this.assigment.question_lists) this.assigment.question_lists = [];
      // this.assigment.assigment_category.assigment_types.map((item) => {
      //   if (assigment_type.id == item.id) {
      //     item.display = true;
      //   } else {
      //     item.display = false;
      //   }
      // });
      console.log(
        "assigment.assigment_category",
        this.assigment.assigment_category
      );
      this.assigment.question_lists.push({
        name: "",
        description: "",
        pivot: {
          creator_id: this.Auth.auth.id,
          user_id: this.Auth.auth.id,
          assigment_type: assigment_type,
          assigment_type_id: assigment_type.id
        },
        audio: {},
        answer_lists: [
          {
            name: "",
            value: 100
          }
        ]
      });
      // this.$forceUpdate();
      // console.log(this.assigment);
    },
    storeAssigment(event) {
      this.$refs.form.validate().then(success => {
        if (event) event.preventDefault();

        if (success) {
          // this.loading = true;
          this.$q.notify("Tunggu");
          this.$router.push("/");
          this.$store
            .dispatch("Assigment/store", { access: this.assigment, audio: "" })
            .then(res => {
              // this.$store.commit('Assigment/addUnpublish',{unPublish:res.data})
              this.$q.notify("Berhasil menerbitkan soal");
            })
            .catch(err => {
              console.log(err);
              this.$q.notify("Terjadi kesalahan");
            });
        }
      });
    }
  }
};
</script>

<style></style>
