import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import './index.css'
import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.variable.min.css'
import '@/assets/style/index.less'
import 'virtual:svg-icons-register' // vite svgIcon插件注册脚本
// 引入vxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import getInstancePlugin from '@/plugins/getAppInstance'

import { setupStore } from '@/stores'
import { setupRouter } from '@/router'
import { setupI18n } from '@/locales'
import { setupGlobalComponents } from '@/plugins/globalComponent'
import { setupGlobDirectives } from '@/directives/index'

const app = createApp(App)

function setupPlugins() {
    setupGlobalComponents(app)

    setupGlobDirectives(app)
}

async function setupApp() {
    // 初始化pinia
    setupStore(app)

    // 初始化i18n
    await setupI18n(app)

    // 初始化路由
    await setupRouter(app)

    // 安装Antd
    app.use(Antd)

    app.use(VXETable)

    // 获取app实例
    app.use(getInstancePlugin)

    app.mount('#app')
}

setupPlugins()

setupApp()
