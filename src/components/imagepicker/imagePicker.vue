<template>
  <div>
    <div class="row q-gutter-md" v-show="isEnabled">
      <q-file
        v-show="false"
        @input="inputFile"
        multiple
        ref="filePicker"
        label="Standard"
      />
      <div class="col-1">
        <q-btn
          round
          @click="addImage"
          :disable="!isEnabled"
          color="blue"
          icon="add"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
      <div class="col self-center">
        <span class="text-caption text-grey-6">Tambah gambar</span>
      </div>
    </div>
    <div class="row q-gutter-xs">
      <div class="col-sm-3" v-for="(file, i) in files" :key="file.id">
        <image-preview
          :is-enabled="isEnabled"
          @removeFile="removeFile"
          :file="file"
          :index="i"
        />
        <!-- <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" style="width: 100%"/> -->
      </div>
    </div>
  </div>
</template>
<script>
import imagePreview from "./imagePreview.vue";
export default {
  components: { imagePreview },
  props: {
    isEnabled: {
      type: Boolean,
      default: true,
    },
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      files: [],
    };
  },
  watch: {
    images: function (val) {
      console.log("watch images prop in imagePicker.vue");
      this.files = val;
    },
    // modelImages:function(val){
    //     // this.push
    // }
  },
  created() {
    console.log("imagePicker", this.images);
    this.files = this.images;
  },
  methods: {
    removeFile(index) {
      console.log("removeFile index", index);
      this.files.splice(index, 1);
      this.$emit("update:images", this.files);
    },
    inputFile(files) {
      files.forEach((v) => {
        v.id = v.name + "_" + Math.round(Math.random() * v.lastModified); //id digunakan sebagai :key v-for
        this.files.push(v);
      });
      this.$emit("update:images", this.files);
      // console.log('inputFile',value);
    },
    addImage() {
      this.$refs.filePicker.pickFiles();
      // console.log('asu')
    },
  },
};
</script>
