<template>
    <el-card shadow="never" class="mt-5">
        <template #header>
            <div class="flex justify-between">
                <span class="tx-sm">订单统计</span>
                <div>
                    <el-check-tag class="mr-5" v-for="(item, index) in options" :key="index"
                        :checked="current == item.value" @change="onChange(item.value)">{{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>
        <div ref="el" id="chart" style="width: 100%;height: 300px;"></div>
    </el-card>
</template>

<script setup>
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getStatistics3 } from '~/api/index'

const current = ref('hour')
const el = ref(null)
const options = [
    {
        text: '近1个月',
        value: "month"
    },
    {
        text: '近1周',
        value: "week"
    },
    {
        text: '近24小时',
        value: "hour"
    }
]
const onChange = (type) => {
    current.value = type
    getData()
}

function getData() {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    myChart.showLoading()
    getStatistics3(current.value).then(res => {
        option.xAxis.data = res.x
        option.series[0].data = res.y
        myChart.setOption(option)
    }).finally(() => {
        myChart.hideLoading()
    })
}
var myChart = null
onMounted(() => {
    var chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);
    getData()
});
onBeforeUnmount(() => {
    if (myChart) {
        echarts.dispose(myChart)
    }
})
useResizeObserver(el, (entries) => {
    myChart.resize()
})
</script>
<style scoped></style>