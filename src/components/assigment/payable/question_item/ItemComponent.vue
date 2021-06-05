<template>
  <div style="width:100%;" class="q-pr-sm q-pl-sm">
    <q-list bordered class="rounded-borders" style="border:1px solid #1976D2;">
      <q-expansion-item
        expand-separator
        :label="item.subject"
        :ref="`expandable_question_list-${item.id}`"
      >
        <template v-slot:header>
          <q-item-section>
            <q-item-label>{{ item.subject }}</q-item-label>
            <q-item-label>
              <div class="q-gutter-sm">
                <q-badge color="blue">{{ item.grade }}</q-badge>
                <q-badge color="blue">{{ item.assigment_category }}</q-badge>
                <q-badge color="blue">{{ item.assigment_type_name }}</q-badge>
                <q-badge color="blue"
                  >{{ item.scores_count }} dikerjakan</q-badge
                >
              </div>
            </q-item-label>
            <q-item-label caption>{{ getQuestionListName }}</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div v-if="item.assigment_type == 'selectoptions'">
              <SelectoptionsQuestionItem
                :item="item"
              ></SelectoptionsQuestionItem>
            </div>
            <div v-else-if="item.assigment_type == 'textarea'">
              <TextareaQuestionItem :item="item"></TextareaQuestionItem>
            </div>
            <div v-else>
              <TextfieldQuestionItem :item="item"></TextfieldQuestionItem>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              :disable="loading"
              @click="confirmPaid(0)"
              rounded
              color="red"
              label="Tolak Tawaran"
              icon="close"
            />
            <q-btn
              :disable="loading"
              @click="confirmPaid(1)"
              rounded
              color="primary"
              label="Jadikan berbayar"
              icon="money"
            />
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EventBus from "../../../../eventBus";

export default {
  props: {
    item: Object
  },
  data() {
    return {
      loading: false
    };
  },
  components: {
    SelectoptionsQuestionItem: () =>
      import("components/question_lists/selectoptions/ItemComponent.vue"),
    TextareaQuestionItem: () =>
      import("components/question_lists/textarea/ItemComponent.vue"),
    TextfieldQuestionItem: () =>
      import("components/question_lists/textfield/ItemComponent.vue")
  },
  computed: {
    ...mapState(["Auth", "Setting", "Assigment"]),
    getQuestionListName: function() {
      return this.item.name <= 50
        ? this.item.name
        : this.item.name.substr(0, 50) + "....";
    }
  },
  mounted() {
    this.$emit('handleScroll', this.item.id);
    // const event_id = 'SET_EXPANDABLE_QUESTION_ITEM_ID-'+this.item.id
    // console.log('item',event_id)
    // EventBus.$on(event_id, payload => {
    //   alert('payload eventBus',payload);
    //   // this.updateData(payload);
    // });
  },
  methods: {
    setExpandable() {
      const ref = this.$refs["expandable_question_list-" + this.item.id];
      console.log("ref child", ref);
      ref.toggle();
    },
    deleteNotification(notification_id) {
      this.$store.commit(
        "EchoNotification/deletePayableQuestionListNotification",
        notification_id
      );
    },
    confirmPaid(value) {
      if (value === 1) {
        this.$q
          .dialog({
            title: "Konfirmasi Soal Berbayar",
            message:
              "Sekali dijadikan berbayar, butir soal tidak dapat dirubah. Yakin?",
            cancel: true,
            ok: {
              label: "Ya"
            }
          })
          .onOk(() => {
            this.loading = true;
            this.$store
              .dispatch("PayableQuestionItem/setPaid", {
                question_list_id: this.item.id,
                value: 1
              })
              .then(res => {
                const notificationToDelete = res.notificationToDelete;
                if (notificationToDelete) {
                  this.deleteNotification(notificationToDelete.id);
                }

                this.$store.commit("PayableQuestionItem/setIsPaid", {
                  question_list_id: this.item.id,
                  value: res.is_paid
                });
                this.$store.commit(
                  "PayableQuestionItem/deleteItem",
                  this.item.id
                );
              })
              .catch(err => {
                this.$q.notify(err.message);
                console.log(err);
              })
              .finally(() => {
                this.loading = false;
              });
          });
      } else {
        this.$q
          .dialog({
            title: "Konfirmasi Tolak Tawaran Berbayar",
            message:
              "Anda menolak untuk menjadikan butir soal ini menjadi tawaran berbayar. Yakin? Pilihan tidak dapat diganti",
            cancel: true,
            ok: {
              label: "Ya"
            }
          })
          .onOk(() => {
            this.loading = true;
            this.$store
              .dispatch("PayableQuestionItem/setPaid", {
                question_list_id: this.item.id,
                value: 0
              })
              .then(res => {
                const notificationToDelete = res.notificationToDelete;
                if (notificationToDelete) {
                  this.deleteNotification(notificationToDelete.id);
                }

                this.$store.commit("PayableQuestionItem/setIsPaid", {
                  question_list_id: this.item.id,
                  value: res.is_paid
                });
                this.$store.commit(
                  "PayableQuestionItem/deleteItem",
                  this.item.id
                );
              })
              .catch(err => {
                this.$q.notify(err.message);
                console.log(err);
              })
              .finally(() => {
                this.loading = false;
              });
          });
      }
    }
  }
};
</script>

<style></style>
