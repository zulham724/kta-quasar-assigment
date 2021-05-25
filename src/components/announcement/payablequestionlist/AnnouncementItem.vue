<template>
<div>
    <q-item clickable @click="goToResult(item.data.question_list.id)" :disable="loading">
        <!-- <q-item-section avatar top>
            <q-avatar size="3.5rem">
                <q-img v-if="item.data.data.session.user" :src="`${Setting.storageUrl}/${item.data.data.session.user.avatar}`"></q-img>
            </q-avatar>
        </q-item-section> -->
        <q-item-section top>
            <q-item-label>
                <b>Selamat,</b>
                 butir soal Anda '<span class="text-grey-8">{{getMsg}}</span>' dapat dijadikan berbayar!
            </q-item-label>
            <q-item-label caption>
                <div>{{ item.created_at | moment("from", "now") }}</div>
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
            return this.item.data.question_list.name.length <= 30 ? this.item.data.question_list.name.length : this.item.data.question_list.name.substr(0, 30) + '....';
        }
    },
    data() {
        return {
            loading: false,
        }
    },
    created: function () {
        console.log('payable questionlist')
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
