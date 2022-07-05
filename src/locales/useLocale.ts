import { unref, computed } from 'vue'
import { i18n } from '@/locales/index'
import { useLocaleStore } from '@/stores/modules/locale'
import type { Locale } from 'ant-design-vue/es/locale-provider'
import { LocaleType } from '@/locales/config'

export const loadLocalePool: LocaleType[] = []

function setI18nLanguage(locale: LocaleType) {
    const localeStore = useLocaleStore()
    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {
        const i18nLocale: any = i18n.global.locale
        i18nLocale.value = locale
    }
    localeStore.changeLocale(locale) // 改变store locale
    // setHtmlPageLang(locale)
}
export function useLocale() {
    const localeStore = useLocaleStore()
    const getLocale = computed(() => localeStore.getLocale)
    const getAntdLocale = computed(() => {
        return i18n.global.getLocaleMessage<{ antdLocale: Locale }>(unref(getLocale)).antdLocale
    })
    async function changeLocale(locale: LocaleType) {
        const globalI18n = i18n.global
        const currentLocale = unref(globalI18n.locale)
        if (currentLocale === locale) {
            return locale
        }

        // 缓存
        if (loadLocalePool.includes(locale)) {
            setI18nLanguage(locale)
            return locale
        }
        const langModule = ((await import(`./lang/${locale}.ts`)) as any).default
        if (!langModule) return

        const { message } = langModule
        globalI18n.setLocaleMessage(locale, message)
        loadLocalePool.push(locale)

        setI18nLanguage(locale)
        return locale
    }
    return {
        getLocale,
        getAntdLocale,
        changeLocale,
    }
}
