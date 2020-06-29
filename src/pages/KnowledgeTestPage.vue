<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header
        elevated
        :style="`background-image:url(${Setting.assets.bgToolbar});background-size:cover;`"
      >
        <q-toolbar>
          <q-btn round flat dense icon="arrow_back" @click="$router.back()" />
          <q-toolbar-title>
            <div class="text-body1">Review Soal</div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container v-if="assigment != null">
        <q-form @submit="onSubmit" ref="form" class="full-height">
          <q-stepper
            v-model="step"
            vertical
            color="primary"
            animated
            class="full-height"
            header-nav
          >
            <q-step
              v-for="(question_list, ql) in assigment.question_lists"
              :key="question_list.id"
              :name="ql + 1"
              :title="`Soal ${ql + 1}`"
              icon="settings"
              :done="step > 1"
            >
              <div class="text-body2">{{ question_list.name }}</div>

              <div
                v-if="
                  question_list.pivot.assigment_type.description ==
                  'selectoptions'
                "
              >
                <q-input
                  disable
                  class="q-pa-sm"
                  rounded
                  outlined
                  dense
                  v-for="answer_list in question_list.answer_lists"
                  :key="answer_list.id"
                  v-model="answer_list.name"
                  :rules="[(val) => !!val || 'Harus diisi']"
                >
                  <template v-slot:after>
                    <div>
                      <q-btn
                        round
                        icon="check"
                        :flat="
                          question_list.answer != answer_list.id ? true : false
                        "
                        :color="
                          question_list.answer == answer_list.id
                            ? 'green-4'
                            : null
                        "
                        @click="
                          () => {
                            question_list.answer = answer_list.id;
                            $forceUpdate();
                          }
                        "
                      />
                    </div>
                  </template>
                </q-input>
              </div>

              <div
                v-if="
                  question_list.pivot.assigment_type.description == 'textfield'
                "
              >
                <q-input
                  class="q-pa-sm"
                  rounded
                  outlined
                  dense
                  v-model="question_list.answer"
                  :rules="[(val) => !!val || 'Harus diisi']"
                />
              </div>

              <div
                v-if="
                  question_list.pivot.assigment_type.description == 'textarea'
                "
              >
                <q-input
                  class="q-pa-sm"
                  type="textarea"
                  rounded
                  outlined
                  dense
                  v-model="question_list.answer"
                  :rules="[(val) => !!val || 'Harus diisi']"
                />
              </div>

              <q-stepper-navigation class="row justify-end">
                <q-btn
                  v-if="ql != 0"
                  flat
                  @click="step = step - 1"
                  color="primary"
                  label="Kembali"
                  class="q-ml-sm"
                />
                <q-btn
                  v-if="ql + 1 != assigment.question_lists.length"
                  outline
                  rounded
                  @click="step++"
                  color="primary"
                  label="Lanjut"
                />
                <q-btn
                  v-if="ql + 1 == assigment.question_lists.length"
                  outline
                  rounded
                  @click="onSubmit"
                  color="primary"
                  label="Selesai"
                  :loading="loading"
                  :disable="loading"
                />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </q-form>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    assigmentId: null,
  },
  data() {
    return {
      assigment: null,
      step: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState(["Setting"]),
  },
  mounted() {
    this.getAssigment();
  },
  methods: {
    getAssigment() {
      this.$store.dispatch("Assigment/show", this.assigmentId).then((res) => {
        this.assigment = res.data;
      });
    },
    onSubmit() {
      this.$refs.form.validate().then((success) => {
        if (
          success &&
          this.assigment.question_lists.filter((item) =>
            !item.answer ? item : null
          ).length == 0
        ) {
          this.$router.push({
            name: "knowledgeresult",
            params: {
              assigment: this.assigment,
            },
          });
        } else {
          this.$q.notify("Periksa apakah semua telah terisi dengan benar");
        }
      });
    },
  },
};
</script>

<style></style>
