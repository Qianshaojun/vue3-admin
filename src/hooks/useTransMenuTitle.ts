import { useUserStore } from '@/stores/modules/user'
import { useLocale } from '@/locales/useLocale'
import { computed } from 'vue'

/**
 * 菜单转中文
 * @param name
 */
export function translateMenuTitle(name: any): string {
    const userStore = useUserStore()
    const { getLocale } = useLocale()
    const menus = computed(() => userStore.getMenus)
    let ret = ''
    let menuArr: any = []
    if (menus.value) {
        menuArr = menus.value.map((item) => {
            let _menu: any = []
            if (item.children && item.children.length) {
                _menu = item.children.map((x) => {
                    let smenu: any[] = []
                    if (x.children && x.children.length) {
                        smenu = x.children.map((y) => y)
                    }
                    smenu.push(x)
                    return smenu
                })
            }
            _menu.push(item)
            const menuTemp: any = []
            for (const i of _menu) {
                if (i && i.id) {
                    menuTemp.push(i)
                } else {
                    for (const k of i) {
                        menuTemp.push(k)
                    }
                }
            }

            return menuTemp
        })
    }

    const menu = menuArr.flat(Infinity).find((x) => x.name === name) || {}
    if (getLocale.value === 'zh-cn') {
        ret = menu?.name_chn
        if (name === 'welcome') {
            ret = '工作区'
        }
    } else {
        ret = menu?.name
        if (name === 'welcome') {
            ret = 'WorkSpace'
        }
    }

    return ret
}
