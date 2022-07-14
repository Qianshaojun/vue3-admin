<template>
    <div class="main-menu">
        <ul style="width: 100%;margin-top: 10px">
            <li
                v-for="(item, index) in firstLevelMenu"
                :key="index"
                @click="selectMenu(item, index)"
                :class="
                    activeMenuIndex === index && theme === 'light'
                        ? 'light_active'
                        : activeMenuIndex === index && (theme === 'dark' || theme === 'realDark')
                            ? 'black_active'
                            : ''
                "
                style="cursor: pointer;display: flex;flex-direction: column;align-items: center;justify-content: center"
            >
                <template v-if="item.model_icon">
                    <span :class="['anticon', item.model_icon]" style="font-size: 20px;padding-bottom: 10px"></span>
                </template>
                {{ getLocale === 'zh-cn' ? item.name_chn : item.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
    import { useUserStore } from '@/stores/modules/user'
    import { ref } from 'vue'
    import { useLocale } from '@/locales/useLocale'
    interface IEmitInfo {
        isOpenSideMenu: boolean
    }
    defineProps({
        theme: {
            required: true,
            type: String,
        },
    })
    const emit = defineEmits(['sendMenuInfo'])
    const handleClickEmit = (info: IEmitInfo) => {
        emit('sendMenuInfo', info)
    }
    const userStore = useUserStore()
    const { getLocale } = useLocale()
    const firstLevelMenu = ref<Array<any>>([])
    userStore.menus.forEach((v) => {
        firstLevelMenu.value.push(v)
    })

    const isOpenSideMenu = ref<boolean>(false)
    const activeMenuIndex = ref<number>(0)
    const selectMenu = (item, index) => {
        activeMenuIndex.value = index
        const itemObj = JSON.parse(JSON.stringify(item))
        itemObj.children && itemObj.children.length && userStore.addSideMenus(itemObj.children)
        isOpenSideMenu.value = true
        handleClickEmit({ isOpenSideMenu: isOpenSideMenu.value })
    }
</script>

<style lang="less" scoped>
    .main-menu {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
        border-top:1px solid #e5e7eb;
        li {
            padding: 15px 0;
            text-align: center;
            cursor: pointer;
            font-weight: 400;
            word-break: break-all;
        }
    }
    .sideMenu {
        position: absolute;
        right: 0px;
    }
    .black_active {
        border-left: 3px solid #0960bd;
        color: white;
    }
    .light_active {
        border-left: 3px solid #0960bd;
        color: #0960bd;
    }
</style>
