import { defineStore } from 'pinia'

interface ILoadingState {
    loading: boolean
    loadingMask: boolean
}

export const useLoadingStore = defineStore({
    id: 'app-loading',
    state: (): ILoadingState => ({
        loading: false,
        loadingMask: false,
    }),
    getters: {
        getLoadingState(): ILoadingState {
            return { loading: this.loading, loadingMask: this.loadingMask }
        },
    },
    actions: {
        setLoadingState(obj: ILoadingState) {
            this.loading = obj.loading
            this.loadingMask = obj.loadingMask
        },
    },
})
