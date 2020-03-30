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
                component: () =>
                    import ("pages/HomePage.vue")
            },
            {
                path: "account",
                component: () =>
                    import ("pages/AccountPage.vue")
            },
            {
                path: "notif",
                component: () =>
                    import ("pages/NotifPage.vue")
            },
            {
                path: "add",
                component: () =>
                    import ("pages/AddPage.vue")
            }, {
                path: 'search',
                component: () =>
                    import ('pages/SearchPage.vue')
            }
        ]
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