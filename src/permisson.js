import { addRoutes, router } from "./router";
import { getToken } from "./composables/auth";
import { toast } from "./composables/utils";
import store from "./store";
import { showFullLoading, hideFullLoading } from "./composables/utils";

let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
    showFullLoading()
    const token = getToken();
    if (!token && to.path != '/login') {
        toast('请先登录', 'error')
        return next({ path: '/login' })
    }
    if (token && to.path == '/login') {
        toast('请勿重复登录', 'error')
        return next({ path: from.path ? from.path : '/' })
    }
    let hasNewRoutes = false
    if (token && !hasGetInfo) {
        let { menus } = await store.dispatch('getInfo')
        hasNewRoutes = addRoutes(menus)
        hasGetInfo = true
    }
    let title = to.meta.title ? to.meta.title : ''
    document.title = title
    hasNewRoutes ? next(to.fullPath) : next()
})
router.afterEach(() => {
    hideFullLoading()
})