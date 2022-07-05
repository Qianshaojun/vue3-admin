import type { App } from 'vue'

import { SvgIcon } from '@/components/globalComponents/svg-icon'
import { FlexContainer } from '@/components/globalComponents/container'

/**
 * 全局注册自定义组件
 * @param app
 */
export function setupGlobalComponents(app: App) {
    app.component('SvgIcon', SvgIcon)
    app.component('FlexContainer', FlexContainer)
}
