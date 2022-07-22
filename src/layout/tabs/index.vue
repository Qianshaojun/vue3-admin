<template>
    <div id="drag-tab">
        <a-tabs
            :active-key="activeKey"
            hide-add
            type="editable-card"
            class="tabs"
            size="small"
            @change="changePage"
            @edit="editTabItem"
        >
            <!--            <a-tab-pane key="1" :tab="getLocale === 'zh-cn' ? '工作区' : 'Dashboard'"></a-tab-pane>-->
            <a-tab-pane
                v-for="pageItem in tabsList"
                :key="pageItem.fullPath"
                :closable="pageItem.name !== 'welcome'"
            >
                <template #tab>
                    <div style="display: inline-block">
                        {{
                            translateMenuTitle(pageItem.name)
                                ? translateMenuTitle(pageItem.name)
                                : pageItem.query
                                ? pageItem.query.name
                                : ''
                        }}
                    </div>
                    <!--                    <a-dropdown :trigger="['contextmenu']">-->
                    <!--                      -->
                    <!--                        <template #overlay>-->
                    <!--                            <a-menu>-->
                    <!--                                <a-menu-item key="1">1st menu item</a-menu-item>-->
                    <!--                                <a-menu-item key="2">2nd menu item</a-menu-item>-->
                    <!--                                <a-menu-item key="3">3rd menu item</a-menu-item>-->
                    <!--                            </a-menu>-->
                    <!--                        </template>-->
                    <!--                    </a-dropdown>-->
                </template>
            </a-tab-pane>
            <template #rightExtra>
                <slot name="setting-area"></slot>
            </template>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
    import { computed, watch, onMounted, nextTick } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useTabsStore } from '@/stores/modules/tabs'
    import { translateMenuTitle } from '@/hooks/useTransMenuTitle'
    import { BlackList } from '@/stores/modules/tabs'
    import Sortable from 'sortablejs'

    const route = useRoute()
    const router = useRouter()
    const tabsStore = useTabsStore()

    const tabsList = computed(() => tabsStore.getTabsList)

    const activeKey = computed(() => tabsStore.getCurrentTab?.fullPath)

    // 解构proxy对象
    const getSimpleRoute = (route): any => {
        const { fullPath, hash, meta, name, params, path, query } = route
        return { fullPath, hash, meta, name, params, path, query }
    }

    const routes: any = [
        {
            fullPath: '/dashboard/welcome',
            name: 'welcome',
            params: {},
            path: '/dashboard/welcome',
            query: {},
        },
    ]
    // 初始化标签页
    tabsStore.initTabs(routes)

    watch(
        () => route.fullPath,
        () => {
            if (BlackList.some((v) => v === route.name)) return
            tabsStore.addTabs(getSimpleRoute(route))
        },
        { immediate: true },
    )

    // tabs 编辑（remove）
    const editTabItem = (targetKey, action: string) => {
        if (action === 'remove') {
            tabsStore.closeCurrentTab(tabsList.value.find((item) => item.fullPath === targetKey))
        }
    }
    // 切换页面
    const changePage = (key) => {
        Object.is(route.fullPath, key) || router.push(key)
    }

    // 拖动tab
    onMounted(() => {
        nextTick(() => {
            setDragFunc()
        })
    })

    const setDragFunc = () => {
        const parentTab = document.getElementById('drag-tab') as HTMLElement
        const dragTab: any = (parentTab.querySelector('.ant-tabs-nav-wrap') as HTMLElement)
            .firstChild
        if (dragTab) {
            Sortable.create(dragTab, {
                animation: 500,
                delay: 400,
                delayOnTouchOnly: true,
            })
        }
    }
</script>

<style scoped lang="less">
    :deep(.tabs) {
        .ant-tabs-nav {
            margin: 0;
            user-select: none;
            border-radius: 6px 6px 0 0;
            padding: 5px 0 0 0;
        }

        .ant-tabs-tabpane {
            display: none;
        }

        .ant-tabs-tab-remove {
            display: flex;
            padding: 0;
            margin: 0;

            .anticon-close {
                padding-left: 6px;
            }
        }

        .ant-tabs-tab:not(.ant-tabs-tab-active) {
            .ant-tabs-tab-remove {
                width: 0;
            }

            .anticon-close {
                width: 0;
                visibility: hidden;
                transition: width 0.3s;
            }

            &:hover {
                .anticon-close {
                    width: 16px;
                    visibility: visible;
                    padding-left: 6px;
                }

                .ant-tabs-tab-remove {
                    width: unset;
                }
            }
        }
    }
</style>
