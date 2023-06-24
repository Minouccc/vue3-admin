<template>
    <div>
        后台首页
        {{ $store.state.user.username }}
        <el-button @click="handleLogout">退出登录</el-button>
    </div>
</template>
<script setup>
import { showModal,toast} from '~/composables/utils'
import { logout } from '~/api/manager'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
function handleLogout(){
    store.dispatch('logout')
    showModal("是否要确认退出登录","提示").then(res =>{
        logout().finally(()=>{
        store.dispatch('logout')
        router.push('/login')
        toast('退出登录成功')
        })
     })
}
</script>