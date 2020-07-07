<template>
  <div style="width:100%">
    <q-card class="my-card" v-if="assigment != null">
      <q-card-section style="padding-bottom:0">
        <div class="row">
          <div class="col-2 self-center">
            <q-avatar>
              <img :src="`${Setting.storageUrl}/${assigment.user.avatar}`" />
            </q-avatar>
          </div>
          <div class="col-8 self-center">
            <div class="row">
              <div class="col">
                <div class="text-caption q-ml-md">{{ assigment.user.name }}</div>
                <div
                  class="text-caption text-grey-9 q-ml-md"
                  v-if="assigment.is_publish"
                >Kode Soal [{{ assigment.code }}]</div>
              </div>
            </div>
          </div>
          <div class="col-2 self-center">
            <q-fab flat icon="more_vert" direction="left">
              <q-fab-action
                v-if="assigment.user.id == Auth.auth.id"
                color="red"
                icon="delete"
                @click="destroy()"
              />
              <q-fab-action
                color="secondary"
                icon="cloud_download"
                @click="$q.notify('Dalam kontruksi')"
              />
              <q-fab-action
                v-if="assigment.user.id == Auth.auth.id"
                color="indigo"
                icon="edit"
                @click="$router.push(`/assigment/${assigment.id}/edit`)"
              />
            </q-fab>
          </div>
        </div>
      </q-card-section>
      <q-card-section style="padding-bottom:0">
        <!-- <div class="text-caption">{{assigment.description}}</div> -->
        <div v-if="assigment.is_publish" class="text-caption">{{assigment.name}}</div>
        <div v-else class="text-caption">{{assigment.grade.description}} | {{assigment.subject}}</div>
        <q-carousel
          @click="
            $router.push(`/knowledgetest/${assigment.id}`)
          "
          v-model="slide"
          transition-prev="slide-right"
          transition-next="slide-left"
          animated
          infinite
          autoplay
          control-color="primary"
          class="rounded-borders"
          height="20vh"
          style="width:100%"
        >
          <q-carousel-slide
            v-for="(question_list, ql) in assigment.question_lists"
            :key="question_list.id"
            :name="ql"
            class="column no-wrap flex-center"
          >
            <div class="text-justify">
              <div class="text-body1">Soal {{ ql + 1 }}</div>
              <div class="text-caption">{{ question_list.name }}</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div
            class="col-6 self-center"
            @click="
              $router.push(`/comment/${assigment.id}`)
            "
          >
            <div
              class="text-caption text-grey"
            >{{assigment.comments.length ? `Lihat Semua ${assigment.comments.length} Komentar` : 'Lihat Komentar'}}</div>
          </div>
          <div class="col-6">
            <div class="row justify-end">
              <q-btn
                flat
                round
                :color="assigment.liked_count ? 'red': null"
                :icon="assigment.liked_count ? 'favorite': 'favorite_border'"
                @click="assigment.liked_count ? dislike() : like()"
              />
              <q-btn
                flat
                round
                icon="message"
                @click="
                $router.push(`/comment/${assigment.id}`)
              "
              />
            </div>
          </div>
        </div>
        <!-- <div class="row justify-between">
          <div class="text-caption text-green">Rata-rata nilai didapat 97</div>
          <div class="text-caption text-green">Tingkat kesulitan rendah</div>
        </div>-->
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    assigment: null
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
    destroy() {
      this.$q
        .dialog({
          title: "Yakin untuk hapus?",
          message: "Soal tidak akan dapat dikembalikan",
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch("Publish/destroy", this.assigment.id)
            .then(res => {
              this.$store.dispatch("Auth/getAuth");
              this.$q.notify("Berhasil menghapus soal");
            })
            .catch(err => {
              this.$q.notify("Terjadi kesalahan");
            });
        });
    },
    like() {
      this.$store.dispatch("Assigment/like", this.assigment.id).then(res => {
        this.assigment.liked_count = res.data.liked_count;
        this.assigment.likes_count = res.data.likes_count;
        this.$forceUpdate();
      });
    },
    dislike() {
      this.$store.dispatch("Assigment/dislike", this.assigment.id).then(res => {
        this.assigment.liked_count = res.data.liked_count;
        this.assigment.likes_count = res.data.likes_count;
        this.$forceUpdate();
      });
    }
  }
};
</script>

<style></style>
