import type { RouteRecordRaw } from 'vue-router'
export const detailRouters: Array<RouteRecordRaw> = [
    {
        path: '/purchase_manage_detail/:id',
        name: 'purchase_manage_detail',
        component: () => import('@/details/purchase/purchase-manage-detail.vue'),
        meta: {
            isShow: true,
        },
    },
]
