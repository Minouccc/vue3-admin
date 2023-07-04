<template>
    <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="destroyOnClose">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'

const showDrawer = ref(false)
const loading = ref(false)
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '45%'
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "提交"
    }
})
const emit = defineEmits(["submit"])
const submit = () => {
    emit("submit")
}
const open = () => {
    showDrawer.value = true
}
const close = () => {
    showDrawer.value = false
}
const showLoading = () => {
    loading.value = true
}
const hideLoading = () => {
    loading.value = false
}
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})
</script>
<style scoped>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    position: absolute;
    flex: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply mt-auto flex items-center
}
</style>