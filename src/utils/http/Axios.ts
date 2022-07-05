import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import type { RequestOptions, CreateAxiosOptions, Result } from './types'
import axios from 'axios'
import { AxiosCanceler, isFunction } from './axiosCancel'
import { cloneDeep } from 'lodash-es'
/**
 * @author QSJ
 * @description: axios的模块
 * **/
// 声明2个私有属性 axios的请求方法 和 配置
export class QAxios {
    private axiosInstance: AxiosInstance
    private options: CreateAxiosOptions

    constructor(options: CreateAxiosOptions) {
        this.options = options
        this.axiosInstance = axios.create(options)
        this.setupInterceptors()
    }
    /**
     * @description: 创建axios实例
     * */
    private createAxios(config: CreateAxiosOptions): void {
        this.axiosInstance = axios.create(config)
    }
    private getTransform() {
        const { transform } = this.options
        return transform
    }
    getAxios(): AxiosInstance {
        return this.axiosInstance
    }

    /**
     * @description: 重新配置axios
     */
    configAxios(config: CreateAxiosOptions) {
        if (!this.axiosInstance) {
            return
        }
        this.createAxios(config)
    }
    /**
     * @description: header设置方法，用来设置通用的请求头
     */
    setHeader(headers: any): void {
        if (!this.axiosInstance) {
            return
        }
        Object.assign(this.axiosInstance.defaults.headers, headers)
    }

    /**
     * @description: 拦截器配置
     * */
    private setupInterceptors() {
        const transform = this.getTransform()
        if (!transform) {
            return
        }
        const {
            requestInterceptors, // 请求之前的拦截器
            requestInterceptorsCatch, // 请求之前的拦截器错误处理
            responseInterceptors, // 请求之后的拦截器
            responseInterceptorsCatch, // 请求之后的拦截器错误处理
        } = transform

        const axiosCanceler = new AxiosCanceler()

        // 请求拦截器配置处理
        this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
            axiosCanceler.addPending(config)
            if (requestInterceptors && isFunction(requestInterceptors)) {
                config = requestInterceptors(config)
            }
            return config
        }, undefined) // 成功和错误的处理分开写，传入undefined

        // 请求拦截器错误捕捉
        requestInterceptorsCatch &&
            isFunction(requestInterceptorsCatch) &&
            this.axiosInstance.interceptors.request.use(undefined, responseInterceptorsCatch)

        // 响应结果拦截器处理
        this.axiosInstance.interceptors.response.use((res: AxiosResponse) => {
            res && axiosCanceler.removePending(res.config)
            if (responseInterceptors && isFunction(responseInterceptors)) {
                res = responseInterceptors(res)
            }
            return res
        }, undefined)

        // 响应结果拦截器错误捕获
        responseInterceptorsCatch &&
            isFunction(responseInterceptorsCatch) &&
            this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
    }
    /**
     * @description:   请求方法封装
     */

    request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        let conf: AxiosRequestConfig = cloneDeep(config)

        const transform = this.getTransform()

        const { requestOptions } = this.options

        const opt: RequestOptions = Object.assign({}, requestOptions, options)

        const { beforeRequestHook, requestCatch, transformRequestDataSuccess } = transform || {}
        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt)
        }
        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<any, AxiosResponse<Result>>(conf)
                .then((res: AxiosResponse<Result>) => {
                    // 请求是否被取消
                    const isCancel = axios.isCancel(res)
                    if (
                        transformRequestDataSuccess &&
                        isFunction(transformRequestDataSuccess) &&
                        !isCancel
                    ) {
                        // 成功
                        const ret = transformRequestDataSuccess(res, opt)
                        // 针对后端响应数据特殊处理
                        if (!ret.code) {
                            return resolve(ret)
                        } else {
                            reject(ret)
                        }
                    }
                    reject(res as unknown as Promise<T>)
                })
                .catch((e: Error) => {
                    if (requestCatch && isFunction(requestCatch)) {
                        reject(requestCatch(e))
                        return
                    }
                    reject(e)
                })
        })
    }
}
