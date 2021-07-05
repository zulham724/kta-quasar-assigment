<template>
  <div class="q-mt-md">
    <div
      v-if="
        question.assigment_question_list.assigment_type.description == 'selectoptions'
      "
    >
      <div
        v-for="answer_list in question.answer_lists"
        :key="`answer1-${answer_list.id}`"
      >
        <div
          v-if="question.answer.answer_list_id != answer_list.id"
          class="row q-gutter-sm q-mb-xs"
        >
          <div class="col-12">
            <q-card
              :class="`my-card q-pa-sm ${answer_list.value ? 'bg-green-4' : null}`"
              flat
              bordered
            >
              <div v-html="answer_list.name"></div>
              <div
                class="row q-gutter-xs"
                v-if="answer_list.answer_list_type.name == 'image'"
              >
                <div class="col-4" v-for="image in answer_list.images" :key="image.id">
                  <q-img :src="`${Setting.storageUrl}/${image.src}`"></q-img>
                </div>
              </div>
            </q-card>
          </div>
        </div>
        <div v-else class="row q-gutter-xs q-mb-xs">
          <div class="col-10">
            <q-card
              :class="`my-card q-pa-sm ${
                answer_list.value
                  ? 'bg-green-4'
                  : question.answer.answer_list_id == answer_list.id
                  ? 'bg-red-4'
                  : null
              }`"
              flat
              bordered
            >
              <div v-html="answer_list.name"></div>
              <div
                class="row q-gutter-xs"
                v-if="answer_list.answer_list_type.name == 'image'"
              >
                <div class="col-4" v-for="image in answer_list.images" :key="image.id">
                  <q-img :src="`${Setting.storageUrl}/${image.src}`"></q-img>
                </div>
              </div>
            </q-card>
          </div>
          <div class="col-1">
            <q-btn
              round
              :icon="question.answer.value ? 'check' : 'close'"
              :color="question.answer.value ? 'green' : 'red'"
            />
          </div>
        </div>
      </div>

      <!-- <q-input
        :bg-color="
          answer_list.value
            ? 'green-4'
            : question.answer.answer_list_id == answer_list.id
            ? 'red-4'
            : null
        "
        rounded
        readonly
        outlined
        dense
        autogrow
        v-for="answer_list in question.answer_lists"
        :key="`answer-${answer_list.id}`"
        v-model="answer_list.name"
        :rules="[(val) => !!val || 'Harus diisi']"
      >
        <template v-slot:after>
          <div>
            <q-btn
              round
              icon="close"
              :flat="false"
              color="red"
              v-if="
                answer_list.value == null &&
                answer_list.id == question.answer.answer_list_id
              "
            />
          </div>
        </template>
      </q-input> -->
    </div>

    <div
      v-if="question.assigment_question_list.assigment_type.description == 'textfield'"
    >
      <q-input
        v-for="(answer_list, key) in question.answer_lists"
        :key="key"
        class="q-pa-sm"
        outlined
        dense
        readonly
        :label="`Kunci Jawaban ${key + 1}`"
        v-model="answer_list.name"
      />
      <q-input
        class="q-pa-sm"
        outlined
        dense
        readonly
        label="Jawaban Siswa"
        v-model="question.answer.name"
      />
    </div>

    <div v-if="question.assigment_question_list.assigment_type.description == 'textarea'">
      <q-input
        v-for="(answer_list, key) in question.answer_lists"
        :key="key"
        class="q-pa-sm"
        outlined
        dense
        disable
        type="textarea"
        :label="`Kunci Jawaban ${key + 1}`"
        v-model="answer_list.name"
      />
      <q-input
        class="q-pa-sm"
        outlined
        dense
        disable
        type="textarea"
        label="Jawaban Siswa"
        v-model="question.answer.name"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    question: Object,
    required: true,
  },
  computed: {
    ...mapState(["Setting"]),
  },
};
</script>
