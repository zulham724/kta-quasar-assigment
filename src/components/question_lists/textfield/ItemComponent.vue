<template>
  <div>
    <div v-html="item.name"></div>

    <q-input
      v-for="(answer_list, key) in item.answer_lists"
      :key="key"
      class="q-pa-sm"
      outlined
      dense
      readonly
      :label="`Kunci Jawaban ${key + 1}`"
      v-model="answer_list.name"
    />
   
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  }
};
</script>
