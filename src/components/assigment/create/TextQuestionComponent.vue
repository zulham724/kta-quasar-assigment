<template>
  <q-card class="q-mb-md">
    <q-bar>
      <q-icon name="note" />
      <div>Soal {{ ql + 1 }}</div>

      <q-space />

      <q-btn dense flat icon="close" @click="$emit('deleteQuestionList', ql)" />
    </q-bar>
    <q-card-section>
      <editor-component ref="editor" v-model="question_list.name"></editor-component>
      <div class="row justify-end q-gutter-sm">
        <div class="" v-if="question_list.audio.file">
          <q-btn
            round
            @click="removeAudio"
            color="red"
            icon="close"
            class="q-my-xs"
            size="sm"
          ></q-btn>
        </div>
        <div class="" v-if="question_list.audio.file">
          <q-btn
            v-if="!audio.isPlay"
            round
            @click="playAudio"
            color="blue"
            icon="play_arrow"
            class="q-my-xs"
            size="sm"
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
        <div class="">
          <span v-if="!question_list.audio.file" class="text-caption text-grey-6">Anda dapat menambahkan suara&nbsp;</span>
          <q-btn
            :disable="!$q.platform.is.mobile"
            round
            color="blue"
            size="sm"
            class="q-my-xs"
            icon="mic"
            @click="recordAudio(ql)"
          >
            <!-- <span class="text-caption" v-if="!question_list.audio.file"
              >Tambah Suara</span
            >
            <span class="text-caption" v-else>Rekam Ulang</span> -->
            <q-tooltip v-if="!$q.platform.is.mobile"
              >Hanya bisa digunakan di mobile</q-tooltip
            >
          </q-btn>
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
                question_list.answer_lists.splice(ql, 1);
              }
            "
          />
        </template>
      </q-input>
      <q-btn
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
      />
    </q-card-section>
  </q-card>
</template>
<script>
import EditorComponent from "../../Editor/EditorComponent";

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

  methods: {
    playAudio() {
      // this.audio = new Audio(this.question_list.audio.file.localURL);
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
    },
    recordAudio(index) {
      let vm = this;
      console.log(index);
      //this.assigment.question_lists[index]
      navigator.device.audiorecorder.recordAudio(
        //membuka audio recoder
        function (data) {
          //data adalah hasil dri record
          console.log(data);
          const obj = JSON.parse(data);
          console.log(obj.full_path);

          //membaca file hasil record audio
          window.resolveLocalFileSystemURL(
            "file://" + obj.full_path,
            function (entry) {
              entry.file(
                function (file) {
                  //tambah object audio
                  const audio = {
                    file: file,
                    nativePath: obj.full_path,
                  };

                  //BEGIN olah data hasil record ke Blob
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    console.log("Successful file write: " + this.result);

                    var blob = new Blob([new Uint8Array(this.result)], {
                      type: "audio/mp4",
                    });
                    audio.blob = blob;
                  };

                  reader.readAsArrayBuffer(file);
                  //END

                  //ini dikomen karena tidak jadi pakay musicplayer.store.js

                  vm.$emit("addAudioToQuestionList", { audio: audio, ql: index });
                  vm.audio.item = new Audio(vm.question_list.audio.file.localURL);
                  // console.log('anjay',vm.audio.item.duration);

                  // vm.assigment.question_lists[index].audio = {
                  //   file: file,
                  //   nativePath: obj.full_path,
                  // };
                },

                function (error) {
                  console.log("error gan", error);
                }
              );
            },
            function (error) {
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
        function () {
          console.log("anjay");
        }
      );
    },
  },
};
</script>
