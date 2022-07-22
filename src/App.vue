<template>
    <div>
        <a-config-provider :locale="getAntdLocale">
            <router-view #="{ Component }">
                <component :is="Component" />
            </router-view>
        </a-config-provider>
    </div>
</template>

<script setup lang="ts">
    import { useLocale } from '@/locales/useLocale'
    import { watchEffect } from 'vue'
    import { useRoute } from 'vue-router'
    import { translateMenuTitle } from '@/hooks/useTransMenuTitle'
    const { getAntdLocale } = useLocale()
    const route = useRoute()

    watchEffect(() => {
        if (route.query?.name) {
            // 翻译网页标题
            (document as any).title = route.query?.name
        } else {
            document.title = translateMenuTitle(route.name as string) || document.title
        }
    })
</script>
