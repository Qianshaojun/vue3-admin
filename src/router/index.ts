import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { type App } from 'vue'
import { createRouterGuards } from '@/router/guard'
import { LOGIN_NAME, whiteNameList } from '@/router/constant'
import { detailRouters } from './detailRouters'
import 'nprogress/nprogress.css' // 进度条样式

const _autoRouterList = autoImportRoutes()

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Layout',
        redirect: '/dashboard/welcome',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '工作台',
        },
        children: [
            ..._autoRouterList,
            ...detailRouters,
            {
                path: '/:path(.*)*',
                name: 'notFound',
                component: () => import('@/views/404.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: LOGIN_NAME,
        component: () => import('views/login.vue'),
        meta: {
            title: '登录',
        },
    },
]

const router = createRouter({
    history: createWebHashHistory(''), // history 模式则使用 createWebHistory()
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 重置路由  //todo?
// export function resetRouter() {
// }

// auto add route
function autoImportRoutes() {
    const requireComponent = import.meta.globEager('../views/**/*.vue') // vite导入文件方法
    const autoRouterList: Array<RouteRecordRaw> = []
    for (const i in requireComponent) {
        const componentConfig = requireComponent[i]
        let componentName = i.replace('../views/', '').replace(/\//g, '-').replace('.vue', '')
        // componentName去除目录名
        componentName = componentName.substring(
            componentName.indexOf('-') + 1,
            componentName.length,
        )
        const routerPath: string = i.replace('../views/', '').replace('.vue', '')
        autoRouterList.push({
            name: componentName,
            path: `/${routerPath}`,
            component: componentConfig.default || componentConfig,
            children: [],
        })
    }
    return autoRouterList
}

export async function setupRouter(app: App) {
    // 创建路由守卫
    createRouterGuards(router, whiteNameList)

    app.use(router)

    // 路由准备就绪后挂载APP实例
    await router.isReady()
}

export default router
