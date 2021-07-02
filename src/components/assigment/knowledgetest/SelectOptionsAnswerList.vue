<template>
  <div class="row q-gutter">
    <div class="col-1 q-mr-xs self-center text-bold">
      <!-- <q-icon v-ripple color="black" :name="answerListIcon"> </q-icon> -->
      {{ String.fromCharCode("A".charCodeAt(0) + al) }}
    </div>
    <div class="col-8 q-mr-xs">
      <div v-if="answer_list.type == 'text'">
        <text-answer-list :answer_list="answer_list" :al="al" />
      </div>
      <div v-else-if="answer_list.type == 'image'" class="q-mb-xs">
        <image-answer-list :answer_list="answer_list" :al="al" />
      </div>
    </div>
    <div class="col self-center">
      <div>
        <q-btn
          round
          dense
          :flat="question_list.answer != answer_list.id ? true : false"
          :color="question_list.answer == answer_list.id ? 'green-4' : null"
          icon="check"
          @click="selectAnswerList()"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    question_list: {
      type: Object,
    },
    answer_list: {
      type: Object,
    },
    al: {
      type: Number,
    },
  },
  components: {
    TextAnswerList: () =>
      import("components/assigment/knowledgetest/type/TextAnswerList.vue"),
    ImageAnswerList: () =>
      import("components/assigment/knowledgetest/type/ImageAnswerList.vue"),
  },
  computed: {
    answerListIcon: function () {
      let type = "text_format";
      switch (this.answer_list.type) {
        case "text":
          type = "text_format";
          break;
        case "image":
          type = "image";
          break;
        case "audio":
          type = "audiotrack";
          break;
        default:
          type = "text_format";
          break;
      }
      return type;
    },
  },
  data() {
    return {
      showing: false,
      answer_list_type: "text",
    };
  },
  methods: {
    selectAnswerList() {
      this.$emit("input", this.answer_list.id);
      console.log("answer after", this.question_list.answer);
    },
  },
};
</script>
