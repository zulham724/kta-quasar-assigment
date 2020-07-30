<template>
  <div style="height:100vh;background-image:url('statics/bg-login-2.png');background-size:cover;">
    <div class="q-pa-lg">
      <div class="row justify-center" style="margin-top:40vh">
        <div class="col-12" >
          <div class="row">
            <q-img src="statics/logo-login.png" width="50vw"></q-img>
          </div>
        </div>
        <div class="col-12">
          <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
            <q-input
              color="white"
              dark
              dense
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
               color="white"
              dark
              dense
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
              flat
              class="bg-light-blue"
              type="submit"
              color="white"
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
            .catch(err => {
              this.$q.notify("Email atau password Anda salah")
            })
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
