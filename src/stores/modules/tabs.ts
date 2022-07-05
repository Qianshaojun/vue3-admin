import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import router from '@/router'
import { LOGIN_NAME } from '@/router/constant'

interface ITabsViewState {
    /** 标签页 */
    tabsList: RouteLocationNormalized[]
}

// 不需要出现在tabs中的路由
export const BlackList = [LOGIN_NAME, 'notFound'] as const

export const useTabsStore = defineStore({
    id: 'app-tabs',
    state: (): ITabsViewState => ({ tabsList: [] }),
    getters: {
        getTabsList(state) {
            return state.tabsList
        },
        // 当前activity tab
        getCurrentTab(state) {
            const currentRoute = router.currentRoute.value!
            return state.tabsList.find((item) => {
                return item.fullPath === currentRoute.fullPath
            })
        },
    },
    actions: {
        // 初始化标签页
        initTabs(routes) {
            this.tabsList = routes
        },
        // 添加标签页
        addTabs(route): boolean {
            if (BlackList.includes(route.name)) return false
            const isExists = this.tabsList.some((item) => item.fullPath === route.fullPath)
            if (!isExists) {
                this.tabsList.push(route)
            }
            return true
        },
        closeCurrentTab(route) {
            const index = this.tabsList.findIndex((item) => item.fullPath === route.fullPath)
            this.tabsList.splice(index, 1)
            const isDelCurrentTab = Object.is(this.getCurrentTab, this.tabsList[index])
            // 如果关闭的tab就是当前激活的tab，则重定向页面
            if (isDelCurrentTab) {
                const currentRoute = this.tabsList[Math.max(0, this.tabsList.length - 1)]
                router.push(currentRoute)
            }
        },
    },
})
