<template>
  <div>
    <q-input
      v-model="answer_list.name"
      rounded
      color="blue"
      :readonly="editable ? false : true"
      outlined
      autogrow
      dense
      :label="String.fromCharCode('A'.charCodeAt(0) + al)"
      hint="Butir jawaban"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Harus diisi']"
    >
      <!-- <template v-slot:after>
           
          </template> -->
    </q-input>
  </div>
</template>
<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    answer_list: Object,
    al: Number,
  },
};
</script>
