<template>
    <setting-outlined class="tw-cursor-pointer" style="font-size: 20px" @click="openSettingArea" />
    <a-drawer
        :title="$t('global.projectSetting')"
        placement="right"
        :visible="visible"
        @close="onClose"
        width="330"
    >
        <a-descriptions :title="$t('global.theme')" :column="4">
            <a-descriptions-item v-for="theme in themeStyle" :key="theme.value">
                <a-tooltip :title="theme.label">
                    <div
                        class="style-checkbox-item"
                        :class="{ active: themeStore.theme === theme.value }"
                        @click="setNavTheme(theme.value)"
                    >
                        <svg-icon :name="theme.value" size="50"></svg-icon>
                    </div>
                </a-tooltip>
            </a-descriptions-item>
        </a-descriptions>
        <a-descriptions :title="$t('global.theme_color')" :column="9">
            <a-descriptions-item v-for="item in themeColors" :key="item.value">
                <div class="style-checkbox-item">
                    <a-tooltip :title="item.title">
                        <a-tag
                            :color="item.value"
                            @click="setThemeColor({ primaryColor: item.value })">
                            <span
                                :style="{ visibility: getThemeColorVisible(item.value) }"> ✔ </span>
                        </a-tag>
                    </a-tooltip>
                </div>
            </a-descriptions-item>
        </a-descriptions>
    </a-drawer>
</template>

<script lang="ts" setup>
    import {SettingOutlined} from '@ant-design/icons-vue'
    import {themeStyle, themeColors} from '@/layout/header/components/projectSetting/constant'
    import {ref} from 'vue'
    import {useThemeStore} from '@/stores/modules/theme'

    type themeName = 'dark' | 'light' | 'realDark'

    const themeStore = useThemeStore()
    const visible = ref<boolean>(false)

    const openSettingArea = () => {
        visible.value = true
    }
    const onClose = () => {
        visible.value = false
    }

    const setNavTheme = (theme: themeName) => {
        themeStore.setTheme(theme)
    }
    const setThemeColor = ({primaryColor}) => {
        themeStore.setThemeColor({primaryColor})
    }

    const getThemeColorVisible = (color) =>
        themeStore.themeColor === color ? 'visible' : 'hidden'
</script>

<style lang="less" scoped>
.style-checkbox-item {
    position: relative;
    cursor: pointer;

    &.active:after {
        content: '✔';
        position: absolute;
        bottom: 10px;
        right: 12px;
        color: darkgreen;
    }
}
</style>
