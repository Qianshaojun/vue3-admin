import { genMessage } from '../helper'
import antdLocale from 'ant-design-vue/es/locale/en_US'

const modules = import.meta.globEager('./en-us/**/*.ts')
export default {
    message: {
        ...genMessage(modules, 'en-us'),
        antdLocale,
    },
    dateLocale: null,
    dateLocaleName: 'en-us',
}
