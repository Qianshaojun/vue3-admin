// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动

import type { AxiosResponse } from 'axios'
import type { AxiosTransform } from './axiosTransform'
import { QAxios } from './Axios'
import { useUserStore } from '@/stores/modules/user'
import { computed } from 'vue'
import { Storage } from '@/utils/Storage'
import { SESSION_ID_KEY } from '@/enums/cacheEnum'
import { showLoading, closeLoading } from '@/utils/http/httpService/Loading'

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
    // 请求之前处理config
    beforeRequestHook: (config, options) => {
        if (config.data) {
            config.data['user_browser_tz'] = [
                -new Date().getTimezoneOffset() / 60,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
            ]
        }
        if (options?.page) {
            config.data['page_index'] = options.page?.default?.pageIndex
            config.data['page_size'] = options.page?.default?.pageSize
        }
        if (options?.isShowLoading) {
            showLoading()
        }
        return config
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config) => {
        // 请求之前添加token
        const userStore = useUserStore()
        const token = computed(() => userStore.getToken)
        const session_id = Storage.get(SESSION_ID_KEY, undefined)
        if (config.headers) {
            if (token.value) {
                if (!Storage.get('session_expires')) {
                    config.headers.is_expires = false
                }
                config.headers['csrf_token'] = token.value
            }

            if (session_id) {
                config.headers['customer_key'] = session_id
            }
        }
        config.params = Object.assign(config.params || {}, {
            csrf_token: token.value || '',
            customer_key: session_id || '',
        })
        return config
    },

    /**
     * @description: 响应拦截器成功处理
     */
    responseInterceptors: (res: AxiosResponse<any>) => {
        closeLoading()
        // 添加过期时间
        if (res.headers.customer_key) {
            Storage.set(SESSION_ID_KEY, res.headers.customer_key)
            if (!Storage.get<string>('session_expires') || res.config.url === 'wms/user_login') {
                Storage.set('session_expires', 'false')
            }
        }
        return res
    },

    /**
     * @description: 响应拦截器错误处理
     */
    responseInterceptorsCatch: (error: any) => {
        closeLoading()
        return Promise.reject(error)
    },

    /**
     * 请求成功
     */
    transformRequestDataSuccess(ret: AxiosResponse, options) {
        closeLoading()
        if (options.page) {
            options.page.setPage({ total: ret.data.result.length })
        }
        return ret.data.result
    },

    requestCatch(error) {
        closeLoading()
        return Promise.reject(error)
    },
}

function createAxios() {
    return new QAxios({
        // 基础接口地址
        baseURL: import.meta.env.VITE_APP_BASE_URL,
        timeout: 10 * 1000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        // 数据处理方式
        transform,
        // 配置项
        requestOptions: {},
    })
}
export const httpRequest = createAxios()
