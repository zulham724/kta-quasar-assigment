<template>
  <div>
    <q-header elevated>
      <q-toolbar class="bg-blue">
        <q-btn flat dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title>
          <div class="text-body1">Bagikan Soal</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-form class="q-gutter-sm q-pa-md" ref="form" @submit="shareAssigment">
      <q-toggle
        v-model="isTimer"
        label="Aktifkan untuk set timer ketika mengerjakan soal"
      ></q-toggle>
      <q-input
        v-if="isTimer"
        type="number"
        rounded
        color="blue"
        outlined
        dense
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Harus diisi']"
        label="Timer dalam menit"
        v-model="assigment.timer"
      />
      <q-toggle
        v-model="isExpired"
        label="Aktifkan tanggal berlaku untuk soal? Seperti ketika anda ingin membuat soal ujian yang hanya bisa diisi/dibuka pada hari dan jam tertentu"
      />
      <q-input
        v-if="isExpired"
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
              <q-time
                v-model="assigment.start_at"
                mask="YYYY-MM-DD HH:mm"
                format24h
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        v-if="isExpired"
        rounded
        color="blue"
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
              <q-time
                v-model="assigment.end_at"
                mask="YYYY-MM-DD HH:mm"
                format24h
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-toggle v-model="isPassword" label="Aktifkan untuk mengunci soal" />
      <q-input
        v-if="isPassword"
        v-model="assigment.password"
        type="password"
        rounded
        color="blue"
        outlined
        dense
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Harus diisi']"
        label="Kunci Penilaian"
      />

      <q-input
        outlined
        rounded
        color="blue"
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
        color="blue"
        v-model="assigment.note"
        label="Tulis sesuatu untuk murid"
        hint="contoh: Perhatikan soal dengan baik dan juga jangan sampai telat mengerjakan karena ada batas waktu"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Harus diisi']"
      />

      <div class="row justify-between">
        <q-btn
          flat
          @click="step = 1"
          color="blue"
          label="Back"
          class="q-ml-sm"
        />
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
import { mapGetters, mapState } from "vuex";
import DialogComponent from "components/assigment/publish/DialogComponent.vue";

export default {
  props: {
    assigmentId: null
  },
  data() {
    return {
      isTimer: false,
      isExpired: false,
      isPassword: false,
      loading: false,
      step: 1,
      assigment: {
        timer: null,
        end_at: null,
        start_at: null,
        password: null
      },
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
  components: {},
  computed: {
    ...mapState(["Grade", "Auth", "Setting", "Assigment"])
  },
  watch: {
    // isTimer:function(val){
    //   if(val)this.timer=null;
    //   else this.timer=60;
    // },
    // isPassword:function(val){
    // }
  },
  mounted() {},
  created() {
    this.init();
    //this.$store.dispatch("AssigmentCategory/index");
    //this.getQuestionLists = debounce(this.getQuestionLists, 500);
  },
  methods: {
    init() {
      this.assigment = {
        id: this.assigmentId,
        timer: null,
        start_at: null,
        end_at: null,
        password: null,
        note: null,
        grade_code: null
      };

      // console.log(this.assigment);
      //if (this.Grade.grades.length == 0) this.$store.dispatch("Grade/index");
      //this.$forceUpdate();
    },
    shareAssigment() {
      //return;
      console.log("sharePage", this.assigment);
      // return;
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$q.notify("Tunggu");
          //this.$router.push("/");
          // console.log(this.assigment)
          // return;
          if(!this.isTimer)this.assigment.timer=null;
          if(!this.isPassword)this.assigment.password=null;
          if(!this.isExpired){
            this.assigment.start_at=null;
            this.assigment.end_at=null;
          }
          this.$store
            .dispatch("Publish/shareAssigment", this.assigment)
            .then(res => {
              this.$q.notify("Soal berhasil dibagikan");
              this.$q
                .dialog({
                  component: DialogComponent,
                  parent: this,
                  code: res.data.code
                })
                .onOk(() => {
                  this.$router.push("/");
                })
                .onCancel(() => {
                  this.$router.push("/");
                })
                .onDismiss(() => {
                  this.$router.push("/");
                });
            })
            .catch(err => {
              this.$q.notify("Terjadi kesalahan");
              //console.log(err)
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
      return false;
    }
  }
};
</script>

<style></style>
