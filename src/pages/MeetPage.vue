<template>
  <div>
    <q-header>
      <q-toolbar class="bg-white">
        <q-icon color="dark" name="record_voice_over" size="sm" />
        <q-toolbar-title>
          <div class="text-body2 text-dark text-bold">Kelas</div>
        </q-toolbar-title>
        <q-btn flat round icon="add" color="dark" @click="openMenu()"></q-btn>
      </q-toolbar>
    </q-header>
    <q-input filled type="search" color="dark" label="cari">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-list separator>
      <q-item v-for="room in filteredRooms" :key="`room-${room.id}`">
        <q-item-section
          @click="$router.push({ name: 'jitsi', params: { room: room } })"
          ><div class="text-body2">
            <q-icon name="chevron_right"></q-icon>
            {{ room.name }}
          </div></q-item-section
        >
        <q-item-section side>
          <q-btn flat round color="dark" icon="more_horiz">
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item
                  clickable
                  v-close-popup
                  @click="
                    () => {
                      code = room.code;
                      dialogCode = true;
                    }
                  "
                >
                  <q-item-section>
                    <div class="text-caption">
                      <q-icon size="sm" name="qr_code" /> Tampilkan kode
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="deleteRoom(room.id)">
                  <q-item-section
                    ><div class="text-caption">
                      <q-icon size="sm" name="delete_outline" /> Hapus
                    </div></q-item-section
                  >
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="dialogCode">
      <q-card style="width: 70vw">
        <q-card-section class="text-center">
          <div class="text-body1">Kode meeting anda adalah</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center">
          <q-btn outline
            ><div class="text-body1 text-dark text-bold">{{ code }}</div></q-btn
          >
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogCreate" persistent>
      <q-card style="width: 70vw">
        <q-card-section class="text-center">
          <div class="text-body1 text-bold">Buat kelas</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            color="grey"
            v-model="roomName"
            outlined
            label="Masukan nama kelas"
          />
        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn
            flat
            label="Buat"
            :loading="loading"
            :disable="loading"
            @click="createRoom()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <q-dialog v-model="dialogJoin" persistent>
      <q-card style="width: 70vw">
        <q-card-section class="text-center">
          <div class="text-body1 text-bold">
            Bergabung dengan kelas menggunakan kode
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            color="grey"
            v-model="roomCode"
            outlined
            label="Masukan kode"
          />
        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn
            flat
            label="Gabung"
            :loading="loading"
            :disable="loading"
            @click="join()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      search:'',
      rooms: [],
      dialogCreate: false,
      dialogJoin: false,
      dialogCode: false,
      roomName: null,
      roomCode: null,
      code: null,
      loading: false,
    };
  },
  computed: {
    ...mapState(["Setting", "Room"]),
    filteredRooms: function() {
      if (!this.search) return this.rooms;
      return this.rooms.filter(e => {
        const search = this.search.toLowerCase();
        return e.name.toLowerCase().includes(search) || e.code.toLowerCase().includes(search);
      });
    }
  },
  mounted() {
    this.getRooms();
  },
  methods: {
    getRooms() {
      this.$store.dispatch("Room/index").then((res) => {
        this.rooms = [...res.data];
      });
    },
    deleteRoom(id) {
      Swal.fire({
        title: "Hapus kelas?",
        showCancelButton: true,
        confirmButtonText: `Hapus`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.$store.dispatch("Room/destroy", id).then((res) => {
            const index = this.rooms.findIndex((item) => item.id == id);
            this.rooms.splice(index, 1);
            Swal.fire("", "", "success");
          });
        }
      });
    },
    openMenu() {
      this.$q
        .bottomSheet({
          actions: [
            {
              label: "Buat kelas",
              icon: "add",
              color: "dark",
              id: "create",
            },
            {
              label: "Bergabung dengan kelas menggunakan kode",
              icon: "tag",
              color: "dark",
              id: "join",
            },
          ],
        })
        .onOk((action) => {
          // console.log('Action chosen:', action.id)
          if (action.id == "join") {
            this.dialogJoin = true;
          } else if (action.id == "create") {
            this.dialogCreate = true;
          }
        })
        .onCancel(() => {
          // console.log('Dismissed')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    createRoom() {
      if (this.roomName != null) {
        this.loading = true;
        this.$store
          .dispatch("Room/store", this.roomName)
          .then((res) => {
            this.rooms = [res.data, ...this.rooms];
            Swal.fire("Berhasil", "", "success");
            this.roomName = null;
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Gagal membuat!",
            });
          })
          .finally(() => {
            this.loading = false;
            this.dialogCreate = false;
          });
      }
    },
    join() {
      if (this.roomCode != null) {
        this.loading = true;
        this.$store
          .dispatch("Room/join", this.roomCode)
          .then((res) => {
            this.rooms = [res.data, ...this.rooms];
            Swal.fire("Berhasil bergabung", "", "success");
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Kode tidak ditemukan!",
            });
          })
          .finally(() => {
            this.loading = false;
            this.dialogJoin = false;
          });
      }
    },
  },
};
</script>

<style>
</style>
