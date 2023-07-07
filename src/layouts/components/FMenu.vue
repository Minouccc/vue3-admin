<template>
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <el-menu unique-opened :collapse="isCollapse" :collapse-transition="false" :default-active="defaultActive"
            default-active="2" class="border-0" @select="handleSelect">
            <template v-for="(item, index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon" />
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon" />
                        </el-icon>
                        {{ item2.name }}
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="item.name">
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore()
const route = useRoute()
const defaultActive = ref(route.path)
onBeforeRouteUpdate((to, from) => {
    defaultActive.value = to.path
})
//menu是否折叠
const isCollapse = computed(() => !(store.state.asideWidth == '250px'))
const asideMenus = computed(() => store.state.menus)
const handleSelect = (e) => {
    router.push(e)
}
</script>
<style scoped>
.f-menu {
    width: 250px;
    top: 64px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md fixed bg-light-50;
}

.f-menu::-webkit-scrollbar {
    width: 0;
}
</style>