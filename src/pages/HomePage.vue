<template>
<div>
    <q-pull-to-refresh @refresh="init">
        <q-header elevated class="bg-white">
            <q-toolbar class="text-primary">
                <q-btn @click="isShow=!isShow" flat round dense icon="menu" />
                <q-toolbar-title>
                    Beranda
                </q-toolbar-title>
                <q-btn dense color="blue" round icon="notifications" class="q-ml-md">
                    <q-badge v-if="EchoNotification.unread_count>0" color="red" floating>{{EchoNotification.unread_count}}</q-badge>
                    <q-menu anchor="bottom right" self="top right" auto-close transition-show="scale" transition-hide="scale">
                        <q-list style="width:250px;border:2px solid #1976D2; border-radius:5px">
                            <q-item>
                                <q-item-section class="text-center">
                                    <div class="text-weight-bold" style="font-size:15px">
                                        Pemberitahuan
                                    </div>
                                </q-item-section>
                            </q-item>
                            <announcement-item-list></announcement-item-list>
                            <q-item>
                                <q-item-section class="text-center">
                                    <div class="text-weight-bold text-blue" style="font-size:13px" clickable @click="$router.push('/announcement')">
                                        Lihat Semua
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-toolbar>
            <q-slide-transition>
                <div id="header" v-show="isShow">
                    <div @click="$q.notify('Dalam konstruksi')" id="ranking" class="bg-blue" style="position:absolute;right:0;padding:0px;border-top-left-radius:20px;border-bottom-left-radius:20px;color:white">
                        <div class="row q-pl-md">
                            <div class="col-12 text-center">
                                <q-icon name="fas fa-trophy" color="yellow"> </q-icon>
                            </div>
                        </div>
                        <div class="row q-pl-md q-pr-sm">
                            <div class="col-12 text-center">
                                Ranking
                            </div>

                        </div>
                    </div>

                    <div id="text-header" class="q-pa-md">
                        <div class="row">
                            <div class="col-12 text-blue text-h6">
                                AGPAII DIGITAL
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 text-primary text-h5">
                                Penilaian
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-9 self-center q-pa-sm">
                            <q-btn-toggle v-model="tab" spread class="my-custom-toggle" no-caps dense rounded unelevated toggle-color="primary" color="white" text-color="primary" :options="[
              { label: 'Butir Soal', value: 'unpublish', slot: 'one' },
              { label: 'Paket Soal', value: 'publish', slot: 'two' }
            ]">
                                <template v-slot:one>
                                    <div class="row items-center no-wrap">
                                        <q-icon right name="description" size="20px" />
                                    </div>
                                </template>
                                <template v-slot:two>
                                    <div class="row items-center no-wrap">
                                        <q-icon right name="bookmarks" size="20px" />
                                    </div>
                                </template>
                            </q-btn-toggle>
                        </div>
                        <div class="col-3 self-center">
                            <q-btn @click="$q.notify('Dalam konstruksi')" dense unelevated rounded color="primary" class="q-pr-sm">
                                <q-icon name="fas fa-filter" class="q-pl-sm" size="10px" />
                                <div class="text-caption q-pl-sm">Filter</div>
                            </q-btn>
                        </div>
                    </div>
                </div>
            </q-slide-transition>

            <div id="closeOpen" style="margin-left:50%;position:absolute;padding:0px;top:14px;text-align:center;">
                <q-btn round color="primary" :icon="isShow?'keyboard_arrow_up':'keyboard_arrow_down'" size="sm" @click="isShow=!isShow" />
            </div>

        </q-header>
        <q-page>
            <q-infinite-scroll v-if="tab == 'publish'" @load="onLoadPublish" :offset="250">
                <div class="q-pa-none row items-start q-gutter-y-sm" v-if="Publish.items.data">
                    <q-intersection v-for="assigment in Publish.items.data" :key="assigment.id" style="min-height:200px;width:100vw">
                        <publish-item-component :assigment="assigment"></publish-item-component>
                    </q-intersection>
                </div>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="primary" size="40px" />
                    </div>
                </template>
            </q-infinite-scroll>
            <q-infinite-scroll v-if="tab == 'unpublish'" @load="onLoadUnpublish" :offset="250">
                <div class="q-pa-none q-gutter-y-xs" v-if="Unpublish.items.data">
                    <q-intersection v-for="assigment in Unpublish.items.data" :key="assigment.id" style="min-height:50px;width:100vw">
                        <unpublish-item-component :assigment="assigment"></unpublish-item-component>
                    </q-intersection>
                </div>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="primary" size="40px" />
                    </div>
                </template>
            </q-infinite-scroll>
        </q-page>
    </q-pull-to-refresh>
</div>
</template>

<script>
import {
    mapState
} from "vuex";

export default {
    components: {
        PublishItemComponent: () =>
            import("components/assigment/publish/ItemComponent.vue"),
        UnpublishItemComponent: () =>
            import("components/assigment/unpublish/ItemComponent.vue"),
        AnnouncementItemList: () => import('components/announcement/AnnouncementList.vue'),

    },
    // watch: {
    //   tab: function(val, oldval) {
    //     console.log(oldval + " > " + val);
    //   }
    // },
    data() {
        return {
            isShow: true,
            assigments: [],
            tab: "unpublish",
            slide: 1
        };
    },
    computed: {
        ...mapState([
            "Assigment",
            "Setting",
            "Publish",
            "Unpublish",
            "StudentResult",
            "EchoNotification"
        ])
    },
    created() {
        if (!this.Publish.items.data) this.$store.dispatch("Publish/index");
        if (!this.Unpublish.items.data) this.$store.dispatch("Unpublish/index");
        if (!this.StudentResult.items.data)
            this.$store.dispatch("StudentResult/index");
    },
    mounted() {},
    methods: {
        init(done) {
            Promise.all([
                //this.$store.dispatch("Auth/getAuth"),
                //this.$store.dispatch("Auth/getPublished"),
                this.$store.dispatch("Publish/index"),
                this.$store.dispatch("Unpublish/index"),
                this.$store.dispatch("StudentResult/index")
            ]).then(res => {
                if (done) done();
            });
        },
        onLoadPublish(index, done) {
            this.Publish.items.next_page_url ?
                this.$store.dispatch("Publish/next").then(res => done()) :
                done();
        },
        onLoadUnpublish(index, done) {
            this.Unpublish.items.next_page_url ?
                this.$store.dispatch("Unpublish/next").then(res => done()) :
                done();
        },
        getNotification: function () {
            this.loading = true;
            if (!this.EchoNotification.items.data) {
                this.onRefreshNotification();
            } else this.loading = false;
        },
        onRefreshNotification: function (done) {
            this.loading = true;
            this.$store.dispatch('EchoNotification/index').finally(() => {
                this.loading = false
                if (done) done();
            })
        }
    }
};
</script>

<style>
.my-custom-toggle {
    border: 1px solid #027be3;
}
</style>
