<template>
<div>
  <q-img :src="preview" width="100px">
    <!-- <q-badge
      color="white"
      floating
      outline
      >{{ index + 1 }}</q-badge
    > -->
    <q-btn
      style="position:absolute; top:0;right:0;background: rgba(0, 0, 0, 0.5);"
      color="red"
      flat
      dense
      icon="close"
      @click="removeFile()"
    />
  </q-img>
  </div>
</template>
<script>
export default {
  props: {
    file: File,
    index: Number,
  },
  data(){
      return{
          preview:null
      }
  },
  methods: {
    removeFile() {
        this.$emit('removeFile', this.index);
    }
  },
  mounted(){
      this.preview= URL.createObjectURL(this.file)

    //   console.log(objectURL)
  }
};
</script>
