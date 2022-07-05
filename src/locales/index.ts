import { type App } from 'vue'
import { createI18n } from 'vue-i18n'
import { store } from '@/stores'
import { useLocaleStore } from '@/stores/modules/locale'

async function createI18nOptions() {
    const localeStore = useLocaleStore(store) // 此处必须传入store
    const locale = localeStore.getLocale
    const defaultLocal = await import(`./lang/${locale}.ts`)
    const message = defaultLocal.default?.message ?? {}
    return {
        legacy: false, // composition API
        locale,
        messages: {
            [locale]: message as { [key: string]: string },
        },
        fallbackLocale: 'zh-cn', //  默认语言环境
        globalInjection: true, // 全局注册$t方法
        silentTranslationWarn: true, // true - warning off
        missingWarn: false,
        silentFallbackWarn: true,
    }
}

const options = await createI18nOptions()
export const i18n = createI18n(options)
export function setupI18n(app: App) {
    app.use(i18n)
}
