<template>
  <div>
    <q-header
      elevated
      style="background-image:url(https://images.unsplash.com/photo-1563942190238-434071aed45d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80);background-size:cover;"
    >
      <q-toolbar>
        <q-icon name="home" style="font-size:1.5em" />
        <q-space />

        <q-btn flat round icon="notifications" />
        <q-btn
          flat
          round
          icon="send"
          style="transform: rotate(-20deg)"
          @click="$router.push('/globalchat')"
        />
      </q-toolbar>
      <q-toolbar inset>
        <q-toolbar-title>
          Home
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="q-pt-md row items-start q-gutter-md">
      <q-card class="my-card" v-for="n in 100" :key="n">
        <q-card-section>
          <div class="row">
            <div class="col-2 self-center">
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar.png" />
              </q-avatar>
            </div>
            <div class="col-8 self-center">
              Prof Dr. Zulham Azwar Achmad
            </div>
            <div class="col-2 self-center">
              <q-fab color="purple" flat icon="more_vert" direction="left">
                <q-fab-action color="primary" icon="add" />
                <q-fab-action color="secondary" icon="edit" />
              </q-fab>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum
          fugit nam placeat unde! Velit sequi eaque vitae expedita cumque ex
          assumenda vero nisi ipsam facere, sint alias numquam fugit totam!
        </q-card-section>
        <q-card-actions>
          <q-btn color="white" text-color="black" label="Standard" />
        </q-card-actions>
      </q-card>
    </div>

    <q-fab
      color="purple"
      style="position:fixed;bottom:10vh;right:5vw"
      icon="keyboard_arrow_up"
      direction="up"
    >
      <q-fab-action color="primary" icon="add" />
      <q-fab-action color="secondary" icon="edit" />
    </q-fab>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
