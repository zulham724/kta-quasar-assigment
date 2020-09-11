<template>
<div>
    <q-item clickable @click="goToComment(item.data.data.like_id)" :disable="loading">
        <q-item-section avatar top>
            <q-avatar size="3.5rem">
                <q-img v-if="item.data.data.user" :src="`${Setting.storageUrl}/${item.data.data.user.avatar}`"></q-img>
            </q-avatar>
        </q-item-section>
        <q-item-section top>
            <q-item-label>
                <div v-if="item.data.data.user">
                    <span><b>{{item.data.data.user.name}}</b></span> menyukai paket soal Anda "{{getMsg}}"
                </div>
            </q-item-label>
            <q-item-label caption>
                <div>{{ item.data.data.created_at | moment("from", "now") }}</div>
            </q-item-label>
        </q-item-section>
    </q-item>
</div>
</template>

<script>
import {
    mapState
} from "vuex";

export default {
    props: {
        item: {}
    },
    computed: {
        ...mapState(["Setting", "EchoNotification", "PostComment"]),
        getMsg: function () {
            return this.item.data.data.likeable.body.length <= 30 ? this.item.data.data.likeable.body : this.item.data.data.likeable.body.substr(0, 30) + '....';
        }
    },
    data() {
        return {
            loading: false,
        }
    },
    created: function () {
        // console.log(this.item)
    },
    methods: {
        goToComment: function (comment_id) {
            this.$router.push({
                name: 'postcomment',
                params: {
                    postId: comment_id
                }
            })

        }
    },
    mounted() {

    }

}
</script>
