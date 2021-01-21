<template>
  <q-page class="flex flex-center">
    <q-img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    ></q-img>
    <q-btn @click="$router.push('/login')" color="white" text-color="black" label="Goto Login" />
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
