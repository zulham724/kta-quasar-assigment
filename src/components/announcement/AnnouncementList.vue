<template>
<q-infinite-scroll @load="onLoad" :offset="250">
    <div v-if="announcementList">
        <div v-for="(item, n) in announcementList" :key="`announcement-${n}`" class="q-py-xs bg-blue-1">
            <q-intersection style="min-height:50px" v-if="item.type=='App\\Notifications\\AssigmentNotification' || item.type=='AssigmentTeacherEvent'">
                <announcement-item-assigment :item="item"></announcement-item-assigment>
            </q-intersection>
            <q-intersection style="min-height:50px" v-else-if="item.type=='App\\Notifications\\AssigmentSharedNotification' || item.type=='AssigmentSharedEvent'">
                <announcement-item-shared-assigment :item="item"></announcement-item-shared-assigment>
            </q-intersection>
            <q-intersection style="min-height:50px" v-else-if="item.type=='App\\Notifications\\LikedCommentNotification'">
                <announcement-item-comment-like :item="item"></announcement-item-comment-like>
            </q-intersection>
            <q-intersection style="min-height:50px" v-else-if="item.type=='App\\Notifications\\LikedAssigmentNotification'">
                <announcement-item-assigment-like :item="item"></announcement-item-assigment-like>
            </q-intersection>
            <q-intersection style="min-height:50px" v-else-if="item.type=='App\\Notifications\\CommentedAssigmentNotification'">
                <announcement-item-assigment-comment :item="item"></announcement-item-assigment-comment>
            </q-intersection>

        </div>
    </div>
    <template v-slot:loading>
        <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
        </div>
    </template>
</q-infinite-scroll>
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    components: {
        AnnouncementItemAssigment: () => import('components/announcement/assigment/AnnouncementItem.vue'),
        AnnouncementItemSharedAssigment: () => import('components/announcement/sharedassigment/AnnouncementItem.vue'),
        AnnouncementItemCommentLike: () => import('components/announcement/commentlike/AnnouncementItem.vue'),
        AnnouncementItemAssigmentLike: () => import('components/announcement/assigmentlike/AnnouncementItem.vue'),
        AnnouncementItemAssigmentComment: () => import('components/announcement/assigmentcomment/AnnouncementItem.vue'),

    },
    data() {
        return {

        };
    },
    computed: {
        ...mapState(["Auth", "Setting", "EchoNotification"]),
        announcementList: function () {
            return this.EchoNotification.items.data ? this.EchoNotification.items.data.filter(item => {
                return item.data != '';
            }) : null;
        }
    },
    created() {

    },
    mounted() {
        this.$store.dispatch("EchoNotification/markAsRead");
    },
    methods: {
        onLoad: function (index, done) {
            //alert(this.EchoNotification.items.next_page)
            if (this.EchoNotification.items.next_page_url) {
                this.$store.dispatch("EchoNotification/next").then(res => {
                    done();
                });
            } else done();
        },
    }
}
</script>
