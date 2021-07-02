<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar class="bg-blue">
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
              :done="question_list.answer != null"
            >
              <div class="text-body2" v-html="question_list.name"></div>

              <div class="row q-my-xs q-gutter-xs">
                <div
                  class="col-sm-3"
                  v-for="image in question_list.images"
                  :key="image.id"
                >
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
              >
                <div class="column q-gutter-xs">
                  <select-options-answer-list
                    class="col"
                    v-model="question_list.answer"
                    v-for="(answer_list, al) in question_list.answer_lists"
                    :key="answer_list.id"
                    :question_list="question_list"
                    :answer_list="answer_list"
                    :al="al"
                  />
                </div>

                <!-- <q-input
                  autogrow
                  disable
                  class="q-pa-sm"
                  rounded
                  outlined
                  dense
                  v-model="answer_list.name"
                  :rules="[val => !!val || 'Harus diisi']"
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
                </q-input> -->
              </div>

              <div v-if="question_list.pivot.assigment_type.description == 'textfield'">
                <q-input
                  class="q-pa-sm"
                  rounded
                  outlined
                  dense
                  v-model="question_list.answer"
                  :rules="[(val) => !!val || 'Harus diisi']"
                />
              </div>

              <div v-if="question_list.pivot.assigment_type.description == 'textarea'">
                <q-input
                  class="q-pa-sm"
                  type="textarea"
                  rounded
                  outlined
                  dens
                  e
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
                  @click="step = step + 1"
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
  components: {
    SelectOptionsAnswerList: () =>
      import("components/assigment/knowledgetest/SelectOptionsAnswerList.vue"),
  },
  data() {
    return {
      assigment: null,
      step: 0,
      loading: false,
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
  mounted() {
    this.getAssigment();
  },
  methods: {
    getAssigment() {
      this.$store.dispatch("Assigment/show", this.assigmentId).then((res) => {
        this.assigment = {
          ...res.data,
          question_lists: [
            ...res.data.question_lists.map((question_list) => {
              return { ...question_list, answer: null };
            }),
          ],
        };
        console.log("assigment.question_lists", this.assigment.question_lists);
      });
    },
    stopAudio() {
      this.audio.item.pause();
      this.audio.item.currentTime = 0;
      this.audio.isPlay = false;
    },
    playAudio(audio) {
      console.log(`${this.Setting.storageUrl}/${audio.src}`);
      this.audio.item = new Audio(`${this.Setting.storageUrl}/${audio.src}`);
      this.audio.item.play();
      let vm = this;
      let a = setInterval(function () {
        if (vm.audio.item.currentTime >= vm.audio.item.duration) {
          vm.audio.isPlay = false;
          console.log("stop gan");
          clearInterval(a);
        }
      }, 500);
      this.audio.isPlay = true;

      // this.$store.commit('MusicPlayer/play',{item:this.question_list.audio})
    },
    onSubmit() {
      this.$refs.form.validate().then((success) => {
        if (
          success &&
          this.assigment.question_lists.filter((item) => (!item.answer ? item : null))
            .length == 0
        ) {
          this.$router.push({
            name: "knowledgeresult",
            params: {
              assigment: this.assigment,
            },
          });
        } else {
          console.log(
            this.assigment.question_lists.filter((item) => (!item.answer ? item : null))
          );
          this.$q.notify("Periksa apakah semua telah terisi dengan benar");
        }
      });
    },
  },
};
</script>

<style></style>
