<template>
  <div>
    <q-card flat bordered>
      <div class="row text-center">
          <div class="col-12">
              <span class="text-caption">Jawaban {{ String.fromCharCode("A".charCodeAt(0) + al) }}</span
        >
          </div>
        
      </div>
      <q-card-section>
        <image-picker class="q-mb-sm" :images.sync="answer_list.images" />
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  props: {
    answer_list: Object,
    al: Number
  },
  components: {
    ImagePicker: () => import("components/imagepicker/imagePicker.vue")
  }
};
</script>
