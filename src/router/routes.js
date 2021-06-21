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

// kalo belum bayar atau masa aktif berakhir cma bisa lihat halaman trial
const isTrial = (from, to, next) => {
    store().dispatch('Auth/getAuth').then(res => {
        let user_activated_at = store().getters['Auth/auth'].user_activated_at
        const monthDifference = moment(new Date()).diff(
            new Date(user_activated_at),
            "months",
            true
        );
        // console.log(user_activated_at, monthDifference < 6, store().getters['Auth/auth'], res.data)
        if (user_activated_at != null && monthDifference < 6) from.name == 'trial' ? next('/') : next()
        else from.name != 'trial' ? next('/trial') : next()
    })
};

const routes = [{
        path: "/",
        beforeEnter: multiguard([auth, isTrial, checkProfile]),
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
                path: "recyclebin/studentresult",
                name: 'deletedstudentresult',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () =>
                    import ("pages/DeletedStudentResultListPage.vue")
            },
            {
                path: "create",
                name: 'create',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () =>
                    import ("pages/CreatePage.vue")
            },
            {
                path: '/assigment/:assigmentId/edit',
                beforeEnter: multiguard([auth, actived]),
                name: 'assigmentedit',
                component: () =>
                    import ('pages/Assigment/EditPage.vue'),
                props: true
            },
            {
                path: 'build',
                name: 'build',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () => import ('pages/BuildPage.vue'),
                props: true,
            },
            {
                path: 'payable_build',
                name: 'payable_build',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () => import ('pages/PayableBuildPage.vue'),
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
                path: 'addpayablequestionlists',
                name: 'addpayablequestionlists',
                beforeEnter: multiguard([auth, checkProfile]),
                component: () => import ('pages/Assigment/AddPayableQuestionListsPage.vue'),
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
            },
            {
                name: "meet",
                path: "meet",
                beforeEnter: multiguard([auth, actived]),
                component: () =>
                    import ("pages/MeetPage.vue")
            },
            {
                name: "payableassigment",
                path: "/payableassigment/:tabInit?/:elementId?",
                beforeEnter: multiguard([auth, actived]),
                component: () =>
                    import ("pages/PayableAssigment.vue"),
                props: true,
            },
        ]
    },
    {
        name: "jitsi",
        path: "/jitsi",
        beforeEnter: multiguard([auth, actived]),
        component: () =>
            import ("pages/JitsiPage.vue"),
        props: true
    },
    {
        path: "/trial",
        name: "trial",
        beforeEnter: multiguard([isTrial]),
        component: () =>
            import ("pages/TrialPage.vue")
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
        // beforeEnter: multiguard([auth, actived]),
        name: 'knowledgeresult',
        beforeEnter: multiguard([auth]),
        component: () =>
            import ('pages/KnowledgeResultPage.vue'),
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
    },
    {
        path: "/payment",
        name: "payment",
        component: () =>
            import ("pages/PaymentPage.vue")
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