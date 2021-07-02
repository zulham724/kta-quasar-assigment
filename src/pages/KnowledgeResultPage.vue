<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar class="bg-blue">
          <q-btn round flat dense icon="arrow_back" @click="$router.back()" />
          <q-toolbar-title>Hasil</q-toolbar-title>
          <q-space />
        </q-toolbar>
      </q-header>
      <q-page-container v-if="assigment != null">
        <div
          class="q-pa-sm"
          v-for="(question_list, ql) in assigment.question_lists"
          :key="question_list.id"
        >
          <q-card flat bordered class="q-pa-sm">
            <div class="text-body1">Soal nomor {{ ql + 1 }}</div>
            <div class="text-body1">{{ question_list.name }}</div>

            <div class="row q-my-xs q-gutter-xs">
              <div class="col-sm-3" v-for="image in question_list.images" :key="image.id">
                <q-img
                  style="width: 100px"
                  :src="`${Setting.storageUrl}/${image.src}`"
                ></q-img>
              </div>
            </div>

            <div>
              <div class="" v-if="question_list.audio">
                <q-btn
                  v-if="!audio.isPlay"
                  round
                  @click="playAudio(question_list.audio)"
                  color="blue"
                  icon="play_arrow"
                  class="q-my-xs"
                  size="sm"
                ></q-btn>
                <q-btn
                  v-else
                  round
                  size="sm"
                  @click="stopAudio"
                  color="blue"
                  icon="stop"
                  class="q-my-xs"
                ></q-btn>
              </div>
            </div>

            <div
              v-if="question_list.pivot.assigment_type.description == 'selectoptions'"
              class="q-pt-md"
            >
              <q-badge
                outline
                :color="`${
                  question_list.answer ==
                  (question_list.answer_lists.find((item) => item.value)
                    ? question_list.answer_lists.find((item) => item.value).id
                    : false)
                    ? 'green'
                    : 'red'
                }`"
                >Jawaban anda
                {{
                  question_list.answer ==
                  (question_list.answer_lists.find((item) => item.value)
                    ? question_list.answer_lists.find((item) => item.value).id
                    : false)
                    ? "benar"
                    : "salah"
                }}</q-badge
              >
              <div
                v-for="(answer_list, al) in question_list.answer_lists"
                :key="answer_list.id"
              >
                <div v-if="answer_list.type == 'text'">
                  <q-input
                    disable
                    class="q-pa-sm"
                    rounded
                    outlined
                    dense
                    :bg-color="
                      answer_list.value
                        ? 'green-4'
                        : question_list.answer == answer_list.id
                        ? 'red-4'
                        : null
                    "
                    v-model="answer_list.name"
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
                <div v-else>
                  <div v-if="question_list.answer == answer_list.id">
                    <div class="row q-gutter-sm">
                      <div class="col-9">
                        <q-card
                          flat
                          bordered
                          :class="answer_list.value ? 'bg-green-4' : 'bg-red-4'"
                        >
                          <image-picker
                            :is-enabled="false"
                            class="q-mb-sm"
                            :images="answer_list.images"
                          />
                        </q-card>
                      </div>
                      <div class="col">
                        <q-btn
                          round
                          disable
                          v-if="question_list.answer == answer_list.id"
                          :icon="answer_list.value ? 'check' : 'close'"
                          :color="answer_list.value ? 'green-4' : 'red-4'"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else class="row">
                    <div class="col">
                      <q-card
                        flat
                        bordered
                        :class="answer_list.value ? 'bg-green-4' : ''"
                      >
                        <image-picker
                          :is-enabled="false"
                          class="q-mb-sm"
                          :images="answer_list.images"
                        />
                      </q-card>
                    </div>
                  </div>
                </div>
              </div>
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
                v-for="(answer_list, al) in question_list.answer_lists"
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
                v-for="(answer_list, al) in question_list.answer_lists"
                :key="`${ql}-${al}`"
                v-model="answer_list.name"
                :rules="[(val) => !!val || 'Harus diisi']"
              />
            </div>
          </q-card>
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
  components: {
    ImagePicker: () => import("components/imagepicker/imagePicker.vue"),
  },
  data() {
    return {
      audio: {
        isPlay: false,
        item: {
          currentTime: 0,
          duration: 0,
        },
      },
    };
  },
  computed: {
    ...mapState(["Setting"]),
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>
