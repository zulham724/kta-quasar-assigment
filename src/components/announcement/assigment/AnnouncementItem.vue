<template>
<div>
    <q-item clickable @click="goToResult(item.data.data.session.id)" :disable="loading">
        <q-item-section avatar top>
            <q-avatar size="3.5rem">
                <q-img v-if="item.data.data.session.user" :src="`${Setting.storageUrl}/${item.data.data.session.user.avatar}`"></q-img>
            </q-avatar>
        </q-item-section>
        <q-item-section top>
            <q-item-label>
                <div v-if="item.data.data.teacher">
                    <b>{{item.data.data.session.user.name}}</b> mengerjakan paket soal <b>{{item.data.data.assigment.name}}</b> Anda
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
        ...mapState(["Setting", "EchoNotification"]),
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
        console.log('ancok')
        console.log(this.item)
    },
    methods: {
        goToResult: function (sessionId) {
            this.$router.push({
                name: 'studentresult',
                params: {
                    sessionId: sessionId
                }
            })

        }
    },
    mounted() {

    }

}
</script>
