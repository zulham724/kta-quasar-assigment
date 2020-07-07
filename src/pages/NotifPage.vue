<template>
  <div>
    <q-header
      elevated
    >
      <q-toolbar class="bg-cyan-7">
        <q-icon name="home" style="font-size:1.5em" />
        <q-toolbar-title>
          <div class="text-body1">Hasil</div>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-tabs
      v-model="tab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="teacher" class="q-pa-sm">
        <div class="text-caption">Kegiatan Penilaian</div>
      </q-tab>
      <q-tab name="grade" class="q-pa-sm">
        <div class="text-caption">Kelas</div>
      </q-tab>
      <q-tab name="students_count" class="q-pa-sm">
        <div class="text-caption">Jumlah Siswa</div>
      </q-tab>
      <q-tab name="download" class="q-pa-sm">
        <div class="text-caption">Download</div>
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="teacher">
        <div class="text-h6">Untuk Kegiatan</div>
        Dalam kontruksi
      </q-tab-panel>

      <q-tab-panel name="grade">
        <div class="text-h6">Untuk Kelas</div>
        Dalam kontruksi
      </q-tab-panel>

      <q-tab-panel name="students_count">
        <div class="text-h6">Untuk Jumlah Siswa</div>
        Dalam kontruksi
      </q-tab-panel>

      <q-tab-panel name="download">
        <div class="text-h6">Untuk Download</div>
        Dalam kontruksi
      </q-tab-panel>

    </q-tab-panels>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data(){
    return {
      tab: 'teacher'
    }
  },
  computed:{
    ...mapState(['Setting'])
  },
  mounted(){
  }
};
</script>

<style></style>
