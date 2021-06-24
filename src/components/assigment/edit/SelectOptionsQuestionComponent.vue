<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <image-picker
        :is-enabled="true"
        class="q-mb-sm"
        :images.sync="question_list.images"
      />
      <q-input
        v-model="question_list.name"
        rounded
        color="blue"
        outlined
        dense
        autogrow
        :label="`Soal ${ql + 1}`"
        hint="Pilihan ganda"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
      >
      </q-input>
      <div class="row justify-end q-gutter-sm">
        <div class="" v-if="question_list.audio">
          <q-btn
            v-if="!audio.isPlay"
            round
            @click="playAudio"
            color="blue"
            icon="play_arrow"
            size="sm"
            class="q-mb-xs"
          ></q-btn>
          <q-btn
            v-else
            round
            @click="stopAudio"
            color="blue"
            icon="stop"
            class="q-my-xs"
            size="sm"
          ></q-btn>
        </div>
      </div>
      <div v-for="(answer_list, al) in question_list.answer_lists" :key="answer_list.id">
        <answer-list
          @removeAnswerList="removeAnswerList"
          @setAnswerListType="setAnswerListType"
          :question_list.sync="question_list"
          :answer_list.sync="answer_list"
          :al="al"
        />
      </div>

      <div class="row q-gutter-none">
        <div class="col-8">
          <q-btn
            color="primary"
            outline
            rounded
            label="Tambah butir jawaban"
            @click="addAnswerList()"
          />
        </div>
        <div class="col">
          <q-btn color="primary" rounded label="Reset" @click="reset()" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    ql: Number,
    question_list: Object,
  },
  components: {
    ImagePicker: () => import("components/imagepicker/imagePicker.vue"),
    AnswerList: () =>
      import("components/assigment/selectoptions_answerlist/AnswerList.vue"),
  },
  data() {
    return {
      original_question_list: {},
      audio: {
        isPlay: false,
        item: {
          currentTime: 0,
          duration: 0,
        },
      },
    };
  },
  created() {
    this.original_question_list = JSON.parse(JSON.stringify(this.question_list));
    // this.question_list.answer_lists = []
  },
  watch: {
    "question_list.images": function (val) {
      console.log("watch edit question_list.images", val);
    },
  },
  computed: {
    ...mapState(["Setting"]),
  },
  methods: {
    setAnswerListType({ answer_list, type }) {
      answer_list.type = type;
    },
    reset() {
      this.$emit("resetQuestionList", this.ql);
    },
    removeAnswerList({ question_list, index }) {
      console.log(
        "remove answer_list index:",
        index,
        "from question_list",
        question_list
      );
      question_list.answer_lists.splice(index, 1);
    },
    addAnswerList() {
      const len = this.question_list.answer_lists.length;
      let type = "text";
      if (len > 0) {
        const current_answer_list = this.question_list.answer_lists[len - 1];
        type = current_answer_list.type;
      }

      this.question_list.answer_lists.push({
        _id: len + Date.now(),
        type,
        name: "",
        value: null,
        images: [],
      });
    },
    playAudio() {
      this.audio.item = new Audio(
        `${this.Setting.storageUrl}/${this.question_list.audio.src}`
      );
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
    removeAudio() {
      this.$emit("removeAudio", this.ql); //ql=index question_list yg dipassing dari parent
    },
    stopAudio() {
      this.audio.item.pause();
      this.audio.item.currentTime = 0;
      this.audio.isPlay = false;
    },
  },
};
</script>
