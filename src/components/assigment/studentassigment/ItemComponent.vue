<template>
  <q-card class="my-card" style="background:url('statics/bg-list.png');background-size:cover" @click="$router.push({name:'studentassigment',params:{assigmentId :assigment.id}})">
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <div class="text-weight-bold">{{assigment.name}}</div>
            <div class="text-weight-light">Kelas: {{assigment.grade.description}}</div>
            <div class="text-weight-light">Kode kelas: {{assigment.grade_code}}</div>
            <div class="text-weight-light">Semester: {{assigment.semester}}</div>
          </div>
          <div class="col-6 self-center " style="border-left: 1px solid black;">
            <div class="row justify-center" >
              <div class="row text-h3">
                 <div class="col-12">{{assigment.sessions_count}}</div>
              </div>
            </div>
             <div class="row justify-center" >
              <div class="row">
                 <div class="col-12">Sesi</div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions @click.stop="copyCode(assigment.code)">
         <div id="rcorners1">
          <div class="row">
            <div class="col-6">
                  Kode Soal<br>
              <div class="text-weight-bold"> {{assigment.code}}</div>
            </div>
            <div class="col-3 offset-2">
                  <q-btn @click.stop="copyCode(assigment.code)" flat round color="black" icon="content_copy" />

            </div>
          </div>
          
        </div>
      </q-card-actions>
      <div style="top:0;right:0;position:absolute">
        <div class="text-caption">Dibuat: {{moment(assigment.created_at).format('LLLL')}}</div>
     </div>
    </q-card>
</template>

<script>
import moment from 'moment';
import { mapState } from "vuex";
import { copyToClipboard } from 'quasar'

export default {
  props: {
    assigment: null
  },
  computed: {
    ...mapState(["Auth", "Setting", "Assigment"])
  },
  mounted() {

  },
  methods: {
    moment,
    copyCode(value){
       if(this.$q.platform.is.mobile){
            cordova.plugins.clipboard.copy(value);
        }else{
            copyToClipboard(value)
        }
        this.$q.notify('Berhasil menyalin kode soal');
    },
    destroy() {
    }
  }
};
</script>

<style>
</style>
