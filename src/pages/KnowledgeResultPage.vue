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
            Hasil
          </q-toolbar-title>
          <q-space />
        </q-toolbar>
      </q-header>
      <q-page-container v-if="assigment != null">
        <div
          class="q-pa-md"
          v-for="(question_list, ql) in assigment.question_lists"
          :key="question_list.id"
        >
          <div class="text-body1">Soal nomor {{ ql + 1 }}</div>
          <div class="text-body1">{{ question_list.name }}</div>

          <div
            v-if="
              question_list.pivot.assigment_type.description == 'selectoptions'
            "
            class="q-pt-md"
          >
            <q-badge outline :color="`${question_list.answer == question_list.answer_lists.find(item=>item.value).id ? 'green' : 'red'}`">Jawaban anda {{question_list.answer == question_list.answer_lists.find(item=>item.value).id ? 'benar' : 'salah'}}</q-badge>
            <q-input
              disable
              class="q-pa-sm"
              rounded
              outlined
              dense
              v-for="(answer_list,al) in question_list.answer_lists"
              :bg-color="answer_list.value ? 'green-4' : question_list.answer == answer_list.id ? 'red-4' : null"
              :key="`value-${ql}-${al}`"
              v-model="answer_list.name"
              :rules="[(val) => !!val || 'Harus diisi']"
            >
              <template v-slot:after>
                <div>
                  <q-btn
                    round
                    disable
                    v-if="question_list.answer == answer_list.id"
                    :icon="answer_list.value ? 'check' : 'close'"
                    :color="answer_list.value ? 'green-4' : 'red-4'"
                  />
                </div>
              </template>
            </q-input>
          </div>

          <div
            v-if="question_list.pivot.assigment_type.description == 'textfield'"
            class="q-pt-md"
          >
            <div class="text-caption">Jawaban anda</div>
            <q-input
              class="q-pa-sm"
              rounded
              disable
              outlined
              dense
              v-model="question_list.answer"
              :rules="[(val) => !!val || 'Harus diisi']"
            />
            <div class="text-caption">Jawaban benar</div>
            <q-input
              class="q-pa-sm"
              rounded
              disable
              outlined
              dense
              v-for="(answer_list,al) in question_list.answer_lists"
              :key="`${ql}-${al}`"
              v-model="answer_list.name"
              :rules="[(val) => !!val || 'Harus diisi']"
            />
          </div>

          <div
            v-if="question_list.pivot.assigment_type.description == 'textarea'"
            class="q-pt-md"
          >
            <div class="text-caption">Jawaban anda</div>
            <q-input
              disable
              class="q-pa-sm"
              type="textarea"
              rounded
              outlined
              dense
              v-model="question_list.answer"
              :rules="[(val) => !!val || 'Harus diisi']"
            />
            <div class="text-caption">Jawaban benar</div>
            <q-input
              disable
              class="q-pa-sm"
              type="textarea"
              rounded
              outlined
              dense
              v-for="(answer_list,al) in question_list.answer_lists"
              :key="`${ql}-${al}`"
              v-model="answer_list.name"
              :rules="[(val) => !!val || 'Harus diisi']"
            />
          </div>
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    assigment: null,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["Setting"]),
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>
