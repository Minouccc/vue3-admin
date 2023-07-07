import { ref, reactive, computed } from "vue"
import { toast } from '~/composables/utils'

export function useInitTable(opt = {}) {
    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (let key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }
    const tableData = ref([])
    const loading = ref(false)

    // 分页
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)

    // 获取数据
    function getData(p = null) {
        if (typeof p == "number") {
            currentPage.value = p
        }

        loading.value = true
        opt.getList(currentPage.value, searchForm)
            .then(res => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
                    opt.onGetListSuccess(res)
                } else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            })
            .finally(() => {
                loading.value = false
            })
    }
    // 删除
    const handleDelete = (id) => {
        loading.value = true
        opt.delete(id).then(res => {
            toast("删除成功")
            getData()
        })
            .finally(() => {
                loading.value = false
            })
    }

    // 修改状态
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status)
            .then(res => {
                toast("修改状态成功")
                row.status = status
            })
            .finally(() => {
                row.statusLoading = false
            })
    }

    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData, 
        handleDelete, 
        handleStatusChange
    }
}

export function useInitForm(opt = {}) {
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const defaultForm = opt.form
    const form = reactive({})
    const rules = opt.rules || {}
    const editId = ref(0)
    const drawerTitle = computed(() => editId.value ? "修改" : "新增")

    const handleSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) return

            formDrawerRef.value.showLoading()

            const fun = editId.value ? opt.update(editId.value, form) : opt.create(form)

            fun.then(res => {
                toast(drawerTitle.value + "成功")
                // 修改刷新当前页，新增刷新第一页
                opt.getData(editId.value ? false : 1)
                formDrawerRef.value.close()
            })
                .finally(() => {
                    formDrawerRef.value.hideLoading()
                })

        })
    }

    // 重置表单
    function resetForm(row = false) {
        if (formRef.value) formRef.value.clearValidate()

        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }

    // 新增
    const handleCreate = () => {
        editId.value = 0
        resetForm(defaultForm)
        formDrawerRef.value.open()
    }

    // 编辑
    const handleEdit = (row) => {
        editId.value = row.id
        resetForm(row)
        formDrawerRef.value.open()
    }
    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        handleSubmit,
        resetForm,
        handleCreate,
        handleEdit
    }
}