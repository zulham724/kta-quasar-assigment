<template>
  <div style="width:100%" class="q-pr-sm q-pl-sm">
    <q-card
      class="q-pa-none"
      flat
      style="background-size:cover;
      background-image: url('statics/training-background.png');
      border-radius:15px;color:black"
      clickable
      @click="confirmJoinRoom"
    >
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col q-gutter-xs">
            <q-badge class="text-caption"
              ><q-icon size="xs" class="q-mr-xs" name="group" />{{
                room.code
              }}</q-badge
            >
            <q-badge class="text-caption"
              ><q-icon size="xs" class="q-mr-xs" name="date_range" />{{
                moment(room.created_at).format("DD MMMM YYYY HH:mm")
              }}</q-badge
            >
          </div>
          <div class="col-1">
            <q-btn @click.stop color="grey-7" round flat icon="more_vert">
              <q-menu auto-close afit anchor="bottom right" self="top right">
                <q-list>
                  <q-item clickable @click="copyCode(room.code)">
                    <q-item-section>Salin kode</q-item-section>
                  </q-item>
                  <q-item clickable @click="deleteRoom(room.id)">
                    <q-item-section>Hapus</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
        <div class="row">
          <div class="text-h5">{{ room.name }}</div>
        </div>
        <div class="row">
          <div class="text-caption">{{room.users_count-1}} partisipan</div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import moment from "moment";
import { copyToClipboard } from "quasar";

export default {
  props: {
    room: Object
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    confirmJoinRoom() {
      let message = "Mulai kelas ini?";
      this.$q
        .dialog({
          title: "Konfirmasi",
          message,
          cancel: true,
          persistent: false
        })
        .onOk(() => {
          this.loading = true;
          // console.log('>>>> OK')
          this.$store
            .dispatch("Room/join", this.room.code)
            .then(res => {
              // this.rooms = [res.data, ...this.rooms];
              this.$router.push({ name: "jitsi", params: { room: this.room } });
              // this.$q.notify("Berhasil bergabung");
            })
            .catch(err => {
              this.$q.notify("Gagal memulai kelas: "+err.message);
            })
            .finally(() => {
              this.loading = false;
            });

        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    copyCode(value) {
      if (this.$q.platform.is.mobile) {
        cordova.plugins.clipboard.copy(value);
      } else {
        copyToClipboard(value);
      }
      this.$q.notify("Berhasil menyalin kode kelas");
    },
    deleteRoom(id) {
      this.$Swal
        .fire({
          title: "Hapus kelas?",
          showCancelButton: true,
          confirmButtonText: `Hapus`
        })
        .then(result => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.$store.dispatch("Room/destroy", id).then(res => {
              this.$emit("deletedRoom", { room_id: id });
              // this.rooms.splice(index, 1);
              this.$Swal.fire("", "", "success");
            });
          }
        });
    }
  }
};
</script>
