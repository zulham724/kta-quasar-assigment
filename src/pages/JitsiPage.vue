<template>
  <q-layout view="hHr LpR lFf">
    <!-- <q-header>
      <q-toolbar class="bg-white">
        <q-icon
          @click="$router.back()"
          color="blue"
          name="arrow_back"
          size="sm"
        />
        <q-toolbar-title>
          <div class="text-body2 text-blue text-bold">{{ room.name }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->
    <q-page-container>
      <q-page>
        <vue-jitsi-meet
          ref="jitsiRef"
          domain="meet.agpaiidigital.org"
          style="height: 100vh;position:absolute"
          :options="jitsiOptions"
        ></vue-jitsi-meet>
        <div style="position:absolute;width:100%">
          <div class="flex flex-center column">
            <div
              class="fit row wrap justify-between items-stretch content-start"
            >
              <q-btn color="blue-1" dense>
                <q-icon
                  @click="$router.back()"
                  color="blue"
                  name="arrow_back"
                  size="sm"
                />
              </q-btn>
              <q-btn unelevated color="blue-1" dense no-caps>
                <div class="text-body2 text-blue text-bold">
                  {{ room.name }}
                </div>
              </q-btn>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { JitsiMeet } from "@mycure/vue-jitsi-meet";
import { mapState } from "vuex";
export default {
  props: ["room"],
  components: {
    VueJitsiMeet: JitsiMeet
  },
  data() {
    return {};
  },
  mounted() {
    this.room == null ? this.$router.back() : null;
  },
  computed: {
    ...mapState(["Setting", "Auth"]),
    jitsiOptions() {
      return {
        roomName: this.room.code,
        noSSL: false,
        userInfo: {
          email: this.Auth.auth.email,
          displayName: this.Auth.auth.name
        },
        configOverwrite: {
          enableNoisyMicDetection: false,
          disableDeepLinking: true,
          enableClosePage: true,
          dynamicBrandingUrl: "https://pastebin.com/raw/Lbsu2w2P"
          // logoImageUrl:'https://static.lwn.net/images/logo/barepenguin-70.png',
          //  logoClickUrl: 'https://example-company.org',
        },
        interfaceConfigOverwrite: {
          HIDE_INVITE_MORE_HEADER: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          SHOW_JITSI_WATERMARK: false
        },
        onload: this.onIFrameLoad
      };
    }
  },
  methods: {
    onIFrameLoad() {
      // do stuff
    }
  }
};
</script>
