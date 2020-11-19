<template>
<div>
    <!--<q-item clickable @click="goToResult(item.data.data.id)" :disable="loading">-->
    <q-item clickable :disable="loading">
        <q-item-section avatar top>
            <q-avatar size="3.5rem">
                <q-img v-if="item.data.data.teacher" :src="`${Setting.storageUrl}/${item.data.data.teacher.avatar}`"></q-img>
            </q-avatar>
        </q-item-section>
        <q-item-section top>
            <q-item-label>
                <div v-if="item.data.data.teacher">
                    <b>{{item.data.data.teacher.name}}</b> telah membagikan paket soal Anda
                </div>
            </q-item-label>
            <q-item-label caption>
                <div>{{ item.data.data.updated_at | moment("from", "now") }}</div>
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
        goToResult: function (assigment_session_id) {
            this.$router.push({
                name: 'result2',
                params: {
                    assigmentSessionId: assigment_session_id
                }
            })

        }
    },
    mounted() {

    }

}
</script>
