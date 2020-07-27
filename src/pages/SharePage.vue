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
            v-model="assigment.isTimer"
            label="Aktifkan untuk set timer ketika mengerjakan soal"
          ></q-toggle>
          <q-input
            v-if="assigment.isTimer"
            type="number"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Timer dalam menit"
            v-model="assigment.timer"
          />
          <q-toggle
            v-model="assigment.isExpire"
            label="Aktifkan tanggal berlaku untuk soal? Seperti ketika anda ingin membuat soal ujian yang hanya bisa diisi/dibuka pada hari dan jam tertentu"
          />
          <q-input
            v-if="assigment.isExpire"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            v-model="assigment.start_at"
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Dari"
            disabled
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="assigment.start_at" mask="YYYY-MM-DD HH:mm" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="assigment.start_at" mask="YYYY-MM-DD HH:mm" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-if="assigment.isExpire"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            v-model="assigment.end_at"
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Sampai"
            disabled
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="assigment.end_at" mask="YYYY-MM-DD HH:mm" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="assigment.end_at" mask="YYYY-MM-DD HH:mm" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-toggle v-model="assigment.isPassword" label="Aktifkan untuk mengunci soal" />
          <q-input
            v-if="assigment.isPassword"
            v-model="assigment.password"
            type="password"
            rounded
            color="cyan-7"
            outlined
            dense
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
            label="Kunci Penilaian"
          />

        <q-input
            outlined
            rounded
            color="cyan-7"
            v-model="assigment.grade_code"
            label="Kode kelas"
            hint=""
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Harus diisi']"
          />

          <q-input
            class="q-mb-lg"
            type="textarea"
            outlined
            rounded
            color="cyan-7"
            v-model="assigment.note"
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
                @click="shareAssigment()"
              />
            </div>
    </q-form>

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import axios from "axios";

export default {
props: {
    assigmentId: null
  },
  data() {
    return {
      loading: false,
      step: 1,
      assigment: null,
      search: {
        dispay: false,
        key: ""
      },
      question_lists: [],
      semesters: ["Gasal", "Genap"],
      names: [
        "Penilaian Harian",
        "Penilaian Tengah Semester",
        "Penilaian Akhir Semester",
        "Penilaian Akhir Tahun",
        "Ujian Sekolah",
        "Try Out"
      ]
    };
  },
  components: {
    
  },
  computed: {
    ...mapState(["Grade", "Auth", "Setting", "Assigment"])
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
    this.$store.dispatch("AssigmentCategory/index");
    //this.getQuestionLists = debounce(this.getQuestionLists, 500);
  },
  methods: {
    init() {
      this.assigment = {
          id:this.assigmentId,
        ...this.Assigment.build
      };
      delete this.assigment.question_lists;
      delete this.assigment.grade_id;
      console.log(this.assigment)
      if (this.Grade.grades.length == 0) this.$store.dispatch("Grade/index");
      //this.$forceUpdate();
    },
    shareAssigment() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$q.notify("Tunggu");
          //this.$router.push("/");
          delete this.assigment.grade_id;
          
          axios.post(`${this.Setting.url}/api/v1/assigments/share`, this.assigment)
                .then(res => {
                    this.$q.dialog({
                      title: 'Berhasil dibagikan',
                      message: `Silahkan salin kode soal berikut: <b>${res.data.code}</b><br><div class='text-caption'>Paket soal yang telah dibuat dapat dilihat di menu Hasil</div>`,
                      html: true
                      }).onOk(() => {
                          this.$router.push("/");
                      }).onCancel(() => {
                          this.$router.push("/");
                      }).onDismiss(() => {
                          this.$router.push("/");
                    })
                })
                .catch(err => {
                    this.$q.notify("Terjadi kesalahan");
                }).finally(() => {
                  this.loading = false;
                });
        }
      });
    },
    onLoad(index,done){
      this.SuggestedQuestionList.items.next_page_url
        ? this.$store.dispatch("SuggestedQuestionList/next").then(res => done())
        : done();
    },
  }
};
</script>

<style></style>
