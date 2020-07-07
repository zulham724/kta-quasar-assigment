<template>
  <div>
    <q-infinite-scroll @load="onLoad" :offset="250">
      <div class="q-pa-none" v-if="Assigment.unpublish.data">
        <q-intersection v-for="(assigment,a) in Assigment.unpublish.data" :key="assigment.id">
          <q-list bordered class="rounded-borders">
            <q-expansion-item expand-separator :label="assigment.subject">
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar>
                    <q-img :src="`${Setting.storageUrl}/${assigment.user.avatar}`"></q-img>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{assigment.grade.description}} | {{assigment.assigment_category.description}}</q-item-label>
                  <q-item-label caption>{{assigment.subject}}</q-item-label>
                </q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <q-list
                    v-for="(question_list,ql) in assigment.question_lists"
                    :key="`${a}-${ql}-${assigment.id}-${question_list.id}`"
                  >
                    <q-item>
                      <q-item-section avatar>Soal {{ql+1}}.</q-item-section>
                      <q-item-section>
                        <q-item-label>
                          <div class="text-caption">{{ question_list.name }}</div>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          @click="$store.commit('Assigment/addQuestionList',{question_list:question_list})"
                        >Pilih</q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
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
    // AssigmentItemComponent: () =>
    //   import("components/assigment/ItemComponent.vue")
  },
  computed: {
    ...mapState(["Assigment", "Setting"])
  },
  created() {
    if (!this.Assigment.unpublish.data)
      this.$store.dispatch("Assigment/getUnpublish");
  },
  methods: {
    onLoad(index, done) {
      this.Assigment.unpublish.next_page_url
        ? this.$store.dispatch("Assigment/nextUnpublish").then(res => done())
        : done();
    },
    refresh(done) {
      this.$store.dispatch("Assigment/getUnpublish").then(res => {
        done();
      });
    }
  }
};
</script>

<style>
</style>
