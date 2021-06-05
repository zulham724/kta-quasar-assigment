<template>
  <div class="q-gutter-xs">
    <div v-html="item.name"></div>
    <q-input
      :bg-color="answer_list.value ? 'green-4' : null"
      rounded
      readonly
      outlined
      dense
      autogrow
      v-for="answer_list in item.answer_lists"
      :key="`answer-${answer_list.id}`"
      :value="answer_list.name"
    >
    </q-input>
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  },
  mounted() {}
};
</script>
