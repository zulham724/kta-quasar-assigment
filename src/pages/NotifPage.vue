<template>
  <div>
    <q-header
      elevated
      :style="`background-image:url(${Setting.assets.bgToolbar});background-size:cover;`"
    >
      <q-toolbar>
        <q-icon name="home" style="font-size:1.5em" />
        <q-toolbar-title>
          Notifikasi
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
      <q-tab name="teacher" label="Guru" />
      <q-tab name="student" label="Murid" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="teacher">
        <div class="text-h6">Untuk Guru</div>
        Dalam kontruksi
      </q-tab-panel>

      <q-tab-panel name="student">
        <div class="text-h6">Untuk Murid</div>
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
