import router from "./router";
import { getToken } from "./composables/auth";
import { toast } from "./composables/utils";
import store from "./store";
import { showFullLoading,hideFullLoading } from "./composables/utils";
router.beforeEach(async(to, from, next) => {
    showFullLoading()
    const token = getToken();
    if (!token && to.path != '/login') {
        toast('请先登录', 'error')
        return next({path: '/login'})
    }
    if(token && to.path == '/login'){
        toast('请勿重复登录', 'error')
        return next({path: from.path ? from.path : '/'})
    }
    if(token){
        await store.dispatch('getInfo')
    }
    let title = to.meta.title ? to.meta.title : ''
    document.title = title
    next()
})
router.afterEach(() => {
    hideFullLoading()
})