<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative  mb-3" :body-style="{ 'padding': 0 }"
                        :class="{ 'border-blue-500': item.checked }">
                        <el-image :src="item.url" fit="cover" class="w-full h-[150px]" :preview-src-list="[item.url]"
                            :initial-index="0">
                        </el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex justify-center items-center p-2">
                            <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)" />
                            <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>

                            <el-popconfirm title="是否要确认删除？" confirmButtonText="确认" cancelButtonText="取消"
                                @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button class="!m-0" type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>

                        </div>
                    </el-card>
                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <el-pagination layout="prev, pager,next" :total="totalCount" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>
    </el-main>
    <el-drawer v-model="drawer" title="上传图片">
        <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess" />
    </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getImageList, updateImage, deleteImage } from '~/api/image'
import { showPrompt, toast } from '~/composables/utils'
import UploadFile from '~/components/UploadFile.vue'
const loading = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)
const limit = ref(10)
const list = ref([])
const image_class_id = ref(0)

const getData = (p) => {
    if (typeof p == 'number') {
        currentPage.value = p
    }
    loading.value = true
    getImageList(image_class_id.value, currentPage.value).then(res => {
        list.value = res.list.map(item => {
            item.checked = false
            return item
        })
        totalCount.value = res.totalCount
    }).finally(() => {
        loading.value = false
    })
}
//根据分类id重新获取图片列表
const loadData = (id) => {
    currentPage.value = 1
    image_class_id.value = id
    getData()
}
const handleEdit = (item) => {
    showPrompt("重命名", item.name).then(({ value }) => {
        loading.value = true
        updateImage(item.id, value).then(res => {
            toast("修改成功")
            getData()
        }).finally(() => {
            loading.value = false
        })
    })
}
const handleDelete = (id) => {
    loading.value = true
    deleteImage([id]).then(res => {
        toast("删除成功")
        getData()
    }).finally(() => {
        loading.value = false
    })
}
const drawer = ref(false)
const openUploadFile = () => {
    drawer.value = true
}
const handleUploadSuccess = () => {
    getData()
}
const checkedImage = computed(() => {
    return list.value.filter(item => item.checked)
})
const emit = defineEmits(['choose'])
const handleChooseChange = (item) => {
    if (item.checked && checkedImage.value.length > 1) {
        item.checked = false
        return toast(`最多只能选中1张`, "error")
    }
    emit('choose', checkedImage.value)
}
defineExpose({
    loadData,
    openUploadFile
})
defineProps({
    openChoose: {
        type: Boolean,
        default: false
    }
})
</script>
<style scoped>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-main .bottom {
    position: absolute;
    height: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    @apply flex justify-center items-center;
}

.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>