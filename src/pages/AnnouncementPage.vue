<template>
<div>
    <q-header>
        <q-toolbar class="bg-blue">
            <div class="row full-width">
                <div class="col-4 items-center">
                    <q-btn size="16px" flat dense icon="arrow_back" @click="$router.back()" />
                </div>
                <div class="col-4 items-center q-py-sm">
                    <div class="text-body2 text-weight-light text-center" style="font-size:15px">Pemberitahuan</div>
                </div>
                <div class="col-4">
                </div>
            </div>
        </q-toolbar>
    </q-header>
    <q-page v-if="EchoNotification.items.data">
        <q-pull-to-refresh @refresh="onRefresh">
            <q-infinite-scroll @load="onLoad" :offset="250">
                <div class="q-pa-xl" v-if="EchoNotification.items.data.length==0">
                    <q-card flat>
                        <q-card-section class="q-pt-xl text-center">
                            <q-avatar square size="10rem">
                                <q-img src="~assets/announcement-bell.png" style="width:100%"></q-img>
                            </q-avatar>
                        </q-card-section>
                        <q-card-section class="text-center">
                            <div class="text-weight-medium text-blue">Belum Ada Pemberitahuan</div>
                            <div class="text-caption">Pemberitahuan akan muncul setelah paket soal Anda dibagikan guru atau dikerjakan oleh siswa</div>
                        </q-card-section>
                        <q-card-section class="text-center">
                            <q-btn no-caps rounded color="primary" style="color:white" @click="$router.push('/')">
                                Beranda
                            </q-btn>
                        </q-card-section>
                    </q-card>
                </div>

                <div v-if="EchoNotification.items.data.length>0">
                    <div v-for="(item, n) in computed_data" :key="n" style="background-color:#E0F2F1;border-bottom:0.5px solid #BDBDBD">
                        <q-intersection style="min-height:50px" v-if="item.type=='App\\Notifications\\AssigmentNotification'">
                            <announcement-item-assigment :item="item"></announcement-item-assigment>
                        </q-intersection>
                        <q-intersection style="min-height:50px" v-else-if="item.type=='App\\Notifications\\AssigmentSharedNotification'">
                            <announcement-item-shared-assigment :item="item"></announcement-item-shared-assigment>
                        </q-intersection>
                    </div>
                </div>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="primary" size="40px" />
                    </div>
                </template>
            </q-infinite-scroll>
        </q-pull-to-refresh>
    </q-page>
</div>
</template>

<script>
import {
    mapState
} from "vuex";

export default {
    components: {
        AnnouncementItemAssigment: () => import('components/announcement/assigment/AnnouncementItem.vue'),
        AnnouncementItemSharedAssigment: () => import('components/announcement/sharedassigment/AnnouncementItem.vue'),
    },
    data() {
        return {
            loading: true
        }
    },
    computed: {
        ...mapState(["Auth", "Setting", "EchoNotification"]),
        computed_data: function () {
            return this.EchoNotification.items.data.filter(item => {
                return item.data != '';
            });
        }
    },
    created: function () {
        this.initNotification();
        // console.log('notif')
        // console.log(this.EchoNotification.items)
    },
    methods: {
        initNotification: function () {
            this.loading = true;
            if (!this.EchoNotification.items.data) {
                this.onRefresh();
            } else this.loading = false;
        },
        onRefresh: function (done) {
            this.loading = true;
            this.$store.dispatch('EchoNotification/index').finally(() => {
                this.loading = false
                if (done) done();
            })
        },
        onLoad: function (index, done) {
            //alert(this.EchoNotification.items.next_page)
            if (this.EchoNotification.items.next_page_url) {
                this.$store.dispatch("EchoNotification/next").then(res => {
                    done();
                });
            } else done();
        }
    }
}
</script>
