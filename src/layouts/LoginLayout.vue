<template>
  <div
    style="height:100vh;background-image:url('statics/bg-login.jpg');background-size:cover"
  >
    <div class="q-pa-md full-height">
      <div
        class="row justify-center align-center content-center full-height full-width"
      >
        <div class="col-12">
          <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
            <q-input
              style="opacity:0.8"
              bg-color="white"
              rounded
              outlined
              label="Email anda"
              v-model="credential.username"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please type something'
              ]"
            />
            <q-input
              style="opacity:0.8"
              bg-color="white"
              rounded
              outlined
              label="Password"
              v-model="credential.password"
              type="password"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please type something'
              ]"
            />
          </q-form>
        </div>
      </div>

      <q-btn
        style="position:absolute;bottom:15vh;right:5vw"
        label="Submit"
        @click="onSubmit()"
        rounded
        outline
        type="submit"
        color="primary"
        :loading="loading"
        :disable="loading"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data(){
    return {
      credential:{},
      loading: false
    }
  },
  computed:{
    ...mapState(['Auth'])
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate().then(success=>{
        if(success){
          this.loading = true
          this.$store.dispatch('Auth/login',this.credential).then(res=>{
              this.$router.push('/')
              window.history.pushState(null, null ,window.location.href)
          }).catch(err=>{

          }).finally(()=>{
              this.loading = false
          })
        }
      })
    }
  }
};
</script>

<style></style>
