<template>
  <div>
    <q-header
      elevated
    >
      <q-toolbar class="bg-cyan-7">
        <q-icon name="home" style="font-size:1.5em" />
        <q-toolbar-title>
          <div class="text-body1">Buat Soal</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-form class="q-gutter-sm" ref="form">
      <q-stepper v-model="step" color="cyan-7" style="width:100vw;" animated>
        <q-step :name="1" title="Isi" color="cyan-7" icon="settings" :done="step > 1">
          <q-select
            rounded
            outlined
            dense
            color="cyan-7"
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
            :options="AssigmentCategory.assigment_categories.filter(item=>item.id != 9)"
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
            color="cyan-7"
            outlined
            dense
            label="Kompetensi Dasar"
            v-model="assigment.topic"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
          <q-input
            rounded
            color="cyan-7"
            outlined
            dense
            label="Materi"
            v-model="assigment.subject"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
          <q-input
            rounded
            color="cyan-7"
            outlined
            dense
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
              color="cyan-7"
              label="Lanjut"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Buat"
          icon="create_new_folder"
          :done="step > 2"
          style="margin-bottom:30vh"
          color="cyan-7"
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
              <q-card class="q-mb-md">
                <q-card-section>
                  <q-input
                    v-model="question_list.name"
                    rounded
                    color="cyan-7"
                    outlined
                    dense
                    :label="`Soal ${ql + 1}`"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Harus diisi']"
                    @input="() => $forceUpdate()"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        icon="close"
                        @click="
                          () => {
                            assigment.question_lists.splice(ql, 1);
                            $forceUpdate();
                          }
                        "
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-for="(answer_list, al) in question_list.answer_lists"
                    :key="al"
                    v-model="answer_list.name"
                    rounded
                    color="cyan-7"
                    outlined
                    dense
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Harus diisi']"
                    @input="() => $forceUpdate()"
                    :label="`Kunci jawaban ${al + 1}`"
                  >
                    <template v-slot:after>
                      <q-btn
                        v-if="al != 0"
                        round
                        dense
                        flat
                        icon="close"
                        @click="
                          () => {
                            question_list.answer_lists.splice(al, 1);
                            $forceUpdate();
                          }
                        "
                      />
                    </template>
                  </q-input>
                  <q-btn
                    color="secondary"
                    outline
                    rounded
                    label="Tambah Kunci jawaban"
                    @click="
                      () => {
                        question_list.answer_lists.push({
                          name: '',
                          value: null
                        });
                        $forceUpdate();
                      }
                    "
                  />
                </q-card-section>
              </q-card>
            </div>
            <div
              v-if="
                question_list.pivot.assigment_type.description ==
                  'selectoptions'
              "
            >
              <q-card class="q-mb-md">
                <q-card-section>
                  <q-input
                    v-model="question_list.name"
                    rounded
                    color="cyan-7"
                    outlined
                    dense
                    :label="`Soal ${ql + 1}`"
                    hint="Pilihan ganda"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Harus diisi']"
                    @input="() => $forceUpdate()"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        icon="close"
                        @click="
                          () => {
                            assigment.question_lists.splice(ql, 1);
                            $forceUpdate();
                          }
                        "
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-for="(answer_list, al) in question_list.answer_lists"
                    :key="al"
                    v-model="answer_list.name"
                    rounded
                    color="cyan-7"
                    outlined
                    dense
                    :label="String.fromCharCode('A'.charCodeAt() + al)"
                    hint="Butir jawaban"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Harus diisi']"
                    @input="() => $forceUpdate()"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        :flat="answer_list.value == null ? true : false"
                        :color="answer_list.value != null ? 'green-4' : null"
                        icon="check"
                        @click="
                          () => {
                            question_list.answer_lists.filter((item, i) => {
                              i == al
                                ? (item.value = 100)
                                : (item.value = null);
                            });
                            $forceUpdate();
                          }
                        "
                      />
                      <q-btn
                        v-if="al != 0"
                        round
                        dense
                        flat
                        icon="close"
                        @click="
                          () => {
                            question_list.answer_lists.splice(al, 1);
                            $forceUpdate();
                          }
                        "
                      />
                    </template>
                  </q-input>
                  <q-btn
                    color="secondary"
                    outline
                    rounded
                    label="Tambah butir jawaban"
                    @click="
                      () => {
                        question_list.answer_lists.push({
                          name: '',
                          value: null
                        });
                        $forceUpdate();
                      }
                    "
                  />
                </q-card-section>
              </q-card>
            </div>
            <div
              v-if="
                question_list.pivot.assigment_type.description == 'textarea'
              "
            >
              <q-card class="q-mb-md">
                <q-card-section>
                  <div class="text-body1 text-grey">
                    Soal {{ ql + 1 }}
                  </div>
                  <q-input
                    v-model="question_list.name"
                    rounded
                    color="cyan-7"
                    outlined
                    dense
                    :label="`Soal ${ql + 1}`"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Harus diisi']"
                    @input="() => $forceUpdate()"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        icon="close"
                        @click="
                          () => {
                            assigment.question_lists.splice(ql, 1);
                            $forceUpdate();
                          }
                        "
                      />
                    </template>
                  </q-input>
                  <q-input
                    type="textarea"
                    v-for="(answer_list, al) in question_list.answer_lists"
                    :key="al"
                    v-model="answer_list.name"
                    rounded
                    color="cyan-7"
                    outlined
                    dense
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Harus diisi']"
                    @input="() => $forceUpdate()"
                    :label="`Kunci jawaban ${al + 1}`"
                  >
                    <template v-slot:after>
                      <q-btn
                        v-if="al != 0"
                        round
                        dense
                        flat
                        icon="close"
                        @click="
                          () => {
                            question_list.answer_lists.splice(al, 1);
                            $forceUpdate();
                          }
                        "
                      />
                    </template>
                  </q-input>
                  <q-btn
                    color="secondary"
                    outline
                    rounded
                    label="Tambah Kunci jawaban"
                    @click="
                      () => {
                        question_list.answer_lists.push({
                          name: '',
                          value: null
                        });
                        $forceUpdate();
                      }
                    "
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-stepper-navigation>
            <div class="row justify-between">
              <q-btn
                flat
                dense
                @click="step = 1"
                color="cyan-7"
                label="Back"
                class="q-ml-sm"
              />
              <q-fab
                flat
                color="secondary"
                label="Butir soal"
                outline
                rounded
                direction="down"
                v-if="assigment.assigment_category"
              >
                <q-fab-action
                  color="secondary"
                  v-for="assigment_type in assigment.assigment_category
                    .assigment_types"
                  :key="assigment_type.id"
                  icon="list"
                  :label="assigment_type.name"
                  @click="addQuestionList(assigment_type)"
                />
              </q-fab>
              <q-btn
                v-if="assigment.question_lists && assigment.question_lists.length"
                flat
                @click="
                  () =>
                    $refs.form
                      .validate()
                      .then(success => (success ? (step = 3) : null))
                "
                color="cyan-7"
                label="Lanjut"
              />
            </div>
          </q-stepper-navigation>
        </q-step>

        <q-step :name="3" title="Finish" color="cyan-7" icon="add_comment">
          <q-input
            class="q-mb-lg"
            type="textarea"
            outlined
            color="cyan-7"
            rounded
            v-model="assigment.description"
            label="Tulis sesuatu untuk guru"
            hint="contoh: Silahkan dilihat jangan lupa like dan komentarnya"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />

          <q-input
            class="q-mb-lg"
            type="textarea"
            outlined
            color="cyan-7"
            rounded
            v-model="assigment.note"
            label="Tulis sesuatu untuk murid"
            hint="contoh: Perhatikan soal dengan baik dan juga jangan sampai telat mengerjakan karena ada batas waktu"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />

          <q-stepper-navigation>
            <div class="row justify-between">
              <q-btn
                flat
                @click="step = 2"
                color="cyan-7"
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
                color="cyan-7"
                @click="storeAssigment()"
              />
            </div>
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      step: 1,
      assigment: {
        isExpire: false,
        isPassword: false,
        isTimer: false,
        grade_id: null
      }
    };
  },
  computed: {
    ...mapState(["Grade", "Auth", "AssigmentCategory",'Setting'])
  },
  created() {
    if (this.Grade.grades.length == 0) this.$store.dispatch("Grade/index");
    this.$store.dispatch("AssigmentCategory/index");
  },
  methods: {
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
      // console.log(this.assigment);
    },
    storeAssigment() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$q.notify('Tunggu')
          this.$router.push('/');
          this.$store
            .dispatch("Assigment/store", this.assigment)
            .then(res => {
              // this.$store.commit('Assigment/addUnpublish',{unPublish:res.data})
              this.$q.notify("Berhasil menerbitkan soal");
            }).catch(err=>{
              this.$q.notify("Terjadi kesalahan")
            })
        }
      });
    }
  }
};
</script>

<style></style>
