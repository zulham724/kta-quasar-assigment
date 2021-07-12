<template>
  <div style="width: 100%; top: 10px" class="q-pr-sm q-pl-sm">
    <q-card flat bordered class="my-card" style="border: 1px solid #1976d2">
      <q-item>
        <q-item-section>
          <q-item-label caption>
            <div class="q-gutter-sm">
              <q-badge color="primary">Semester {{ item.semester }}</q-badge>
              <q-badge color="primary">
                {{ item.grade.description }}
              </q-badge>
              <q-badge color="primary"> {{ item.scores_count }} dikerjakan </q-badge>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="q-pl-md">
        {{ item.name }}
      </div>

      <q-card-section style="padding-bottom: 0px; padding-top: 0px">
        <!-- <div class="text-caption">{{assigment.description}}</div> -->

        <q-carousel
          @click="$router.push(`/knowledgetest/${item.id}`)"
          v-model="slide"
          transition-prev="slide-right"
          transition-next="slide-left"
          animated
          infinite
          autoplay
          control-color="primary"
          class="rounded-borders bg-grey-2"
          height="20vh"
          style="width: 100%"
        >
          <q-carousel-slide
            v-for="(question_list, ql) in item.question_lists"
            :key="question_list.id"
            :name="ql"
            class="column no-wrap flex-center"
          >
            <!--<div style="position:absolute;top:0;left:0;;border-bottom-right-radius:35px;" class="bg-blue q-pa-sm">
              sasd
            </div>-->
            <div class="text-justify">
              <div class="text-body1">Soal {{ ql + 1 }}</div>
              <div class="text-caption" v-html="question_list.name"></div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-card-section>

      <q-item dense>
        <q-item-section side>
          <q-item-label caption>{{
            item.created_at | moment("DD MMMM YYYY")
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <div class="row">
          <q-input
            dense
            label="Harga paket soal"
            rounded
            outlined
            type="number"
            v-model="is_paid"
          ></q-input>
        </div>
      </q-item>
      <q-card-actions align="right">
        <q-btn
          :disable="loading"
          @click="confirmPaid(0)"
          rounded
          class="bg-red-5 text-grey-1"
          label="Tolak Tawaran"
          icon="close"
          dense
        />
        <q-btn
          :disable="loading"
          @click="confirmPaid(1)"
          rounded
          dense
          color="primary"
          label="Jadikan berprofit"
          icon="check"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { date } from "quasar";
export default {
  props: {
    item: Object,
  },
  computed: {
    ...mapState(["Setting", "Auth"]),
    getDate() {
      return date.formatDate(this.item.created_at, "DD MMMM YYYY");
    },
  },
  mounted() {
    this.$emit("handleScroll", this.item.id);
  },
  data() {
    return {
      slide: 0,
      loading: false,
      is_paid: 2500,
    };
  },
  created() {},
  methods: {
    deleteNotification(notification_id) {
      this.$store.commit("EchoNotification/deleteNotificationById", notification_id);
    },
    setIsPaidAndDelete(res) {
      const notificationToDelete = res.notificationToDelete;
      if (notificationToDelete) {
        this.deleteNotification(notificationToDelete.id);
      }

      this.$store.commit("PayableQuestionPackage/setIsPaid", {
        question_list_id: this.item.id,
        value: res.is_paid,
      });
      this.$store.commit("PayableQuestionPackage/deleteItem", this.item.id);
    },
    confirmPaid(value) {
      if (value === 1) {
        if (this.is_paid <= 0) {
          this.$q.notify("Harga paket soal harus lebih dari 0");
          return;
        }
        this.$q
          .dialog({
            title: "Konfirmasi Soal Berprofit",
            message:
              "Soal akan dijadikan berprofit dengan harga Rp " +
              new Intl.NumberFormat("id-ID").format(this.is_paid) +
              ". Sekali dijadikan berprofit, paket soal tidak dapat dirubah. Yakin?",
            cancel: true,
            ok: {
              label: "Ya",
            },
          })
          .onOk(() => {
            this.loading = true;
            this.$store
              .dispatch("PayableQuestionPackage/setPaid", {
                assigment_id: this.item.id,
                value: this.is_paid,
              })
              .then((res) => {
                this.setIsPaidAndDelete(res);
              })
              .catch((err) => {
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
            title: "Konfirmasi Tolak Tawaran Berprofit",
            message:
              "Anda menolak untuk menjadikan butir soal ini menjadi tawaran berprofit. Yakin? Pilihan tidak dapat diganti",
            cancel: true,
            ok: {
              label: "Ya",
            },
          })
          .onOk(() => {
            this.loading = true;
            this.$store
              .dispatch("PayableQuestionPackage/setPaid", {
                assigment_id: this.item.id,
                value: 0,
              })
              .then((res) => {
                this.setIsPaidAndDelete(res);
              })
              .catch((err) => {
                this.$q.notify(err.message);
                console.log(err);
              })
              .finally(() => {
                this.loading = false;
              });
          });
      }
    },
  },
};
</script>

<style></style>
