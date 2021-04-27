<template>
  <q-card
    class="my-card"
    style="background: url('statics/bg-list.png'); background-size: cover"
  >
    <q-card-section>
      <div class="row">
        <div class="col-6">
          <div class="text-weight-bold">{{ assigment.name }}</div>
          <div class="text-weight-light">Kelas: {{ assigment.grade.description }}</div>
          <div class="text-weight-light">Kode kelas: {{ assigment.grade_code }}</div>
          <div class="text-weight-light">Semester: {{ assigment.semester }}</div>
        </div>
        <div class="col-6 self-center" style="border-left: 1px solid black">
          <div class="row justify-center">
           <div class="row ">
              <div class="col">
                <span class="text-h3">{{ assigment.sessions_count }}</span>
                <span class="text-subtitle1">x</span></div>
            </div>
          </div>
           <div class="row justify-center">
              dikerjakan
            </div>
         <div class="row justify-center">
            <div class="row" v-if="assigment.daily_sessions_count">
              <div class="col-12 text-green" >+{{assigment.daily_sessions_count}} pekerjaan baru</div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions  class="row q-gutter-sm">
      <!--tombol hapus-->
        <div class="col-5">
          <q-list dense>
            <q-slide-item
              style="border-radius: 2px 15px 15px 2px"
              @click.stop
              @left="onLeft"
            >
              <template v-slot:left>
                <q-icon name="restore" />
              </template>

              <q-item dense>
                <q-item-section avatar>
                  <q-icon name="double_arrow" />
                </q-item-section>
                <q-item-section> Pulihkan </q-item-section>
              </q-item>
            </q-slide-item>
          </q-list>
        </div>
        <div class="col">
          <q-badge rounded color="white"><span class="text-black text-caption">Dibuat {{assigment.created_at | moment("from", "now")}}</span></q-badge>
        </div>
      <!--end tombol hapus-->
    </q-card-actions>
    <div style="top: 0; right: 0; position: absolute">
      <div class="text-caption q-mx-sm">Dibuat pada {{ moment(assigment.created_at).format("LL") }}</div>
    </div>
  </q-card>
</template>

<script>
import { mapState } from "vuex";
import { copyToClipboard } from "quasar";
import moment from "moment";
export default {
  props: {
    assigment: {},
  },
  computed: {
    ...mapState(["Auth", "Setting"]),
  },
  mounted() {},
  methods: {
    moment,
    destroy() {},
    onLeft({ reset }) {
      this.$q
        .dialog({
          title: "Konfirmasi",
          cancel: true,
          message: "Yakin restore assigment ini?",
        })
        .onOk(() => {
          this.$store
            .dispatch("Assigment/restoreAssigment", { id: this.assigment.id })
            .then((res) => {
              console.log(res.data);
              
              this.$store.commit("DeletedStudentResult/deleteById", res.data.id);
              //restore
              this.$store.dispatch("StudentResult/add", res.data).then(res=>{
                this.$store.commit("StudentResult/sortItems");
              });
              

              reset();
              // this.$forceUpdate();
            });
          //  this.finalize(reset);
        })
        .onCancel(() => {
          reset();
          // this.$forceUpdate();
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    onRight({ reset }) {
      this.$q.notify("Right action triggered. Resetting in 1 second.");
      this.finalize(reset);
    },

    finalize(reset) {
      reset();
    },
  },
  beforeDestroy() {
    // clearTimeout(this.timer);
  },
};
</script>

<style></style>
