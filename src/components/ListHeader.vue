<template>
    <div class="flex justify-between items-center mb-4">
        <el-button type="primary" size="small" @click="$emit('create')">新增</el-button>
        <el-tooltip effect="dark" content="刷新数据" placement="top">
            <el-icon @click="$emit('refresh')">
                <Refresh />
            </el-icon>
        </el-tooltip>
    </div>
</template>

<script setup>
defineEmits(['create', 'refresh'])
</script>
<style scoped></style>