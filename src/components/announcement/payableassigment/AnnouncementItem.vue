<template>
  <div>
    <q-item
      clickable
      @click="goToResult(item.data.assigment.id)"
      :disable="loading"
    >
      <!-- <q-item-section avatar top>
            <q-avatar size="3.5rem">
                <q-img v-if="item.data.data.session.user" :src="`${Setting.storageUrl}/${item.data.data.session.user.avatar}`"></q-img>
            </q-avatar>
        </q-item-section> -->
      <q-item-section top>
        <q-item-label>
          <b>Selamat, </b>
          paket soal '<b>{{ item.data.assigment.name }}</b
          >' Anda dapat berprofit!
        </q-item-label>
        <q-item-label caption>
          <div>{{ item.created_at | moment("from", "now") }}</div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    item: {}
  },
  computed: {
    ...mapState(["Setting", "EchoNotification"])
    // getMsg: function () {
    //     return this.item.data.data.likeable.body.length <= 30 ? this.item.data.data.likeable.body : this.item.data.data.likeable.body.substr(0, 30) + '....';
    // }
  },
  data() {
    return {
      loading: false
    };
  },
  created: function() {
    console.log("payable assigment");
    console.log(this.item);
  },
  methods: {
    goToResult: function(assigment_id) {
      this.$router.push({
        name: "payableassigment",
        params: {
          tabInit: "question_package",
          elementId: assigment_id + ""
        }
      });
    }
  },
  mounted() {}
};
</script>
