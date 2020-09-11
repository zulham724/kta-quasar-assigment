<template>
<div>
    <q-pull-to-refresh @refresh="onRefresh">
        <q-header style="border:1px solid rgb(33, 150, 243);">
            <q-toolbar class="bg-blue">
                <q-icon name="person" style="font-size: 1.5em;" />
                <q-toolbar-title>
                    {{ Auth.auth.name }}
                    <div class="bg-blue text-white text-body2">No Anggota: {{ Auth.auth.kta_id }}</div>

                </q-toolbar-title>
                <q-btn flat icon="logout" @click="logout()" />
            </q-toolbar>
        </q-header>

        <q-page>
            <q-infinite-scroll @load="onLoadCheck" :offset="250" ref="scrollGan">
                <div class="row">
                    <div class="col-12">
                        <!--begin pengubung-->

                        <div id="penghubung" style="position: relative;
  height: 20px;" class="bg-blue"></div>
                        <!--end penghubung-->

                        <!--begin header-append-->
                        <div id="header_append">
                            <div id="kotak_biru" style="position: absolute;
  height:60px;width:100vw;" class="bg-blue"></div>

                            <!--begin dikerjakan
            <div
              id="dikerjakan"
              class="text-black"
              style="position:absolute;margin-top:60px;padding-left:20px"
            >
              <div class="row justify-start">
                <div class="text-h5">
                  {{ Auth.auth.count_sessions }}
                </div>
              </div>
              <div class="row justify-center" style="margin-top: -5px;">
                <div class="text-caption">Dikerjakan</div>
              </div>
            </div>end dikerjakan-->

                            <!--begin lingkaran-->
                            <div class="row justify-center">
                                <div id="lingkaran" style="z-index:1">
                                    <div style="border-radius:50%;border:4px solid white;" class="bg-grey-3">
                                        <q-avatar size="100px" @click="zoom(Auth.auth.avatar)">
                                            <q-img :src="`${Setting.storageUrl}/${Auth.auth.avatar}`" no-default-spinner />
                                        </q-avatar>
                                    </div>
                                </div>
                            </div>
                            <!--end lingkaran-->
                            <div class="row justify-center q-pt-sm">

                                <div id="dikerjakan" class="text-black">
                                    <div class="row justify-center">
                                        <div class="text-body">
                                            <b>{{ Auth.auth.count_sessions }}</b>
                                        </div>
                                    </div>
                                    <div class="row justify-center">
                                        <div class="text-body">
                                            Dikerjakan
                                        </div>
                                    </div>
                                </div>
                                <!--end dikerjakan-->
                            </div>
                        </div>
                        <!--end header-append-->
                    </div>
                    <!--end col-->
                </div>
                <!--end row-->

                <div class="row">
                    <div class="col-12">
                        <q-tabs v-model="tab" dense class="text-grey-10">
                            <q-tab name="unpublish">
                                <q-icon name="description" color="blue"></q-icon>
                                <div class="text-caption">
                                    <b>{{ Auth.auth.count_question_lists }}</b> Butir Soal
                                </div>
                            </q-tab>
                            <q-tab name="publish">
                                <q-icon name="bookmarks" color="blue"></q-icon>
                                <div class="text-caption">
                                    <b>{{
                   Auth.auth.count_publish_assigments
                }}</b>
                                    Paket Soal
                                </div>
                            </q-tab>
                        </q-tabs>

                        <q-tab-panels v-model="tab" animated>
                            <q-tab-panel name="publish" class="q-pa-none">
                                <div class="q-pa-none row items-start q-gutter-y-sm">
                                    <q-intersection v-for="assigment in Auth.publish_assigments.data" :key="assigment.id" :id="`publish-${assigment.id}`" style="min-height:50px;width:100vw">
                                        <publish-item-component :assigment="assigment" :isAuth="true"></publish-item-component>
                                    </q-intersection>
                                </div>
                            </q-tab-panel>
                            <q-tab-panel name="unpublish" class="q-pa-none">
                                <div class="q-pa-none q-gutter-y-xs">
                                    <q-intersection v-for="assigment in Auth.unpublish_assigments.data" :key="assigment.id" :style="`min-height:50px;width: 100vw`">
                                        <unpublish-item-component :assigment="assigment"></unpublish-item-component>
                                    </q-intersection>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>
                </div>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="primary" size="40px" />
                    </div>
                </template>
            </q-infinite-scroll>
        </q-page>
        <!--end col-->
        <!--end row-->
    </q-pull-to-refresh>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import {
    scroll
} from 'quasar'
const {
    getScrollTarget,
    setScrollPosition
} = scroll

export default {
    props: {
        tabName: null,
        assigmentIdtoScroll: null,
    },
    components: {
        PublishItemComponent: () =>
            import("components/assigment/publish/ItemComponent.vue"),
        UnpublishItemComponent: () =>
            import("components/assigment/unpublish/ItemComponent.vue")
    },
    data() {
        return {
            tab: "unpublish"
        };
    },
    computed: {
        ...mapState(["Setting", "Auth"])
    },
    created() {
        //alert(this.Auth.auth.publish_assigments)
        if (this.tabName) this.tab = this.tabName;
    },
    mounted() {
        if (this.assigmentIdtoScroll) {
            // alert(this.assigmentIdtoScroll)
            const el = document.getElementById('publish-' + this.assigmentIdtoScroll);
            console.log(el)
            this.scrollToElement(el)
        }
    },
    methods: {
        scrollToElement(el) {
            const target = getScrollTarget(el)
            const offset = el.offsetTop
            const duration = 1000
            setScrollPosition(target, offset)
        },
        logout() {
            this.$store.dispatch("Auth/logout").then(res => {
                this.$router.push("/login");
            });
        },
        onRefresh(done) {
            Promise.all([
                this.$store.dispatch("Auth/PublishAssigmentsIndex"),
                this.$store.dispatch("Auth/UnpublishAssigmentsIndex"),
                this.$store.dispatch('Auth/getAuth')
            ]).then(res => {
                done();
            })
        },
        onLoadPublish(index, done) {
            this.Auth.publish_assigments.next_page_url ?
                this.$store.dispatch("Auth/PublishAssigmentsNext").then(res => done()) :
                done();
        },
        onLoadUnpublish(index, done) {
            this.Auth.unpublish_assigments.next_page_url ?
                this.$store.dispatch("Auth/UnpublishAssigmentsNext").then(res => done()) :
                done();
        },
        onLoadCheck(index, done) {
            if (this.tab == "publish") {
                this.onLoadPublish(index, done);
            } else if (this.tab == "unpublish") {
                this.onLoadUnpublish(index, done);
            } else {
                done();
            }
        }
    }
};
</script>

<style></style>
