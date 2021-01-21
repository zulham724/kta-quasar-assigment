<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-btn flat dense icon="arrow_back" @click="$router.push({name:'account',params:{tabName:'publish',assigmentIdtoScroll:assigmentId}})" />
        <q-toolbar-title>
          <div class="text-body1">Bagikan Soal Latihan Mandiri</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-form class="q-gutter-sm q-pa-md" ref="form" @submit="onSubmit">
          <q-toggle
            v-model="assigmentUpdate.isTimer"
            label="Aktifkan untuk set timer ketika mengerjakan soal"
          ></q-toggle>
          <q-input
            v-if="assigmentUpdate.isTimer"
            type="number"
            rounded
            color="blue"
            outlined
            dense
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Timer dalam menit"
            v-model="assigmentUpdate.timer"
          />

         
          <!--<q-toggle v-model="assigmentUpdate.is_public" label="Publikasikan siswa secara umum" />-->

          <q-input
            class="q-mb-lg"
            type="textarea"
            outlined
            rounded
            color="blue"
            v-model="assigmentUpdate.note"
            label="Tulis sesuatu untuk murid"
            hint="contoh: Perhatikan soal dengan baik dan juga jangan sampai telat mengerjakan karena ada batas waktu"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />
            
            <div class="row justify-between">
              <q-btn flat @click="step = 1" color="blue"  label="Back" class="q-ml-sm" />
              <q-btn
                :loading="loading"
                :disabled="loading"
                label="Bagikan"
                outline
                rounded
                type="submit"
                color="blue"
              />
            </div>
    </q-form>


  </div>
</template>

<script>
import {mapState } from "vuex";
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
          is_public:true,
          isTimer:false,
          note:null,
          timer:null,
      },
     
    };
  },
  components: {},
  mounted(){
    

      // console.log(this.Auth.auth);
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
    if(this.assigment==null){
      this.$router.back();
      return;
    }
    this.assigmentUpdate={...this.assigment, isTimer:this.assigment.isTimer?true:false/*, is_public:this.assigment.is_public?true:false*/};
    this.assigmentUpdate.is_public=true
    // console.log(this.assigmentUpdate)
    //this.$store.dispatch("AssigmentCategory/index");
    //this.getQuestionLists = debounce(this.getQuestionLists, 500);
  },
  methods: {
    onSubmit() {
     
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
              this.$store.dispatch("Auth/getAuth")
              if(!this.assigment.is_public)this.$q.notify("Berhasil mempublikasikan paket soal ke siswa");
              else this.$q.notify("Berhasil mengedit paket soal yang dipublikasikan ke siswa");
              this.loading = false;
              this.$router.push({name:'account',params:{tabName:'publish',assigmentIdtoScroll:this.assigmentId}})
            });
        }
      });
      return false;
    },

  }
};
</script>

<style></style>
