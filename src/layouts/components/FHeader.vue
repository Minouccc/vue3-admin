<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1"><eleme-filled /></el-icon>
            Minou编程
        </span>
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <fold v-if="$store.state.asideWidth == '250px'" />
            <Expand v-else />
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <refresh />
            </el-icon>
        </el-tooltip>

        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle"><full-screen v-if="!isFullscreen" />
                    <aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="icon-btn">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <!-- <el-drawer v-model="drawer" title="修改密码" size="45%" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="form.password">
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="新密码">
                <el-input type="password" v-model="form.repassword">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer> -->
    <FormDrawer ref="formDrawerRef" title="修改密码" destroyOnClose="false" @submit="onSubmit">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="form.password">
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="新密码">
                <el-input type="password" v-model="form.repassword">
                </el-input>
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { showModal, toast } from '~/composables/utils'
import { logout, updatepassword } from '~/api/manager'
import FormDrawer from '../../components/FormDrawer.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const formDrawerRef = ref(null)
const { isFullscreen, toggle } = useFullscreen()
const store = useStore()
const router = useRouter()
//退出登录
const handleLogout = () => {
    store.dispatch('logout')
    showModal("是否要确认退出登录", "提示").then(res => {
        logout().finally(() => {
            store.dispatch('logout')
            router.push('/login')
            toast('退出登录成功')
        })
    })
}
//dropdown命令
const handleCommand = (command) => {
    switch (command) {
        case 'rePassword':
            formDrawerRef.value.open()
            break
        case 'logout':
            handleLogout()
            break;
        default:
            break;
    }
}
//刷新
const handleRefresh = () => {
    location.reload()
}
//修改密码
const form = reactive({
    oldpassword: "",
    password: "",
    repassword: ""
})
const rules = {
    oldpassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    repassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
}
const formRef = ref(null)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return false
        formDrawerRef.value.showLoading()
        updatepassword(form).then(
            res => {
                toast('修改密码成功')
                store.dispatch('logout')
                router.push('/login')
            }
        ).finally(() => {
            formDrawerRef.value.hideLoading()
        })
    })
}
</script>
<style scoped>
.f-header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
    z-index: 1000;
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}

.dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex items-center justify-center mx-5;
}
</style>