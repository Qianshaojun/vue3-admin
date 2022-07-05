import { AxiosRequestConfig } from 'axios'
import { AxiosTransform } from './axiosTransform'

export interface CreateAxiosOptions extends AxiosRequestConfig {
    transform?: AxiosTransform // 拦截器
    requestOptions?: RequestOptions
}

// 额外接口参数
export interface IInterfaceParams {
    inner_action: string
    menu_code: string
}

// 需要增加的options 用来控制功能
export interface RequestOptions {
    page?: any
    isShowLoading?: boolean
}

// 后端返回数据的格式
export interface Result<T = any> {
    code: number
    message: string
    result?: T
}
