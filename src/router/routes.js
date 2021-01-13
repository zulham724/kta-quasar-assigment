import multiguard from 'vue-router-multiguard'
import store from './../store'
import moment from "moment";
// cek auth apakah sudah login atau belum
const auth = function(to, from, next) {
    let isLoggedIn = store().getters['Auth/isLoggedIn'];
    let isUnAuthorized = store().getters["Auth/isUnAuthorized"];
    if (isLoggedIn && !isUnAuthorized) {
        next()
    } else {
        next('/login')
    }
}

// cek apakah user sudah bayar apa belum dan jika lebih dari 6 bulan
const actived = function(to, from, next) {
    const monthDifference = moment(new Date()).diff(
        new Date(store().getters["Auth/auth"].user_activated_at),
        "months",
        true
    );
    if (
        store().getters["Auth/auth"] &&
        store().getters["Auth/auth"].user_activated_at != null &&
        monthDifference < 6
    ) {
        next();
    } else {
        next("/payment");
    }
};

const checkProfile = function(to, from, next) {
    let hasEducationallevel = store().getters['Auth/auth'].profile.educational_level_id
    if (!hasEducationallevel) {
        next('/account/edit');
    } else {
        next()
    }
}

const routes = [{
        path: "/",
        beforeEnter: multiguard([auth, checkProfile]),
        component: () =>
            import ("layouts/MainLayout.vue"),
        children: [{
                path: "",
                name: 'home',
                component: () =>
                    import ("pages/HomePage.vue")
            },
            {
                path: "account",
                name: 'account',
                props:true,
                beforeEnter: multiguard([auth, checkProfile]),
                component: () =>
                    import ("pages/AccountPage.vue")
            },
            {
                path: "studentresultlist",
                name: 'studentresultlist',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () =>
                    import ("pages/StudentResultListPage.vue")
            },
            {
                path: "create",
                name: 'create',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () =>
                    import ("pages/CreatePage.vue")
            }, {
                path: 'build',
                name: 'build',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () => import ('pages/BuildPage.vue'),
                props: true,
            },
            {
                path: 'addquestionlists',
                name: 'addquestionlists',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () => import ('pages/Assigment/AddQuestionListsPage.vue'),
                props: true
            },
            {
                path: 'share',
                name: 'share',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () => import ('pages/SharePage.vue'),
                props: true,
             }, 
             {
                path: 'sharefortraining',
                beforeEnter: multiguard([auth, checkProfile]),
                name: 'sharefortraining',
                component: () => import ('pages/ShareForTrainingPage.vue'),
                props: true,
            },
            {
                beforeEnter: multiguard([auth, checkProfile]),
                path: '/studentassigment/:assigmentId',
                name: 'studentassigment',
                component: () => import ('pages/StudentAssigmentPage.vue'),
                props: true,
            },
            {
                beforeEnter: multiguard([auth, checkProfile]),
                path: '/studentresult/:sessionId',
                name: 'studentresult',
                component: () => import ('pages/StudentResult.vue'),
                props: true,
            },
            {
                beforeEnter: multiguard([auth, checkProfile]),
                path: "/announcement",
                beforeEnter: multiguard([auth]),
                component: () =>
                    import ("pages/AnnouncementPage.vue")
            }
        ]
    },
    {
        path: '/comment/:assigmentId',
        name: 'comment',
        beforeEnter: multiguard([auth]),
        component: () =>
            import ('pages/CommentPage.vue'),
        props: true
    },
    {
        path: '/knowledgetest/:assigmentId',
        name: 'knowledgetest',
        beforeEnter: multiguard([auth]),
        component: () =>
            import ('pages/KnowledgeTestPage.vue'),
        props: true
    },
    {
        path: '/knowledgeresult',
        beforeEnter: multiguard([auth, actived]),
        name: 'knowledgeresult',
        beforeEnter: multiguard([auth]),
        component: () =>
            import ('pages/KnowledgeResultPage.vue'),
        props: true
    }, {
        path: '/assigment/:assigmentId/edit',
        beforeEnter: multiguard([auth, actived]),
        name: 'assigmentedit',
        component: () =>
            import ('pages/Assigment/EditPage.vue'),
        props: true
    },
    {
        path: "/login",
        name: "login",
        component: () =>
            import ("layouts/LoginLayout.vue")
    },
    {
        path: "/account/edit",
        beforeEnter: multiguard([auth, actived]),
        name: "accountedit",
        component: () =>
            import ("pages/account/EditPage.vue")
    }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
    routes.push({
        path: "*",
        component: () =>
            import ("pages/Error404.vue")
    });
}

export default routes;