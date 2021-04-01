<template>
  <div
    style="
      background-image: url('statics/images/payment.jpg');
      background-size: cover;
      height: 100vh;
    "
  >
    <div class="fixed-center text-center">
      <q-card style="width: 90vw">
        <q-stepper v-model="step" vertical color="blue" animated>
          <q-step
            :name="1"
            color="blue"
            title="Pilih Metode Pembayaran"
            icon="settings"
            :done="step > 1"
          >
            <div class="q-pa-sm">
              <div class="row">
                <div class="col-12" v-if="payment_vendors.length">
                  <q-btn
                    color="blue"
                    v-for="pv in payment_vendors"
                    :key="pv.id"
                    @click="() => step2(pv)"
                    :loading="loading"
                    :disable="loading"
                    >Transfer ke Bank {{ pv.service_code }}</q-btn
                  >
                </div>
                <div class="col-12" v-else>
                  <q-spinner-ios color="blue" size="2em" />
                </div>
              </div>
            </div>
          </q-step>

          <q-step
            :name="2"
            title="Pembayaran"
            color="blue"
            icon="create_new_folder"
            :done="step > 2"
          >
            <div class="text-body1 text-left" v-if="payment_vendor">
              Harap Melakukan Transfer ke
              <b>BANK {{ payment_vendor.service_code.toUpperCase() }}</b> -
              <b>{{ payment_vendor.account_number }}</b>
            </div>
            <div
              class="text-body1 text-bold text-left q-pt-md q-pb-md"
              v-if="payment_value"
            >
              Dengan Nominal Sebesar <br />Rp
              {{ payment_value.toLocaleString() }}
            </div>
            <div class="text-body1 text-left q-pb-md" v-if="payment_vendor">
              Harap transfer dengan <b>nominal yang sesuai</b> agar sistem dapat
              melakukan pengecekan dengan tepat
            </div>
            <div class="text-body1 text-left">
              Jika sudah melakukan pembayaran, silahkan tunggu
              <b>5 menit</b> kemudian <b>Lakukan Pengecekan</b> melalui tombol
              di bawah
            </div>
          </q-step>
        </q-stepper>
        <!-- <q-card-section>
                <p>
                    <img src="statics/images/agpaii-logo-blue.png" style="width:30vw;max-width:150px;">
                </p>
                <q-btn flat color="blue" style="width:200px;" label="Lakukan pembayaran" @click="createTransaction" />
                <q-btn color="blue" flat label="Konfirmasi" @click="check" />

                <div class="text-caption">
                    Silahkan lakukan pembayaran. Jika sudah membayar klik tombol
                    "Konfirmasi" untuk melakukan Verifikasi Pembayaran
                </div>
            </q-card-section>
            <q-card-actions class="row justify-end">
                <q-btn color="blue" flat label="Keluar" @click="logout" />
            </q-card-actions> -->
        <q-card-actions class="row justify-between">
          <q-btn color="blue" flat label="Keluar" @click="logout" />
          <q-btn
            color="blue"
            flat
            label="Lakukan Pengecekan"
            :loading="loading2"
            :disable="loading2"
            @click="check()"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      payment_value: null,
      step: 1,
      payment_vendors: [],
      payment_vendor: null,
    };
  },
  mounted() {
    this.getPaymentVendors();
  },
  methods: {
    getPaymentVendors() {
      this.$store.dispatch("Payment/getPaymentVendors").then((res) => {
        this.payment_vendors = res.data;
      });
    },
    step2(pv) {
      this.loading = true;
      this.getUniquePayment()
        .then((res) => {
          this.payment_vendor = pv;
          this.step = 2;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getUniquePayment() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.$store
          .dispatch("Payment/getUniquePayment", { payment_vendor: 1 })
          .then((res) => {
            this.loading = false;
            this.payment_value = res.data.value;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    check() {
      this.loading2 = true;
      this.$store
        .dispatch("Payment/confirmUniquePayment")
        .then((res) => {
          if (res.data.user_activated_at == null) {
            this.loading2 = false;
            this.$q.notify(
              "Belum ada pembayaran yang kami terima. Tolong periksa apakah nominal yang anda kirim sudah sesuai"
            );
          } else {
            this.$store.dispatch("Auth/getAuth").then((res) => {
              this.loading2 = false;
              this.$q.notify("Pembayaran anda sudah kami terima");
              this.$router.push("/");
            });
          }
        })
        .catch((err) => {
          console.log("error", err);
          if (err.response.status == 404) {
            this.$q.notify(
              "Belum ada pembayaran yang kami terima. Tolong periksa apakah nominal yang anda kirim sudah sesuai"
            );
          } else if (err.response.data && err.response.data.message)
            this.$q.notify(err.response.data.message);
          else this.$q.notify(err.message);
        })
        .finally((_) => {
          this.loading2 = false;
        });
    },
    logout() {
      this.$store.dispatch("Auth/logout").then(() => {
        this.$router.push("/login");
      });
    },
    createTransaction() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.$store.dispatch("Payment/getPaymentUrl").then((res) => {
          this.loading = false;
          if (this.$q.platform.is.mobile) {
            cordova.InAppBrowser.open(
              `${res.data.payment_url}`,
              "_system",
              "location=no"
            );
          } else {
            window.location.href = `${res.data.payment_url}`;
          }
        });
      });
    },
  },
};
</script>
