<template>
  <div>
    <q-item clickable v-ripple v-if="comment != null">
      <q-item-section avatar>
        <q-avatar>
          <img :src="`${Setting.storageUrl}/${comment.user.avatar}`" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">{{ comment.user.name }}</q-item-label>
        <q-item-label caption lines="2">
          {{ comment.value }}
        </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-btn
          flat
          round
          :color="comment.liked_count ? 'red' : null"
          :icon="comment.liked_count ? 'favorite' : 'favorite_border'"
          @click="comment.liked_count ? dislike(comment.id) : like(comment.id)"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    comment: null
  },
  computed: {
    ...mapState(["Setting"])
  },
  methods: {
    like(commentId) {
      this.$store.dispatch("Comment/like", commentId).then(res => {
        this.comment.liked_count = res.data.liked_count
        this.comment.likes_count = res.data.likes_count
      });
    },
    dislike(commentId) {
      this.$store.dispatch("Comment/dislike", commentId).then(res => {
        this.comment.liked_count = res.data.liked_count
        this.comment.likes_count = res.data.likes_count
      });
    }
  }
};
</script>

<style></style>
