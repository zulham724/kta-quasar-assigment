<template>
  <div>
    <q-card flat bordered class="q-pa-sm">
      <!-- <div class="row text-center">
        <div class="col-12">
          <span class="text-caption"
            >Jawaban {{ String.fromCharCode("A".charCodeAt(0) + al) }}</span
          >
        </div>
      </div> -->
      {{ answer_list.name }}
    </q-card>
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
