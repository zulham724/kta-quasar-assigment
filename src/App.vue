<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
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
</style>
