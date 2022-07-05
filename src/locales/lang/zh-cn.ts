import { genMessage } from '../helper'
import antdLocale from 'ant-design-vue/es/locale/zh_CN'

const modules = import.meta.globEager('./zh-cn/**/*.ts')
export default {
    message: {
        ...genMessage(modules, 'zh-cn'),
        antdLocale,
    },
}
