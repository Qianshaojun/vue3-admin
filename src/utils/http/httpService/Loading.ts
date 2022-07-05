import { useLoadingStore } from '@/stores/modules/loading'

const loadingStore = useLoadingStore()

let needLoadingRequestCount = 0
let _timer: any = null

function startLoading() {
    loadingStore.setLoadingState({ loading: true, loadingMask: false })
    _timer = setTimeout(() => {
        loadingStore.setLoadingState({ loading: false, loadingMask: true })
    }, import.meta.env.VITE_LOADING_MASK_TIMEOUT)
}

function endLoading() {
    clearTimeout(_timer)
    loadingStore.setLoadingState({ loading: false, loadingMask: false })
}

export function showLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function closeLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}
