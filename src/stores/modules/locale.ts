import { defineStore } from 'pinia'
import { Storage } from '@/utils/Storage'
import { LOCAL_CACHE_NAME } from '@/enums/cacheEnum'

interface ILocaleState {
    locale: string
}

export const useLocaleStore = defineStore({
    id: 'app-locale',
    state: (): ILocaleState => ({
        locale: Storage.get(LOCAL_CACHE_NAME, 'zh-cn'),
    }),
    getters: {
        getLocale(): string {
            return this.locale ?? 'zh-cn'
        },
    },
    actions: {
        changeLocale(val) {
            this.locale = val
            Storage.set(LOCAL_CACHE_NAME, val)
        },
    },
})
