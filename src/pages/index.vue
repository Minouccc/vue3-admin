<template>
    <div>
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <template v-if="panels.length == 0">
                <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card class="border-0" shadow="hover">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="text" style="width: 50%" />
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <el-skeleton-item variant="h3" style="width: 80%" />
                                <el-divider />
                                <div class="flex justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>

                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
                <el-card class="border-0" shadow="hover">
                    <template #header>
                        <div class="flex justify-between">
                            <span class="text-sm">{{ item.title }}</span>
                            <el-tag effect="plain" :type="item.unitColor">{{ item.unit }}</el-tag>
                        </div>
                    </template>
                    <div class="text-3xl font-bold text-gray-500">
                        <CountTo :value="item.value" />
                    </div>
                    <el-divider />
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
    <IndexNavs />
    <el-row :gutter="20">
        <el-col :span="12" :offset="0">
            <IndexChart v-permission="['getStatistics3,GET']" />
        </el-col>
        <el-col :span="12" :offset="0" class="mt-5" v-permission="['getStatistics2,GET']">
            <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" />
            <IndexCard class="mt-3" title="交易提示" tip="需要立即处理的交易订单" :btns="order" />
        </el-col>
    </el-row>
</template>
<script setup>
import { ref } from 'vue';
import CountTo from '~/components/CountTo.vue';
import IndexNavs from '~/components/IndexNavs.vue';
import { getStatistics1, getStatistics2 } from '~/api/index'
import IndexChart from '~/components/IndexChart.vue';
import IndexCard from '~/components/IndexCard.vue';

const panels = ref([])
const goods = ref([])
const order = ref([])
const getStatistics = async () => {
    const res = await getStatistics1()
    panels.value = res.panels
}
getStatistics()
getStatistics2().then(res => {
    goods.value = res.goods
    order.value = res.order
})
</script>