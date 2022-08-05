import { ExtractPropTypes } from 'vue'

export interface ITableColumns {
    dataIndex: string
    key: string
    title: string
    checked: boolean
    width: number
}

export const importExcelProps = {
    templateDownloadUrl: {
        type: String,
    },
    urlPath: {
        type: String,
        required: true,
    },
}

export type importProps = ExtractPropTypes<typeof importExcelProps>
