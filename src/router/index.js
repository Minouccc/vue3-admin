import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import Admin from '~/layouts/admin.vue'
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'
// const routes = [
//     {
//         path:"/",
//         component:Admin,
//         children:[
//             {
//                 path:"/",
//                 component:Index,
//                 meta:{
//                     title:"首页"
//                 }
//             },
//             {
//                 path:"/goods/list",
//                 component:GoodList,
//                 meta:{
//                     title:"首页"
//                 }
//             },
//             {
//                 path:"/category/list",
//                 component:CategoryList,
//                 meta:{
//                     title:"分类列表"
//                 }
//             }
//         ]
//     },
//     {
//         path:"/login",
//         component:Login,
//         meta:{
//             title:"登录页"
//         }
//     },
//     { 
//         path: '/:pathMatch(.*)*', 
//         name: 'NotFound', 
//         component: NotFound 
//     }
// ]

const routes = [
    {
        path: "/",
        name: "admin",
        component: Admin,
    },
    {
        path: "/login",
        component: Login,
        meta: {
            title: "登录页"
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]
//动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [{
    path: "/",
    component: Index,
    name: "/",
    meta: {
        title: "首页"
    }
},
{
    path: "/goods/list",
    component: GoodList,
    name: "/goods/list",
    meta: {
        title: "商品管理"
    }
},
{
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
        title: "分类列表"
    }
}]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//动态添加路由
export function addRoutes(menus) {
    let hasNewRoutes = false
    const findAndAddRoutesByMenus = (arr) => {
        arr.forEach(e => {
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute("admin", item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length > 0) {
                findAndAddRoutesByMenus(e.child)
            }
        })
    }
    findAndAddRoutesByMenus(menus)
    return hasNewRoutes
}