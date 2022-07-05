import axios, { AxiosRequestConfig, Canceler } from 'axios'
// @ts-ignore
import qs from 'qs'

const toString = Object.prototype.toString
/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`
}
/**
 * @description:  是否为函数
 */
export function isFunction<T = Function>(val: unknown): val is T {
    return is(val, 'Function')
}

// 声明一个 Map 用于存储每个请求的标识 和 取消函数 new Map<key,value>
let pendingMap = new Map<string, Canceler>()

export const getPendingUrl = (config: AxiosRequestConfig) =>
    [config.method, config.url, qs.stringify(config.data), qs.stringify(config.params)].join('&')

// axiosCancel实例，取消重复请求

export class AxiosCanceler {
    /**
     * 添加请求
     * @param {Object} config
     */
    addPending(config: AxiosRequestConfig) {
        this.removePending(config)
        const url = getPendingUrl(config)
        config.cancelToken =
            config.cancelToken ||
            new axios.CancelToken((cancel) => {
                if (!pendingMap.has(url)) {
                    // 如果 pending 中不存在当前请求，则添加进去
                    pendingMap.set(url, cancel)
                }
            })
    }

    /**
     * @description: 清空所有pending
     */
    removeAllPending() {
        pendingMap.forEach((cancel) => {
            cancel && isFunction(cancel) && cancel()
        })
        pendingMap.clear()
    }

    /**
     * 移除请求
     * @param {Object} config
     */
    removePending(config: AxiosRequestConfig) {
        const url = getPendingUrl(config)

        if (pendingMap.has(url)) {
            // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
            const cancel = pendingMap.get(url)
            cancel && cancel(url)
            pendingMap.delete(url)
        }
    }

    /**
     * @description: 重置
     */
    reset(): void {
        pendingMap = new Map<string, Canceler>()
    }
}
