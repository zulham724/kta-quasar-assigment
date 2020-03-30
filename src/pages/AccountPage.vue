<template>
<div>
    <q-header
      elevated
      style="background-image:url(https://images.unsplash.com/photo-1563942190238-434071aed45d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80);background-size:cover;"
    >
      <q-toolbar>
        <q-icon name="home" style="font-size:1.5em" />
        <q-toolbar-title>
          Prof Dr. Zulham Azwar Achmad
        </q-toolbar-title>
        <q-btn
          flat
          round
          icon="close"
          @click="logout()"
        />
      </q-toolbar>
    </q-header>
   <q-btn @click="logout()" color="white" text-color="black" label="Logout" />
</div>
</template>

<script>
export default {
  methods:{
    logout(){
      this.$store.dispatch('Auth/logout').then(res=>{
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style>

</style>
