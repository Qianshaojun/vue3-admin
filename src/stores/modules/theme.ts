import { defineStore } from 'pinia'
import { Storage } from '@/utils/Storage'
import { THEME_KEY } from '@/enums/cacheEnum'
import darkThemeCss from 'ant-design-vue/dist/antd.dark.css?raw'
import { ConfigProvider } from 'ant-design-vue'

interface IThemeState {
    theme: string
    themeColor: string
}

const styleDom = document.createElement('style')
styleDom.dataset.type = 'theme-dark'
document.head.appendChild(styleDom)
const setRealDarkTheme = (theme?: string) => {
    if (theme === 'realDark') {
        document.documentElement.classList.add('dark')
        styleDom.textContent = darkThemeCss
    } else {
        document.documentElement.classList.remove('dark')
        styleDom.textContent = ''
    }
}

let localThemeConfig: any = {}
try {
    localThemeConfig = JSON.parse(Storage.get(THEME_KEY, '{}'))
    const { theme, themeColor } = localThemeConfig
    theme && setRealDarkTheme(theme)
    themeColor &&
        ConfigProvider.config({
            theme: {
                primaryColor: themeColor,
            },
        })
} catch {
    localThemeConfig = {}
}

export const useThemeStore = defineStore({
    id: 'app-theme',
    state: (): IThemeState => ({
        theme: 'dark',
        themeColor: 'rgb(24, 144, 255)',
        ...localThemeConfig,
    }),
    getters: {
        getTheme(): string {
            return this.theme ?? 'dark'
        },
    },
    actions: {
        setTheme(val) {
            this.theme = val
            setRealDarkTheme(val)
            Storage.set(THEME_KEY, JSON.stringify(this.$state))
        },
        setThemeColor(val) {
            this.themeColor = val.primaryColor
            ConfigProvider.config({
                theme: val,
            })
            Storage.set(THEME_KEY, JSON.stringify(this.$state))
        },
    },
})
