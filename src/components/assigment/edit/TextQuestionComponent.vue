<template>
  <q-card class="q-mb-md">
    <q-bar>
      <q-icon name="note" />
      <div>Soal {{ ql + 1 }}</div>

      <q-space />

      <!-- <q-btn dense flat icon="close" @click="$emit('deleteQuestionList', ql)" /> -->
    </q-bar>
    <q-card-section>
      <editor-component ref="editor" v-model="question_list.name"></editor-component>
      <div class="row justify-end q-gutter-sm">
        <div class="" v-if="question_list.audio">
          <q-btn
            v-if="!audio.isPlay"
            round
            @click="playAudio"
            color="blue"
            icon="play_arrow"
            class="q-my-xs"
          ></q-btn>
          <q-btn
            v-else
            round
            @click="stopAudio"
            color="blue"
            icon="stop"
            class="q-my-xs"
          ></q-btn>
        </div>
     
      </div>

      <q-separator inset class="q-ma-sm" />
      <q-input
        class="q-mt-sm"
        type="textarea"
        v-for="(answer_list, al) in question_list.answer_lists"
        :key="al"
        v-model="answer_list.name"
        rounded
        color="blue"
        outlined
        dense
        autogrow
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
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
              }
            "
          />
        </template>
      </q-input>
      <!-- <q-btn
        color="primary"
        outline
        rounded
        label="Tambah Kunci jawaban"
        @click="
          () => {
            question_list.answer_lists.push({
              name: '',
              value: null,
            });
          }
        "
      /> -->
    </q-card-section>
  </q-card>
</template>
<script>
import EditorComponent from "../../Editor/EditorComponent";
import {
    mapState
} from "vuex";
export default {
  components: {
    EditorComponent,
  },
  props: {
    ql: Number,
    question_list: Object,
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
  created() {
    // this.question_list.answer_lists = []
  },
  computed: {
        ...mapState(["Setting"])
  },
  methods: {
    playAudio() {
      this.audio.item = new Audio(`${this.Setting.storageUrl}/${this.question_list.audio.src}`);
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
    stopAudio() {
      this.audio.item.pause();
      this.audio.item.currentTime = 0;
      this.audio.isPlay = false;
    },
    removeAudio() {
      this.$emit("removeAudio", this.ql); //ql=index question_list yg dipassing dari parent
    }
  },
};
</script>
