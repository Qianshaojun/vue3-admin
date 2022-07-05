import { httpRequest } from '@/utils/http'
import type { RequestOptions } from '@/utils/http/types'
import { RequestMethodEnum } from '@/enums/httpEnum'

export function HttpLogin<T>(params: T, option?: RequestOptions) {
    return httpRequest.request(
        {
            url: '/wms/user_login',
            method: RequestMethodEnum.Post,
            data: params,
        },
        option,
    )
}
