<template>
  <div style="width: 100%" class="q-pr-sm q-pl-sm">
    <q-list
      bordered
      class="rounded-borders"
      v-if="assigment"
      style="border: 1px solid #1976d2"
    >
      <q-expansion-item expand-separator :label="assigment.subject">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar>
              <q-img :src="`${Setting.storageUrl}/${assigment.user.avatar}`">
                <template v-slot:loading> </template>
              </q-img>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ assigment.user.name }}</q-item-label>
            <q-item-label>
              <div class="q-gutter-sm">
                <q-badge color="blue">{{ assigment.grade.description }}</q-badge>
                <q-badge color="blue">{{
                  assigment.assigment_category.description
                }}</q-badge>
                <q-badge color="blue">{{
                  assigment.question_lists[0]
                    ? assigment.question_lists[0].assigment_types
                      ? assigment.question_lists[0].assigment_types[0].name
                      : null
                    : null
                }}</q-badge>
              </div>
            </q-item-label>
            <q-item-label caption>{{ assigment.subject }}</q-item-label>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <q-list>
              <q-item
                v-for="(question_list, ql) in assigment.question_lists"
                :key="`${ql}-${assigment.id}-${question_list.id}`"
              >
                <q-item-section>
                  <q-item-label>
                    <div
                      class="text-caption"
                      v-html="`Soal ${ql + 1} ${question_list.name}`"
                    ></div>
                    <div class="row">
                      <div
                        class="col-3"
                        v-for="image in question_list.images"
                        :key="image.id"
                      >
                        <q-img :src="`${Setting.storageUrl}/${image.src}`"></q-img>
                      </div>
                    </div>
                    <div class="row justify-center">
                      <q-btn
                        v-if="ruleAddQuestionList(assigment)"
                        flat
                        @click="addQuestionList(question_list)"
                        >Pilih Soal {{ ql + 1 }}</q-btn
                      >
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div class="row justify-between" v-if="assigment.user.id == Auth.auth.id">
              <q-btn flat label="Hapus" @click="destroy()"></q-btn>
              <q-btn
                flat
                label="Edit"
                @click="$router.push(`/assigment/${assigment.id}/edit`)"
              ></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    assigment: null,
  },
  computed: {
    ...mapState(["Auth", "Setting", "Assigment"]),
  },
  mounted() {},
  methods: {
    addQuestionList(question_list) {
      this.$q.notify({
        position: "top",
        message: "Berhasil ditambahkan ke rakit soal",
      });
      this.$store.commit("Assigment/addQuestionList", {
        question_list: question_list,
      });
    },
    destroy() {
      this.$q
        .dialog({
          title: "Yakin untuk hapus?",
          message: "Soal tidak akan dapat dikembalikan",
          cancel: true,
        })
        .onOk(() => {
          this.$store
            .dispatch("Unpublish/destroy", this.assigment.id)
            .then((res) => {
              this.$store.dispatch("Auth/getAuth");
              this.$q.notify("Berhasil menghapus soal");
            })
            .catch((err) => {
              this.$q.notify("Terjadi kesalahan");
            });
        });
    },
    ruleAddQuestionList(assigment) {
      if (this.Assigment.build.assigment_category_id == 9) {
        if (
          assigment.assigment_category_id == 1 ||
          assigment.assigment_category_id == 7 ||
          assigment.assigment_category_id == 8
        ) {
          if (
            assigment.grade.educational_level_id ==
            this.Auth.auth.profile.educational_level_id
          ) {
            return true;
          }
        }
      }
      if (assigment.assigment_category_id == this.Assigment.build.assigment_category_id) {
        if (
          assigment.grade.educational_level_id ==
          this.Auth.auth.profile.educational_level_id
        ) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style></style>
