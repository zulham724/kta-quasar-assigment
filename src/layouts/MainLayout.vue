<template>
<q-layout view="hHh Lpr fFf">
    <q-page-container>
        <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
        <q-tabs v-model="tab" no-caps class="text-grey bg-white" active-color="primary" inline-label >
            <q-tab style="background:white" name="home" transition="slide-left" class="q-pa-xs" @click="$route.name == 'home' ? null : $router.push('/')">
                <q-icon name="home" size="20px"></q-icon>
                <transition appear enter-active-class="animated fadeInLeft">
                    <div v-show="$route.name == 'home'" class="text-caption q-pl-sm">
                        Beranda
                    </div>
                </transition>
            </q-tab>
            <q-tab class="q-pa-xs" name="create" @click="$route.name == 'create' ? null : $router.push('/create')">
                <q-icon name="add" size="20px"></q-icon>
                <transition appear enter-active-class="animated fadeInLeft">
                    <div v-show="$route.name == 'create'" class="text-caption q-pl-sm">
                        Buat Soal
                    </div>
                </transition>
            </q-tab>

            <q-tab class="q-pa-xs" name="build" @click="$route.name == 'build' ? null : $router.push('/build')">
                <q-icon name="note_add" size="20px"></q-icon>
                <transition appear enter-active-class="animated fadeInLeft">
                    <div v-show="$route.name == 'build'" class="text-caption q-pl-sm q-pr-sm">
                        Rakit
                    </div>
                </transition>
                <q-badge floating color="primary-7" v-if="Assigment.build">{{
            Assigment.build.question_lists
              ? Assigment.build.question_lists.length
              : 0
          }}</q-badge>
            </q-tab>

            <q-tab name="studentresultlist" @click="
            $route.name == 'studentresultlist'
              ? null
              : $router.push('/studentresultlist')
          ">
                <q-icon name="poll" size="20px"></q-icon>

                <transition appear enter-active-class="animated fadeInLeft">
                    <div v-show="$route.name == 'studentresultlist'" class="text-caption q-pl-sm">
                        Hasil
                    </div>
                </transition>
            </q-tab>
            <q-tab class="q-pa-xs" name="account" @click="$route.name == 'account' ? null : $router.push('/account')">
                <q-avatar size="30px">
                    <div style="position:absolute;">
                        <q-icon size="30px" name="ion-md-contact" />
                    </div>
                    <q-img :src="`${Setting.storageUrl}/${Auth.auth.avatar}`" no-default-spinner />
                </q-avatar>
                <transition appear enter-active-class="animated fadeInLeft">
                    <div v-show="$route.name == 'account'" class="text-caption q-pl-sm">
                        Profile
                    </div>
                </transition>
            </q-tab>
            
        </q-tabs>
    </q-footer>
</q-layout>
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    name: "MainLayout",
    data() {
        return {
            tab: this.$route.name
        };
    },
    computed: {
        ...mapState(["Setting", "Assigment", "Auth", "EchoNotification"])
    },
    methods: {
        initNotification() {
            this.$store.dispatch("EchoNotification/initNotification");
            // if (!this.EchoNotification.items.data) {
            //     Promise.all([this.$store.dispatch("EchoNotification/index"), this.$store.dispatch('EchoNotification/getCount')]).then(res => {
            //         this.subscribeNotification();
            //     });
            //     // this.$store.dispatch("EchoNotification/index");
            //     // this.$store.dispatch('EchoNotification/getCount');
            // } else {
            //     this.subscribeNotification();
            // }
        },
        subscribeNotification: function () {
            //alert(this.Auth.auth.id)
            if (this.Auth.auth.id) {
                let channel = "App.User." + auth.id;
                console.log("channel notification:" + channel);

                Vue.prototype.$echo.private(channel).notification(notification => {
                    console.log(notification);
                    store().dispatch(
                        "EchoNotification/addNotification",
                        notification
                    );
                });
            } else {
                console.log('user belum login');
            }
        }
    },
    created() {
        this.initNotification();
        if (!this.Auth.publish_assigments.data)
            this.$store.dispatch("Auth/PublishAssigmentsIndex");
        if (!this.Auth.unpublish_assigments.data)
            this.$store.dispatch("Auth/UnpublishAssigmentsIndex");
    },
    mounted() {
    }
};
</script>
