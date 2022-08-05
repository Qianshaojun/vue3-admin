<template>
    <a-upload v-model:file-list="fileList" :max-count="1" :accept="attachmentFileType" @remove="handleRemoveFile" :before-upload="beforeUpload">
        <a-button>
            <template #icon>
                <upload-outlined></upload-outlined>
            </template>
            {{ t('plzSelectFiles') }}
        </a-button>
        <a href="javascript:;" class="ml-10" v-if="props.templateDownloadUrl" @click="downloadTemplate">{{ t('downloadTemplate') }}</a>
    </a-upload>
    <template v-if="isShowImportDetail">
        <a-table
            :columns="columns"
            :data-source="data"
            class="mt-10"
            :pagination="false"
            size="middle"
            :locale="{ emptyText: t('no_data') }"
            :scroll="{ y: 1000 }"
        >
            <template #headerCell="{ title, column }">
                <a-checkbox v-model:checked="column.checked">{{ title }}</a-checkbox>
            </template>
        </a-table>
        <a-button type="primary" class="mt-10 tw-float-right" @click="uploadExcel" :loading="uploadExcelLoading">{{ t('upload') }}</a-button>
    </template>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue'
    import { message } from 'ant-design-vue'
    import { UploadOutlined } from '@ant-design/icons-vue'
    import type { ITableColumns } from './type'
    import type { UploadProps } from 'ant-design-vue'
    import { useI18n } from 'vue-i18n'
    import { importExcelProps } from './type'
    import XLSX from 'xlsx'
    import { useUserStore } from '@/stores/modules/user'
    import { SESSION_ID_KEY } from '@/enums/cacheEnum'
    import { Storage } from '@/utils/Storage'
    import axios from 'axios'

    const { t } = useI18n()
    const fileList = ref<any[]>([])
    const columns = ref<ITableColumns[]>([])
    const data = ref<any[]>([])
    const columnLabels = ref<any[]>([])
    const isShowImportDetail = ref<boolean>(false)
    const uploadExcelLoading = ref<boolean>(false)
    const attachmentFileType = '.xls,.xlsx,.csv'
    const userStore = useUserStore()
    const token = computed(() => userStore.getToken)

    const props = defineProps(importExcelProps)

    const emit = defineEmits(['modalSubmit', 'modalCancel'])
    // emit 事件
    const submit = (info) => {
        emit('modalSubmit', info)
    }
    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        fileList.value = [...fileList.value, file]
        readExcel(file)
        return false
    }

    const handleRemoveFile = () => {
        clearImportDetail()
    }
    const clearImportDetail = () => {
        isShowImportDetail.value = false
        columns.value = []
        data.value = []
    }

    // 下载模板
    const downloadTemplate = () => {}

    // 导入 表单上传
    const readExcel = (file) => {
        try {
            fileExcel(file).then((res) => {
                if (res) {
                    handleImportData(res)
                }
            })
        } catch (e: any) {
            message.error(e.message)
        }
    }
    // 读表单，返回workbook
    const fileExcel = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const data = (e.target as any).result
                // 二进制流方式读取得到整份Excel表格对象
                const workBook = XLSX.read(data, {
                    type: 'binary',
                })
                resolve(workBook)
            }
            // 以二进制方式打开文件
            reader.readAsBinaryString(file)
        })
    }

    // 处理导入的数据
    const handleImportData = (workbook) => {
        const firstRows: ITableColumns[] = []
        const excelParam: any[] = []
        const excelParamNoFirstRow: any[] = []
        let fromTo = ''
        // 遍历每张表读取
        let cnt_sheet = 0
        for (const sheet in workbook.Sheets) {
            cnt_sheet++
            if (cnt_sheet > 1) {
                break
            }
            const sheetInfos = workbook.Sheets[sheet]
            if (sheetInfos['!ref'] === undefined) {
                message.error('type_error！')
                return
            }
            let locations: any = [] // A1,B1,C1...
            if (workbook.Sheets.hasOwnProperty(sheet)) {
                fromTo = sheetInfos['!ref'] // A1:B5
                locations = getLocationsKeys(fromTo)
            }
            for (let i = 0; i < locations.length; i++) {
                const row: any = {}
                const row2: any = {}
                for (let j = 0; j < locations[i].length; j++) {
                    const rowName = columnLabels.value[j].key
                    row[rowName] = ''
                    if (sheetInfos[locations[i][j]]) {
                        row[rowName] = sheetInfos[locations[i][j]].v
                    }
                    if (i === 0) {
                        const _flagKey = row[rowName] ? row[rowName] : 'Column' + j
                        firstRows.push({
                            dataIndex: _flagKey,
                            title: _flagKey,
                            key: _flagKey,
                            checked: true,
                            width: 120,
                        })
                    } else {
                        const rowName2 = firstRows[j].key
                        row2[rowName2] = ''
                        if (sheetInfos[locations[i][j]]) {
                            row2[rowName2] = sheetInfos[locations[i][j]].v
                        }
                    }
                }
                if (JSON.stringify(row) !== '{}') {
                    excelParam.push(row)
                }
                if (JSON.stringify(row2) !== '{}') {
                    excelParamNoFirstRow.push(row2)
                }
            }
            // 生成表格数据
            isShowImportDetail.value = true
            columns.value = firstRows
            data.value = excelParamNoFirstRow
        }
    }

    /**
     * 上传
     */
    const uploadExcel = () => {
        const formData = new FormData()
        let num = 0
        const selectRows: any = []
        // 筛选已勾选的column
        if (columns.value.length) {
            columns.value
                .filter((v) => v.checked)
                .forEach((z) => {
                    selectRows.push(z.key)
                })
        }

        fileList.value.forEach((file) => {
            formData.append('files' + num.toString(), file?.originFileObj)
            formData.append('import_columns', selectRows)
            formData.append('columns', columns.value.map((x) => x.key).join(','))
            formData.append('table_name', '')
            formData.append('update_key_columns', '')
            // todo 额外参数
            num++
        })

        const symbol: string = (props.urlPath as any).indexOf('?') === -1 ? '?' : '&'
        const url_pre: string = import.meta.env.VITE_APP_BASE_URL
        const requestUrl: string =
            url_pre + props.urlPath + symbol + 'csrf_token=' + token.value + '&customer_key=' + Storage.get(SESSION_ID_KEY, undefined)
        uploadExcelLoading.value = true
        axios
            .post(requestUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((res: any) => {
                uploadExcelLoading.value = false
                const { data } = res
                const obj: any = eval(`(${data})`)
                if (obj.code === 0) {
                    if (obj.message) {
                        message.success(t('upload_success') + JSON.stringify(obj.message))
                        submit({})
                    } else {
                        message.success(t('upload_success'))
                    }
                } else {
                    message.error(JSON.stringify(obj.message))
                }
            })
            .catch(() => {
                message.error(t('upload_fail'))
                uploadExcelLoading.value = false
            })
    }

    const getLocationsKeys = (range: string) => {
        const rangeArr = range.split(':')

        const endString: any = rangeArr[1]

        const reg = /[A-Z]{1,}/g

        const end = endString.match(reg)[0]

        const endMath = endString.split(endString.match(reg)[0])[1]

        let total = 0
        for (let index = 0; index < end.length; index++) {
            total += Math.pow(26, end.length - index - 1) * (end.charCodeAt(index) - 64)
        }

        const result: any = []

        for (let j = 1; j <= endMath; j++) {
            const excelKey: any = []

            for (let i = 0; i < total; i++) {
                const colum = getCharByNum(i)
                if (j === 1) {
                    columnLabels.value.push({
                        title: colum,
                        dataIndex: colum,
                        key: colum,
                    })
                }

                excelKey.push(colum + j)
            }
            if (excelKey.length) {
                result[j - 1] = excelKey
            }
        }

        return result
    }

    const getCharByNum = (index: number) => {
        const a: any = index / 26
        let aInt: any = parseInt(a)

        let b: any = index % 26

        let returnChar = String.fromCharCode(b + 65)

        while (aInt > 0) {
            b = aInt % 26
            // 从后生成字符，向前推进
            returnChar = String.fromCharCode(b + 65 - 1) + returnChar
            aInt--
        }
        return returnChar
    }
</script>

<i18n>
{
    "en-us": {
        "upload": "Upload",
        "plzSelectFiles": "Please Select Files",
        "one": "(Only one file can be uploaded at a time)",
        "type_error": "Type Error",
        "downloadTemplate": "Download Template",
        "no_data": "No Data",
        "upload_success": "Upload Success",
        "upload_fail": "Upload Fail"
    },
    "zh-cn": {
        "upload": "上传",
        "plzSelectFiles": "请选择文件",
        "one": "(一次只能上传一个文件)",
        "type_error": "格式错误！请重新上传",
        "downloadTemplate": "下载模板",
        "no_data": "暂无数据",
        "upload_success": "上传成功",
        "upload_fail": "上传失败"
    }
}
</i18n>
