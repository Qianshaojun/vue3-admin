<template>
    <a-layout class="lay_out">
        <a-layout-sider
            width="100"
            :collapsible="false"
            :trigger="null"
            :theme="getTheme"
            class="side"
            :style="{
                color: getTheme === 'light' ? 'black' : 'white'
            }"
        >
            <Logo></Logo>
            <Menu @sendMenuInfo="getMenuInfo" :theme="getTheme" />
        </a-layout-sider>
        <SideMenu :theme="getTheme" :is-open="isOpenSideMenu" @sendSideMenuInfo="sendSideMenuInfo"></SideMenu>
        <a-layout style="transition: all 0.2s ease;" :class="isFixedMenu ? 'fixed-container' : 'no-fixed-container'">
            <Header :theme="getTheme" />
            <a-layout-content>
                <TabsView />
            </a-layout-content>
        </a-layout>
        <Loading></Loading>
    </a-layout>
</template>
<script setup  lang="ts">
    import {computed,ref} from 'vue'
    import {useThemeStore} from '@/stores/modules/theme'
    import Logo from './logo/index.vue'
    import Header from './header/index.vue'
    import TabsView from './tabs/tabsView.vue'
    import Menu from './menu/index.vue'
    import SideMenu from './menu/sideMenu.vue'
    import Loading from './loading/index.vue'

    const themeStore = useThemeStore()
    const getTheme = computed(()=>(themeStore.theme === 'light' ? 'light' : themeStore.theme === 'dark' ?'dark' : 'realDark'))
    const isOpenSideMenu = ref<boolean>(false) // 是否打开侧边栏
    const isFixedMenu = ref<boolean>(false) // 是否固定侧边栏
    const getMenuInfo = (msg)=>{
        isOpenSideMenu.value = msg.isOpenSideMenu
    }
    const sendSideMenuInfo = (msg)=>{
        isOpenSideMenu.value = msg?.isOpenMenu
        isFixedMenu.value = msg?.isFixedMenu
    }
</script>

<style scoped lang="less">
.lay_out {
    height: 100vh;
    overflow: hidden;
    position: relative;

    .side {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: auto;
    }
}
:deep(.ant-layout-sider-children){
    width:100%
}

.fixed-container{
    width:calc(100% - 340px)!important;
}
.no-fixed-container{
    width:calc(100% - 100px)!important;
}
</style>
