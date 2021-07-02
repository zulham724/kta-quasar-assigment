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
        <template v-slot:after>
          <q-btn round dense flat icon="close" @click="$emit('deleteQuestionList', ql)" />
        </template>
      </q-input>
      <image-picker :images.sync="question_list.images" />

      <div class="row justify-end q-gutter-sm">
        <div class="" v-if="question_list.audio.file">
          <q-btn
            round
            @click="removeAudio"
            color="red"
            size="sm"
            icon="close"
            class="q-my-xs"
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
            size="sm"
            @click="stopAudio"
            color="blue"
            icon="stop"
            class="q-my-xs"
          ></q-btn>
        </div>
        <div class="">
          <span v-if="!question_list.audio.file" class="text-caption text-grey-6"
            >Anda dapat menambahkan suara&nbsp;</span
          >
          <q-btn
            class="q-my-xs"
            :disable="!$q.platform.is.mobile"
            round
            size="sm"
            color="blue"
            :class="question_list.audio.file ? '' : ''"
            icon="mic"
            @click="recordAudio(ql)"
          >
            <!-- <span class="text-caption " v-if="!question_list.audio.file"
              >Tambah Suara</span
            >
            <span class="text-caption" v-else>Rekam Ulang</span> -->
            <q-tooltip v-if="!$q.platform.is.mobile"
              >Hanya bisa digunakan di mobile</q-tooltip
            >
          </q-btn>
        </div>
      </div>

      <div v-for="(answer_list, al) in question_list.answer_lists" :key="answer_list._id">
        <answer-list
          @removeAnswerList="removeAnswerList"
          @setAnswerListType="setAnswerListType"
          :question_list.sync="question_list"
          :answer_list.sync="answer_list"
          :al="al"
        />
      </div>

      <q-btn
        color="primary"
        outline
        rounded
        label="Tambah butir jawaban"
        @click="addAnswerList()"
      />
    </q-card-section>
  </q-card>
</template>
<script>
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
  watch: {
    "question_list.images": function (val) {
      console.log("watch question_list.images", val);
    },
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
    // console.log('iamges',this.question_list.images);
  },
  methods: {
    setAnswerListType({ answer_list, type }) {
      answer_list.type = type;
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
    addImage() {},
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

                  vm.$emit("addAudioToQuestionList", {
                    audio: audio,
                    ql: index,
                  });
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
