<template>
    <a-tooltip :title="getTitle" placement="bottom" :mouse-enter-delay="0.5">
        <span @click="toggle" class="tw-cursor-pointer">
            <fullscreen-outlined style="font-size: 20px" v-if="!isFullscreen" />
            <fullscreen-exit-outlined style="font-size: 20px" v-else />
        </span>
    </a-tooltip>
</template>

<script lang="ts" setup>
    import {computed,unref} from 'vue'
    import {FullscreenOutlined,FullscreenExitOutlined} from '@ant-design/icons-vue'
    import {useFullscreen} from '@vueuse/core'
    import {useI18n} from 'vue-i18n'
    const {t} = useI18n()
    const { toggle, isFullscreen } = useFullscreen()
    const getTitle = computed(()=>{
        return unref(isFullscreen) ? t('out_fullscreen') : t('fullscreen')
    })
</script>

<i18n>
{
 "en-us": {
    "fullscreen": "FullScreen" ,
     "out_fullscreen": "Exist FullScreen"
 },
    "zh-cn": {
        "fullscreen": "全屏" ,
        "out_fullscreen": "退出全屏"
    }
}
</i18n>
