<template>
<div style="width:100%;top:10px=" class="q-pr-sm q-pl-sm">
    <q-card flat bordered class="my-card" v-if="assigment != null" style="border:1px solid #1976D2;">
        <q-item>
            <q-item-section avatar>
                <q-avatar>
                    <img :src="`${Setting.storageUrl}/${assigment.user.avatar}`" />
                </q-avatar>
            </q-item-section>

            <q-item-section>
                <q-item-label> {{ assigment.user.name }}</q-item-label>
                <q-item-label caption>
                    <div class="q-gutter-sm">
                        <q-badge color="primary">Semester {{ assigment.semester }}</q-badge>
                        <q-badge color="primary">
                            {{ assigment.grade.description }}
                        </q-badge>
                    </div>
                </q-item-label>
            </q-item-section>
            <q-item-section top side>
                <q-btn flat dense round icon="more_vert">
                    <q-menu transition-show="jump-down" transition-hide="jump-up">
                        <q-list dense style="min-width: 100px">
                            <q-item clickable v-close-popup v-if="assigment.user.id == Auth.auth.id">
                                <q-item-section @click="$router.push(`/assigment/${assigment.id}/edit`)">
                                    <div class="row">
                                        <div class="col-4">
                                            <q-icon name="edit" />
                                        </div>
                                        <div class="col">Edit</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup v-if="assigment.user.id == Auth.auth.id">
                                <q-item-section @click="destroy()">
                                    <div class="row">
                                        <div class="col-4">
                                            <q-icon name="delete" />
                                        </div>
                                        <div class="col">Delete</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section @click="$q.notify('Dalam kontruksi')">
                                    <div class="row">
                                        <div class="col-4">
                                            <q-icon name="cloud_download" />
                                        </div>
                                        <div class="col">Unduh</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section @click="
                      $router.push({
                        name: 'share',
                        params: { assigmentId: assigment.id }
                      })
                    ">
                                    <div class="row">
                                        <div class="col-4">
                                            <q-icon name="share" />
                                        </div>
                                        <div class="col">Bagikan ke Siswa</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup v-if="assigment.user.id == Auth.auth.id">
                                <q-item-section @click="
                      $router.push({
                        name: 'sharefortraining',
                        params: {
                          assigment: assigment,
                          assigmentId: assigment.id
                        }
                      })
                    ">
                                    <div class="row">
                                        <div class="col-4">
                                            <q-icon name="school" />
                                        </div>
                                        <div class="col">{{assigment.is_public?'Edit':'Set'}} Latihan Mandiri</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup v-if="assigment.user.id == Auth.auth.id && assigment.is_public">
                                <q-item-section @click="cancelTrainingAssigment(assigment.id)">
                                    <div class="row">
                                        <div class="col-4">
                                            <q-icon name="remove_circle" />
                                        </div>
                                        <div class="col">Batalkan Latihan Mandiri</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-item-section>
        </q-item>
        <div class="q-pl-md">
            {{ assigment.name }}
        </div>

        <q-card-section style="padding-bottom:0px;padding-top:0px">
            <!-- <div class="text-caption">{{assigment.description}}</div> -->

            <q-carousel @click="$router.push(`/knowledgetest/${assigment.id}`)" v-model="slide" transition-prev="slide-right" transition-next="slide-left" animated infinite autoplay control-color="primary" class="rounded-borders bg-grey-2" height="20vh" style="width:100%">
                <q-carousel-slide v-for="(question_list, ql) in assigment.question_lists" :key="question_list.id" :name="ql" class="column no-wrap flex-center">
                    <!--<div style="position:absolute;top:0;left:0;;border-bottom-right-radius:35px;" class="bg-blue q-pa-sm">
              sasd
            </div>-->
                    <div class="text-justify">
                        <div class="text-body1">Soal {{ ql + 1 }}</div>
                        <div class="text-caption" v-html="question_list.name"></div>
                    </div>
                </q-carousel-slide>
            </q-carousel>
        </q-card-section>

        <q-item dense>
            <q-item-section>
                <div class="row q-gutter-sm">
                    <q-btn flat round no-caps :color="assigment.liked_count ? 'red' : null" :icon="assigment.liked_count ? 'favorite' : 'favorite_border'" @click="assigment.liked_count ? dislike() : like()">
                        <div class="text-caption text-grey">
                            {{
                  assigment.likes.length ? assigment.likes.length : 0
                }}
                            Suka
                        </div>
                    </q-btn>
                    <q-btn flat round no-caps icon="message" @click="$router.push(`/comment/${assigment.id}`)">
                        <div class="text-caption text-grey">
                            {{
                  assigment.comments.length ? assigment.comments.length : 0
                }}
                            Komentar
                        </div>
                    </q-btn>
                </div>
            </q-item-section>

            <q-item-section side>
                <q-item-label caption>{{getDate}}</q-item-label>
            </q-item-section>
        </q-item>

    </q-card>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import {
    date
} from 'quasar'
export default {
    props: {
        assigment: null,
        isAuth: null
    },
    computed: {
        ...mapState(["Setting", "Auth"]),
        getDate() {
            return date.formatDate(this.assigment.created_at, 'DD MMMM YYYY')
        }
    },
    data() {
        return {
            slide: 0
        };
    },
    created() {},
    methods: {
        cancelTrainingAssigment(assigment_id) {

            this.$store.dispatch("Assigment/setPublic", {
                id: assigment_id,
                is_public: false
            }).then(res => {
                this.$q.notify("Berhasil membatalkan latihan mandiri");
                //this.assigment.is_public=false;
                this.$store.dispatch('Auth/setAssigment', {
                    assigment: {
                        ...this.assigment,
                        is_public: false
                    },
                    field: ['is_public']
                })

            });
        },
        destroy() {
            this.$q
                .dialog({
                    title: "Yakin untuk hapus?",
                    message: "Soal tidak akan dapat dikembalikan",
                    cancel: true
                })
                .onOk(() => {
                    this.$store
                        .dispatch("Publish/destroy", this.assigment.id)
                        .then(res => {
                            this.$store.dispatch("Auth/getAuth");
                            this.$q.notify("Berhasil menghapus soal");
                        })
                        .catch(err => {
                            this.$q.notify("Terjadi kesalahan");
                        });
                });
        },
        like() {
            this.$store.dispatch("Assigment/like", this.assigment.id).then(res => {
                // this.assigment.liked_count = res.data.liked_count;
                // this.assigment.likes_count = res.data.likes_count;
                //console.log(res.data) 
                if (this.isAuth) {
                    this.$store.dispatch("Auth/setAssigment", {
                        assigment: res.data,
                        field: ['likes_count', 'liked_count', 'likes']
                    })
                } else {
                    this.$store.dispatch("Publish/setAssigment", {
                        assigment: res.data,
                        field: ['likes_count', 'liked_count', 'likes']
                    })
                }
                //this.$forceUpdate();
            });
        },
        dislike() {
            this.$store.dispatch("Assigment/dislike", this.assigment.id).then(res => {
                // this.assigment.liked_count = res.data.liked_count;
                // this.assigment.likes_count = res.data.likes_count;
                //console.log(res.data) 
                if (this.isAuth) {
                    this.$store.dispatch("Auth/setAssigment", {
                        assigment: res.data,
                        field: ['likes_count', 'liked_count', 'likes']
                    })
                } else {
                    this.$store.dispatch("Publish/setAssigment", {
                        assigment: res.data,
                        field: ['likes_count', 'liked_count', 'likes']
                    })
                }
                //this.$forceUpdate();
            });
        }
    }
};
</script>

<style></style>
