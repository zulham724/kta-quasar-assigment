<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-cyan-7">
        <q-btn flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body1">Bagikan Soal</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-form class="q-gutter-sm q-pa-md" ref="form">
          <q-toggle
            v-model="assigmentUpdate.isTimer"
            label="Aktifkan untuk set timer ketika mengerjakan soal"
          ></q-toggle>
          <q-input
            v-if="assigmentUpdate.isTimer"
            type="number"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Timer dalam menit"
            v-model="assigmentUpdate.timer"
          />

         
          <q-toggle v-model="assigmentUpdate.is_public" label="Publikasikan siswa secara umum" />

          <q-input
            class="q-mb-lg"
            type="textarea"
            outlined
            rounded
            color="cyan-7"
            v-model="assigmentUpdate.note"
            label="Tulis sesuatu untuk murid"
            hint="contoh: Perhatikan soal dengan baik dan juga jangan sampai telat mengerjakan karena ada batas waktu"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
            
            <div class="row justify-between">
              <q-btn flat @click="step = 1" color="cyan-7" label="Back" class="q-ml-sm" />
              <q-btn
                :loading="loading"
                :disabled="loading"
                label="Bagikan"
                outline
                rounded
                type="submit"
                color="cyan-7"
                @click="setAssigmentToPublic()"
              />
            </div>
    </q-form>


  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { debounce } from "quasar";
import axios from "axios";

export default {
  props: {
    assigmentId: null,
    assigment:null,
  },
  data() {
    return {
      loading: false,
      search: {
        dispay: false,
        key: ""
      },
      assigmentUpdate:{
          is_public:false,
          isTimer:false,
          note:null,
          timer:null,
      },
     
    };
  },
  components: {},
  mounted(){
      console.log(this.assigment)
  },
  computed: {
    ...mapState([
      "Auth",
      "Setting",
      "Assigment",
    ])
  },
  //   watch: {
  //     assigment: {
  //       handler: function() {
  //         this.$store.commit("Assigment/setBuild", { build: this.assigment });
  //       },
  //       deep: true
  //     }
  //   },
  created() {
    this.init();
    //this.$store.dispatch("AssigmentCategory/index");
    //this.getQuestionLists = debounce(this.getQuestionLists, 500);
  },
  methods: {
    debounce,
    init() {
    //   this.assigment = {
    //     id: this.assigmentId,
    //     ...this.Assigment.build
    //   };
    },
    setAssigmentToPublic() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$q.notify("Tunggu");
          //this.$router.push("/");

          axios
            .post(
              `${this.Setting.url}/api/v1/assigments/setpublic`,
              {id:this.assigment.id,...this.assigmentUpdate}
            )
            .then(res => {
              console.log(res.data);
              this.$q.notify("Berhasil mempublikasikan paket soal ke siswa");
              this.$router.back();
              this.loading = false;
            });
        }
      });
    },

  }
};
</script>

<style></style>
