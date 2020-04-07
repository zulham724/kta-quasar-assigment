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

const routes = [{
        path: "/",
        beforeEnter: multiguard([auth]),
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