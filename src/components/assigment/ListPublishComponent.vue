<template>
  <div>
      <q-infinite-scroll @load="onLoad" :offset="250">
      <div class="q-pt-md row items-start q-gutter-md" v-if="Assigment.publish.data">
        <q-intersection
          v-for="(assigment) in Assigment.publish.data"
          :key="assigment.id"
          :style="`min-height: 45vh;width: 100vw`"
        >
          <assigment-item-component :assigment="assigment"></assigment-item-component>
        </q-intersection>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
      </q-infinite-scroll>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    AssigmentItemComponent: () =>
      import("components/assigment/ItemComponent.vue"),
  },
  computed: {
    ...mapState(["Assigment", "Setting"])
  },
  created(){
    if (!this.Assigment.publish.data)
      this.$store.dispatch("Assigment/getPublish");
  },
  methods: {
    onLoad(index, done) {
      this.Assigment.publish.next_page_url
        ? this.$store.dispatch("Assigment/nextPublish").then(res => done())
        : done();
    },
    refresh(done) {
      this.$store.dispatch("Assigment/getPublish").then(res => {
        done();
      });
    }
  }
};
</script>

<style>
</style>
