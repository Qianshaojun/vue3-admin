export type LocaleType = keyof typeof localeMap
export const localeMap = {
    zh_CN: 'zh-cn',
    en_US: 'en-us',
} as const

export const localeList = [
    {
        lang: localeMap.en_US,
        label: 'English',
    },
    {
        lang: localeMap.zh_CN,
        label: '简体中文',
    },
] as const
