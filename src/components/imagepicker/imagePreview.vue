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
        :disable="!isEnabled"
        v-if="isEnabled"
        style="position: absolute; top: 0; right: 0; background: rgba(0, 0, 0, 0.5)"
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
    isEnabled: {
      type: Boolean,
      default: true,
    },
    file: [File, Object, String],
    index: Number,
  },
  data() {
    return {
      preview: null,
    };
  },
  methods: {
    removeFile() {
      this.$emit("removeFile", this.index);
    },
    isFile(obj) {
      return obj instanceof File;
    },
  },
  // check apakah instance dri File

  mounted() {
    if (this.isFile(this.file)) this.preview = URL.createObjectURL(this.file);
    // jika bukan File, pasti object json
    else if (typeof this.file == "object") {
      this.preview = this.$store.getters["Setting/storageUrl"] + "/" + this.file.src;
      console.log("preview", this.preview);
    } else if (typeof this.file == "string") {
      this.preview = this.$store.getters["Setting/storageUrl"] + "/" + this.file;
      console.log("preview", this.preview);
    } else {
      this.$q.notify("Image preview gagal. Hrus file file,object,atau string");
    }
  },
  // con
};
</script>
