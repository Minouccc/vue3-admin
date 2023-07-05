import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

export function useTagList() {
    const route = useRoute()
    const router = useRouter()
    const cookie = useCookies()
    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        }
    ])
    const addTab = (tab) => {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)
            activeTab.value = tab.path
        }
        cookie.set("tabList", tabList.value)
    }
    onBeforeRouteUpdate((to, from) => {
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    //初始化标签导航列表
    const initTabList = () => {
        let tbs = cookie.get("tabList")
        if (tbs) {
            tabList.value = tbs
        }
    }
    initTabList()
    const changeTab = (t) => {
        activeTab.value = t
        router.push(t)
    }

    const removeTab = (t) => {
        let tabs = tabList.value
        let a = activeTab.value
        if (a == t) {
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        a = nextTab.path
                    }
                }
            })
        }
        activeTab.value = a
        tabList.value = tabList.value.filter(tab => tab.path !== t)
        cookie.set("tabList", tabList.value)
    }
    const handleClose = (c) => {
        if (c == 'clearOther') {
            tabList.value = tabList.value.filter(tab => tab.path == '/' || tab.path == activeTab.value)
        } else if (c == 'clearAll') {
            activeTab.value = '/'
            tabList.value = [{
                title: '后台首页',
                path: '/'
            }]
        }
        cookie.set("tabList", tabList.value)
    }
    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}