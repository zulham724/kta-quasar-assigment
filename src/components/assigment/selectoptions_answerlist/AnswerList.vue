<template>
  <div>
    <div class="row q-gutter-none">
      <div class="col-1 q-mr-xs self-center">
        <q-icon v-ripple color="black" :name="answerListIcon">
          <q-menu v-model="showing">
            <q-list dense>
              <q-item
                @click="setAnswerListType('text')"
                clickable
                v-close-popup
              >
                <q-item-section avatar>
                  <q-icon color="black" name="text_format" />
                </q-item-section>
                <q-item-section>Teks</q-item-section>
              </q-item>
              <q-item
                @click="setAnswerListType('image')"
                clickable
                v-close-popup
              >
                <q-item-section avatar>
                  <q-icon color="black" name="image" />
                </q-item-section>
                <q-item-section>Gambar</q-item-section>
              </q-item>
              <q-item
                @click="setAnswerListType('audio')"
                clickable
                v-close-popup
                disable
              >
                <q-item-section avatar>
                  <q-icon color="black" name="audiotrack" />
                </q-item-section>
                <q-item-section>Suara</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </div>
      <div class="col-8 q-mr-xs">
        <div v-if="answer_list.type == 'text'">
          <text-answer-list :answer_list="answer_list" :al="al" />
        </div>
        <div v-else-if="answer_list.type == 'image'" class="q-mb-xs">
          <image-answer-list :answer_list="answer_list" :al="al" />
        </div>
      </div>
      <div class="col">
        <q-btn
          round
          dense
          :flat="answer_list.value == null ? true : false"
          :color="answer_list.value != null ? 'green-4' : null"
          icon="check"
          @click="
            () => {
              question_list.answer_lists.filter((item, i) => {
                i == al ? (item.value = 100) : (item.value = null);
              });
            }
          "
        />
        <q-btn
          v-if="al != 0"
          round
          dense
          flat
          icon="close"
          @click="removeAnswerList()"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    question_list: {
      type: Object
    },
    answer_list: {
      type: Object
    },
    al: {
      type: Number
    }
  },
  components: {
    TextAnswerList: () =>
      import("components/assigment/selectoptions_answerlist/type/Text.vue"),
    ImageAnswerList: () =>
      import("components/assigment/selectoptions_answerlist/type/Image.vue")
  },
  computed: {
    answerListIcon: function() {
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
    }
  },
  data() {
    return {
      showing: false,
      answer_list_type: "text"
    };
  },
  methods: {
    removeAnswerList() {
      this.$emit("removeAnswerList", {
        question_list: this.question_list,
        index: this.al
      });
    },
    setAnswerListType(type) {
      // this.answer_list_type = type;
      console.log("emit setAnswerListType");
      this.$emit("setAnswerListType", { answer_list: this.answer_list, type });
    }
  }
};
</script>
