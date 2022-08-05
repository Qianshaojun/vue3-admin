<template>
    <a-card :bordered="false">
        <div>你好！</div>
        <br />
        <div>测试菜单路由跳转：菜单点击采购合同和发货合同</div>
        <br />
        <div>总页数：{{ pageService.default.total }}</div>
        <br />
        <a-space>
            <a-button type="primary" @click="testRequestLoading">测试请求及loading</a-button>
            <a-button type="primary" @click="testModal">测试弹框</a-button>
            <a-button type="primary" v-auth:order-manage="'batch_modify_invoice_address'">测试按钮权限</a-button>
            <!--v-auth:菜单名="权限值"-->
            <a-button type="primary" @click="goToDetail(1)">跳转详情1</a-button>
            <a-button type="primary" @click="goToDetail(2)">跳转详情2</a-button>
            <a-button type="primary" @click="exportTable">{{ t('export') }}</a-button>
            <a-button type="primary" @click="importExcel">{{ t('import') }}</a-button>
        </a-space>
    </a-card>
</template>

<script setup lang="ts">
    import { reactive } from 'vue'
    import { PageService } from '@/utils/http/httpService/Page'
    import { HttpQueryPagination } from '@/api/public'
    import { message } from 'ant-design-vue'
    import { useMenuCode } from '@/hooks/useMenuCode'
    import { useModal } from '@/hooks/useModal'
    import test from '@/components/modalInsideComponents/TestDialog.vue'
    import { useI18n } from 'vue-i18n'
    import { useRouter } from 'vue-router'
    import { ImportExcel } from 'components/globalComponents/importExcel'

    const { t } = useI18n()
    const pageService = reactive(new PageService())
    const router = useRouter()
    const testRequestLoading = () => {
        HttpQueryPagination(
            {
                query_condition: [],
            },
            {
                inner_action: '/sale_order/query_all',
                menu_code: useMenuCode('order-manage'),
            },
            { isShowLoading: true, page: pageService },
        )
            .then((res) => {
                console.log('testRes', res)
            })
            .catch((err) => {
                err.message && message.error(err.message)
            })
    }
    const testModal = () => {
        useModal(test, { info: { text: 'haha' } }, { title: t('dialogTitle'), width: 800 })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const goToDetail = (id) => {
        router.push({
            name: 'purchase_manage_detail',
            params: {
                id: id,
            },
            query: {
                name: id + t('detail'),
            },
        })
    }

    const exportTable = () => {}
    const importExcel = () => {
        useModal(
            ImportExcel,
            {
                urlPath: '/system_api/upload?inner_action=purchase_management/import_stock_plan_data&menu_code=' + useMenuCode('scheduling-plan'),
            },
            { title: t('import'), width: 1000 },
        ).then(() => {
            console.log('res111')
        })
    }
</script>

<i18n>
{
    "en-us": {
        "dialogTitle": "DialogTitle",
        "detail": "Detail",
        "export": "Export",
        "import": "Import"
    },
    "zh-cn": {
        "dialogTitle": "弹框标题",
        "detail": "采购合同详情",
        "export": "导出",
        "import": "导入"
    }
}
</i18n>
