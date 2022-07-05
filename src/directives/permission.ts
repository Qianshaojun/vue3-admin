import type { App, Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { useMenuCode } from '@/hooks/useMenuCode'
import { computed } from 'vue'

function isAuth(el: Element, binding: any) {
    const userStore = useUserStore()
    const buttonAuthInfo = computed(() => userStore.getButtonAuthInfo)

    // 获取绑定的权限值
    const authCode = binding.value
    // 获取绑定的菜单参数
    const bindMenuName = binding.arg || ''
    if (!authCode) return
    let permissions: any = []
    let menuObj: any = {}
    const menuCode: string = useMenuCode(bindMenuName)

    if (menuCode) {
        menuObj = buttonAuthInfo.value.find((v) => v.menu_code === menuCode) // 主菜单
    }
    if (menuObj && menuObj.exists_authority) {
        permissions = menuObj.button_list.map((v) => v.button_name)
    }

    const hasPermission = checkAuthority(authCode, permissions)

    if (!hasPermission) {
        if (el.parentNode) {
            el.parentNode?.removeChild(el)
        }
    }
}
// 校验按钮权限
function checkAuthority(permissionCode: string | string[], permissions: string[]): boolean {
    let hasPermission = true
    if (permissionCode) {
        // 区分指令绑定的是单个或多个权限
        if (permissionCode instanceof Array && permissionCode.length > 0) {
            hasPermission = permissions.some((it) => permissionCode.includes(it))
        } else {
            hasPermission = permissions.some((item) => item === permissionCode)
        }
    }
    return hasPermission
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
    isAuth(el, binding)
}

const authDirective: Directive = {
    mounted,
}
export function setUpPermissionDirective(app: App) {
    app.directive('auth', authDirective)
}
