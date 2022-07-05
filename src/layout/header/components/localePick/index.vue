<template>
    <a-dropdown placement="bottomRight" :trigger="['click']">
        <div class="tw-cursor-pointer tw-inline-block ">
            <translation-outlined style="font-size: 20px" />
        </div>
        <template #overlay>
            <a-menu>
                <a-menu-item v-for="(item,index) in localeList" :key="index" @click="changeLang(item.lang)">
                    {{item.label}}
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts" setup>
    import {TranslationOutlined } from '@ant-design/icons-vue'
    import {localeList} from '@/locales/config'
    import {useLocale} from '@/locales/useLocale'
    const changeLang = (val:any)=>{
        const {changeLocale} = useLocale()
        changeLocale(val)
    }
</script>
