<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Soal berhasil dibagikan</div>
        <div class="text-body2">
          <div class="row">
            Silahkan salin kode soal berikut:
            <q-badge @click="copyCode" class="q-ml-xs"
              >{{ code }} <q-icon class="q-ml-xs" name="content_copy" size="xs"
            /></q-badge>
          </div>
        </div>
        <div class="text-caption">
          Paket soal yang telah dikerjakan dapat dilihat di menu Hasil
          <q-icon name="poll"></q-icon>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import { date } from "quasar";
import { copyToClipboard } from "quasar";

export default {
  props: {
    code: null
  },
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  data() {
    return {
      slide: 0
    };
  },
  created() {},
  methods: {
    copyCode() {
      copyToClipboard(this.code)
        .then(() => {
            this.$q.notify('Berhasil menyalin kode soal')
        })
        .catch(() => {
          this.$q.notify('Gagal menyalin kode soal')
        });
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  }
};
</script>

<style></style>
