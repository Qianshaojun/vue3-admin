import { type Router } from 'vue-router'
import NProgress from 'nprogress'
import { LOGIN_NAME } from '@/router/constant'
import { Storage } from '@/utils/Storage'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import { useUserStore } from '@/stores/modules/user'
import { computed } from 'vue'

NProgress.configure({ showSpinner: true })

const defaultRoutePath = '/'
export function createRouterGuards(router: Router, whiteNameList: any) {
    router.beforeEach((to, from, next) => {
        NProgress.start() // start progress bar
        const token = Storage.get(ACCESS_TOKEN_KEY, null)

        const userStore = useUserStore()
        const menus = computed(() => userStore.getMenus)
        if (token) {
            if (to.name === LOGIN_NAME && authCheck(menus.value, to.name)) {
                next({ path: defaultRoutePath })
                NProgress.done()
            } else {
                // 强制跳转
                if (to.name === LOGIN_NAME) {
                    next()
                }
                if (!authCheck(menus.value, to.name) && !to.meta.isShow) {
                    next({
                        name: LOGIN_NAME,
                        replace: true,
                    })
                } else {
                    next()
                }
            }
        } else {
            if (whiteNameList.some((v) => v === to.name)) {
                next()
            } else {
                next({
                    name: LOGIN_NAME,
                    query: { redirect: to.fullPath },
                    replace: true,
                })
                NProgress.done()
            }
        }
    })

    router.afterEach(() => {
        NProgress.done()
    })
}

// 认证状态检测
const authCheck = (menus, toName) => {
    let menuArr: any = []

    if (menus.length) {
        menuArr = menus.map((item) => {
            let menu: any[] = []

            if (item.children && item.children.length) {
                menu = item.children.map((x) => {
                    let smenu: any[] = []
                    if (x.children && x.children.length) {
                        smenu = x.children.map((y) => y.name)
                    }
                    smenu.push(x.name)
                    return smenu
                })
            }
            menu.push(item.name)

            const menuTemp: any = []
            for (const i of menu) {
                if (typeof i === 'string') {
                    menuTemp.push(i)
                } else {
                    for (const k of i) {
                        menuTemp.push(k)
                    }
                }
            }

            return menuTemp
        })
        menuArr = menuArr.flat(Infinity)
    }

    const detailRouteName: string[] = ['notFound']
    menuArr.push(...detailRouteName)
    return toName === 'welcome' || menuArr.includes(toName)
}
