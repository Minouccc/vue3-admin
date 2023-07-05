<template>
    <el-upload drag action="/api/admin/image/upload" multiple :headers="{ token }" name="img" :data="data"
        :on-success="uploadSuccess" :on-error="uploadError">
        <el-icon class=" el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import { getToken } from '~/composables/auth'
import { toast } from '~/composables/utils'
const token = getToken()
defineProps({
    data: Object
})

const uploadSuccess = (response, uploadFile, uploadFiles) => {
    emit("success", {
        response, uploadFile, uploadFiles
    })
}
const uploadError = (err, uploadFile, uploadFiles) => {
    let msg = JSON.parse(err.message).msg || "上传失败"
    toast(msg, "error")
}
</script>
<style scoped></style>