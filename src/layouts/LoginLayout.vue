<template>
  <div style="height:100vh;background-image:url('statics/splash.jpg');background-size:cover">
    <div class="q-pa-md full-height">
      <div class="row justify-center align-center content-center full-height full-width">
        <div class="col-12" style="margin-top:-30vh">
          <div class="row justify-center">
            <q-img src="statics/agpaii-logo-black.png" style="opacity:0.8" width="30vw"></q-img>
          </div>
          <div class="row justify-center q-mt-sm">
            <div class="text-body2">Silahkan login dengan akun KTA anda</div>
          </div>
        </div>
        <div class="col-12">
          <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
            <q-input
              style="opacity:0.8"
              bg-color="white"
              rounded
              outlined
              color="cyan-7"
              label="Email anda"
              v-model="credential.username"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please type something'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" size="xs" />
              </template>
            </q-input>
            <q-input
              style="opacity:0.8"
              bg-color="white"
              rounded
              outlined
              color="cyan-7"
              label="Password"
              v-model="credential.password"
              type="password"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please type something'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" size="xs" />
              </template>
            </q-input>
          </q-form>
        </div>
        <div class="col-12">
          <div class="row justify-end">
            <q-btn
              label="Submit"
              @click="onSubmit()"
              rounded
              outline
              type="submit"
              color="cyan-7"
              :loading="loading"
              :disable="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      credential: {},
      loading: false
    };
  },
  computed: {
    ...mapState(["Auth"])
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.loading = true;
          this.$store
            .dispatch("Auth/login", this.credential)
            .then(res => {
              this.$router.push("/");
              window.history.pushState(null, null, window.location.href);
            })
            .catch(err => {})
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style></style>
