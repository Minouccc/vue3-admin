import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import {router} from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(store)
app.use(router)

app.use(ElementPlus)

import 'virtual:windi.css'
import './permisson'
import 'nprogress/nprogress.css'

import permission from './directives/permission'
app.use(permission)
app.mount('#app')
