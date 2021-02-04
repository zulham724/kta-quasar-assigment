<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="row">
        <div class="col">
          <div class="text-body1 text-grey">Soal nomor {{ ql + 1 }}</div>
        </div>
        <div class="col-1">
          <q-btn
            round
            dense
            flat
            icon="close"
             @click="$emit('removeQuestionList',ql)"
          />
        </div>
      </div>
      <div class="row">
        <p v-html="question_list.name">

          </p>
      </div>
      <q-input
        :readonly="true/*(question_list.pivot.creator_id != Auth.auth.id*/"
        v-for="(answer_list, al) in question_list.answer_lists"
        :key="al"
        v-model="answer_list.name"
        rounded
        color="blue"
        outlined
        dense
        :label="String.fromCharCode('A'.charCodeAt(0) + al)"
        hint="Butir jawaban"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
        @input="() => $forceUpdate()"
      >
        <template v-slot:after>
          <!--question_list.pivot.creator_id != Auth.auth.id-->
          <q-btn
            :disable="true /*question_list.pivot.creator_id != Auth.auth.id*/"
            round
            dense
            :flat="answer_list.value == null ? true : false"
            :color="answer_list.value != null ? 'green-4' : null"
            icon="check"
            @click="
              /*() => {
                question_list.answer_lists.filter((item, i) => {
                  i == al ? (item.value = 100) : (item.value = null);
                });
                $forceUpdate();
              }*/
            "
          />
          <q-btn
            :disable="true /*question_list.pivot.creator_id != Auth.auth.id*/"
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
      <!-- <q-btn
                      v-show="question_list.pivot.creator_id == Auth.auth.id"
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
                          $forceUpdate();
                        }
                      "
                    /> -->
    </q-card-section>
  </q-card>
</template>
<script>
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
    removeAudio() {
      this.$emit("removeAudio", this.ql); //ql=index question_list yg dipassing dari parent
    },
    stopAudio() {
      this.audio.item.pause();
      this.audio.item.currentTime = 0;
      this.audio.isPlay = false;
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
