<template>
  <el-card shadow="never" class="border-0">
    <div class="flex justify-between items-center mb-4">
      <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-icon @click="getData">
          <Refresh />
        </el-icon>
      </el-tooltip>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否要删除该公告？" confirmButtonText="确认" cancelButtonText="取消"
            @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-center items-center mt-5">
      <el-pagination layout="prev,pager, next" :total="totalCount" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-card>
  <FormDrawer ref="formDrawerRef" @submit="handleSubmit" :title="drawerTitle">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="form.title" placeholder="公告标题"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '~/api/notice'
import FormDrawer from '~/components/FormDrawer.vue'
import { toast } from '~/composables/utils'
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)
const limit = ref(10)
const getData = (p) => {
  if (typeof p == 'number') {
    currentPage.value = p
  }
  loading.value = true
  getNoticeList(currentPage.value).then(res => {
    tableData.value = res.list
    total.value = res.totalCount
  }).finally(() => {
    loading.value = false
  })
}
getData()

const form = reactive({
  title: "",
  content: ""
})
const formRef = ref(null)
const rules = {
  title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }],
}
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return
    }
    formDrawerRef.value.showLoading()
    const fun = editId.value ? updateNotice(editId.value, form) : createNotice(form)
    fun.then(res => {
      toast(drawerTitle.value + "成功")
      getData()
      formDrawerRef.value.close()
    }).finally(() => {
      formDrawerRef.value.hideLoading()
    })
  })
}
const editId = ref(null)
const formDrawerRef = ref(null)
const drawerTitle = computed(() => editId.value ? "修改公告" : "新增公告")
const resetForm = (row) => {
  if (formRef.value) {
    formRef.value.clearValidate()
  }
  if (row) {
    for (const key in form) {
      form[key] = row[key]
    }
  }
}
const handleCreate = () => {
  editId.value = 0
  resetForm({
    title: "",
    content: ""
  })
  formDrawerRef.value.open()
}
const handleEdit = (row) => {
  editId.value = row.id
  resetForm(row)
  formDrawerRef.value.open()
}

const handleDelete = (id) => {
  formDrawerRef.value.showLoading()
  deleteNotice(id).then(res => {
    toast("删除成功")
    getData()
  }).finally(() => {
    formDrawerRef.value.hideLoading()
  })
}

</script>
<style scoped></style>