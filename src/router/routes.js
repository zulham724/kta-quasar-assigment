import multiguard from 'vue-router-multiguard'
import store from './../store'

// cek auth apakah sudah login atau belum
const auth = function(to, from, next) {
    let isLoggedIn = store().getters['Auth/isLoggedIn']
    if (isLoggedIn) {
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
                component: () =>
                    import ("pages/AccountPage.vue")
            },
            {
                path: "notif",
                name: 'notif',
                component: () =>
                    import ("pages/NotifPage.vue")
            },
            {
                path: "create",
                name: 'create',
                component: () =>
                    import ("pages/CreatePage.vue")
            }, {
                path: 'build',
                name: 'build',
                component: () =>
                    import ('pages/BuildPage.vue')
            },
            {
                path: 'share',
                name: 'share',
                component: () => import ('pages/SharePage.vue'),
                props: true,
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
        name: 'knowledgeresult',
        beforeEnter: multiguard([auth]),
        component: () =>
            import ('pages/KnowledgeResultPage.vue'),
        props: true
    }, {
        path: '/assigment/:assigmentId/edit',
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