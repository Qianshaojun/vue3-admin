import { httpRequest } from '@/utils/http'
import type { RequestOptions, IInterfaceParams } from '@/utils/http/types'
import { RequestMethodEnum } from '@/enums/httpEnum'

export function HttpQuery<T>(
    params: T,
    interfaceParams: IInterfaceParams,
    option?: RequestOptions,
) {
    return httpRequest.request(
        {
            url: '/system_api/query',
            method: RequestMethodEnum.Post,
            data: { ...params, ...interfaceParams },
        },
        option,
    )
}

export function HttpQueryPagination<T>(
    params: T,
    interfaceParams: IInterfaceParams,
    option?: RequestOptions,
) {
    return httpRequest.request(
        {
            url: '/system_api/query_pagination',
            method: RequestMethodEnum.Post,
            data: { ...params, ...interfaceParams }
        },
        option,
    )
}

export function HttpModify<T>(
    params: T,
    interfaceParams: IInterfaceParams,
    option?: RequestOptions,
) {
    return httpRequest.request(
        {
            url: '/system_api/modify',
            method: RequestMethodEnum.Post,
            data: { ...params, ...interfaceParams },
        },
        option,
    )
}
