/**
 * 获取菜单MenuCode
 */
import { RouteRecordName } from 'vue-router'
import router from '@/router/index'
import { useUserStore } from '@/stores/modules/user'
import { computed } from 'vue'

export function useMenuCode(name?: RouteRecordName | null | undefined): string {
    let code = ''
    let menu_name = name
    const routeName = router.currentRoute.value.name
    if (!name) {
        menu_name = routeName
    }
    const userStore = useUserStore()
    const userInfo = computed(() => userStore.getUserInfo)
    const menu_dict = userInfo.value?.menu_dict
    code = menu_name ? menu_dict[menu_name] : ''
    return code
}
