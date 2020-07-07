<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header
        elevated
      >
        <q-toolbar class="bg-cyan-7">
          <q-btn flat dense icon="arrow_back" @click="$router.back()" />
          <q-toolbar-title>
            Komentar
          </q-toolbar-title>
          <q-space />
        </q-toolbar>
      </q-header>
      <q-page-container v-if="assigment != null">
        <div class="q-pa-sm">
          <div class="row">
            <div class="col-2 self-center">
              <q-avatar>
                <img :src="`${Setting.storageUrl}/${assigment.user.avatar}`" />
              </q-avatar>
            </div>
            <div class="col-10 self-center">
              <div class="text-body1">{{ assigment.user.name }}</div>
            </div>
          </div>
        </div>
        <div class="q-pa-sm">
          <div class="row">
            <div class="text-caption">{{assigment.description}}</div>
          </div>
        </div>
        <q-carousel
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
              <div class="text-body1">Soal nomor {{ ql + 1 }}</div>
              {{ question_list.name }}
            </div>
          </q-carousel-slide>
        </q-carousel>
        <q-list bordered class="rounded-borders">
          <q-item-label header>Komentar</q-item-label>

          <comment-item-component v-for="comment in assigment.comments" :key="comment.id" :comment="comment"></comment-item-component>
        </q-list>
      </q-page-container>
      <q-footer style="padding:5px;background-color:white">
        <q-input dense label="Tulis sesuatu" v-model="comment.value" flat bg-color="white">
          <template v-slot:after>
            <div>
              <q-btn flat round icon="send" :loading="loading" :disable="loading" @click="store()" />
            </div>
          </template>
        </q-input>
      </q-footer>
    </q-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components:{
    CommentItemComponent: ()=> import('components/CommentItemComponent')
  },
  props: {
    assigmentId: null
  },
  computed: {
    ...mapState(["Setting", "Auth"])
  },
  data() {
    return {
      assigment: null,
      slide: 0,
      loading: false,
      comment: {
        value: ""
      }
    };
  },
  mounted() {
    this.getAssigment();
  },
  methods: {
    getAssigment() {
      this.$store.dispatch("Assigment/show", this.assigmentId).then(res => {
        this.assigment = res.data;
      });
    },
    store() {
      this.loading = true
      const payload = {
        assigment_id: this.assigment.id,
        user_id: this.Auth.auth.id,
        value: this.comment.value
      };
      this.$store
        .dispatch("Comment/store", payload)
        .then(res => {
            this.assigment.comments.splice(0, 0, res.data);
            this.assigment.comments_like += 1;
            this.comment.value = ''
        })
        .catch(err => {})
        .finally(()=>{
          this.loading = false
        })
    }
  }
};
</script>

<style></style>
