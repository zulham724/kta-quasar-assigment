<template>
  <q-card class="q-mb-md">
    <q-card-section>
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
            class="q-mb-xs"
            size="sm" 
          ></q-btn>
        </div>
       
      </div>
      <q-input
        v-for="(answer_list, al) in question_list.answer_lists"
        :key="al"
        v-model="answer_list.name"
        rounded
        color="blue"
        outlined
        autogrow
        dense
        :label="String.fromCharCode('A'.charCodeAt(0) + al)"
        hint="Butir jawaban"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
      >
        <template v-slot:after>
          <q-btn
            round
            dense
            :flat="answer_list.value == null ? true : false"
            :color="answer_list.value != null ? 'green-4' : null"
            :icon="answer_list.value != null ? 'check' : null"
            
          />
  
        </template>
      </q-input>

      <!-- <q-btn
        color="primary"
        outline
        rounded
        label="Tambah butir jawaban"
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
import {
    mapState
} from "vuex";
export default {
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
