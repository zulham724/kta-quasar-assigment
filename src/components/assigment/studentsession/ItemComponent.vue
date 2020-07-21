<template>
  <q-card
    :class="session.assigments[0].pivot.total_score == null ? 'bg-red-11' : 'bg-blue-11'"
    @click="
      $router.push({ name: 'studentresult', params: { sessionId: session.id } })
    "
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <q-img
            :src="`${Setting.storageUrl}/${session.user.avatar}`"
            width="15vw"
            no-default-spinner
          />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label lines="3">{{ session.user.name }}</q-item-label>
      </q-item-section>

      <q-item-section side top v-if="session.assigments[0].pivot.total_score == null">
        <q-icon name="warning" color="yellow" />
        <q-item-label caption>Belum dinilai</q-item-label>
      </q-item-section>
      <q-item-section side top v-else>
        <q-item-label caption>Nilai</q-item-label>
        <div class="row justify-end">
          <div class="text-black text-h5" style="bottom:0;position:absolute;">
            {{ session.assigments[0].pivot.total_score }}
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
import { mapState } from "vuex";
import { copyToClipboard } from "quasar";

export default {
  props: {
    session: null
  },
  computed: {
    ...mapState(["Auth", "Setting", "Assigment"])
  },
  mounted() {},
  methods: {
    copyCode(value) {
      copyToClipboard(value)
        .then(() => {
          this.$q.notify("Berhasil menyalin kode soal");
        })
        .catch(() => {
          this.$q.notify("Gagal menyalin kode soal");
        });
    },
    destroy() {}
  }
};
</script>

<style></style>
