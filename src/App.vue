<template>
  <div id="q-app">
    <platform-mobile-component v-if="$q.platform.is.mobile"></platform-mobile-component>
    <platform-desktop-component v-else></platform-desktop-component>
  </div>
</template>

<script>
export default {
  name: "App",
  components:{
    PlatformMobileComponent: ()=> import('components/PlatformMobileComponent.vue'),
    PlatformDesktopComponent: ()=> import('components/PlatformDesktopComponent.vue')
  }
};
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons");
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
@import url('https://fonts.googleapis.com/css?family=Fira+Sans&display=swap');
#q-app {
  font-family: 'Fira Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
  font-weight: normal;
  background-color:#F5F5F5;
}
a {
    text-decoration: none;
    color: rgb(47, 27, 61);
  }
</style>
