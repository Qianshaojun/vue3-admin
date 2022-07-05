<template>
    <transition name="slide">
        <div
            v-show="isOpenMenu"
            class="side_menu"
            :style="isFixedMenu ? {
                color: theme === 'light' ? 'black' : 'white',
                backgroundColor: theme === 'light' ? 'white' : 'black'
            } : { color: theme === 'light' ? 'black' : 'white',
                  backgroundColor: theme === 'light' ? 'white' : 'black',
                  position: 'absolute',
                  left: '100px',
                  top: 0
            }"
            @mouseleave="leave"
        >
            <div class="side_menu_header">
                <span class="side_menu_title">OMS</span>
                <svg-icon :name=" isFixedMenu ? 'fixed' : 'noFixed'" size="20" class="tw-cursor-pointer" @click="isFixedContainer"></svg-icon>
            </div>
            <div class="scroll_side_menu">
                <a-menu
                    v-model:openKeys="openKeys"
                    v-model:selectedKeys="selectedKeys"
                    mode="inline"
                    :theme="theme"
                    @click="handleMenuClick"
                >
                    <template v-for="(item,index) in sideMenuList">
                        <a-sub-menu
                            v-if="item.children"
                            :key="index"
                        >
                            <template #title>
                                {{
                                    getLocale === 'zh-cn' ? item.name_chn : item.name
                                }}
                            </template>
                            <a-menu-item
                                :key="sub_item.name"
                                v-for="sub_item of item.children"
                            >
                                <span :title=" getLocale === 'zh-cn' ? sub_item.name_chn : sub_item.name">{{
                                    getLocale === 'zh-cn' ? sub_item.name_chn : sub_item.name
                                }}</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <a-menu-item
                            :key="item.name"
                            v-else
                        >
                            <span :title=" getLocale === 'zh-cn' ? item.name_chn : item.name">{{
                                getLocale === 'zh-cn' ? item.name_chn : item.name
                            }}</span>
                        </a-menu-item>
                    </template>
                </a-menu>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
    import {watch,ref,computed} from 'vue'
    import {useUserStore} from '@/stores/modules/user'
    import {useLocale} from '@/locales/useLocale'
    import {useRouter,useRoute} from 'vue-router'
    import type { MenuProps } from 'ant-design-vue'

    const route = useRoute()
    const router = useRouter()

    const props = defineProps({
        theme:{
            required:true,
            type:String
        },
        isOpen:{
            required:true,
            type:Boolean
        }
    })
    const emit = defineEmits(['sendSideMenuInfo'])
    const handleClickEmit = (info)=>{
        emit('sendSideMenuInfo', info)
    }

    const isOpenMenu = ref<boolean>(false)
    const isFixedMenu = ref<boolean>(false)
    const {getLocale} = useLocale()
    // 菜单信息
    const  selectedKeys =  ref<string[]>([])
    const  openKeys =  ref<number[]>([0])
    // 获取一级子菜单
    const userStore = useUserStore()
    const sideMenuList = computed(()=>{
        return userStore.sideMenusList
    })

    watch(()=> props.isOpen,()=>{
        if (!isFixedMenu.value){
            isOpenMenu.value = props.isOpen
        }
    },{immediate:true})
    watch(sideMenuList,()=>{
        openKeys.value = [0]
    })

    const isFixedContainer = ()=>{
        isFixedMenu.value = !isFixedMenu.value
        handleClickEmit({isOpenMenu:isOpenMenu.value,isFixedMenu:isFixedMenu.value})
    }

    // 鼠标离开事件
    const leave = ()=>{
        if (!isFixedMenu.value) {
            isOpenMenu.value = false
            handleClickEmit({isOpenMenu: false})
        }
    }

    // 默认选中
    if (route && route.name){
        selectedKeys.value = [route.name as string]
    }
    // 切换选中
    watch(route,(val)=>{
        selectedKeys.value = [val.name as string]
    })

    const handleMenuClick: MenuProps['onClick'] = e => {
        if (e.key === 'chat-box') {
            const url = router.resolve({
                name: 'chat-box'
            })
            window.open(url.href, '_blank')
        } else if ((e.key as string).indexOf('list-page') !== -1) {
            const id =(e.key as string).substring(10)
            router.push({
                name: 'list-page',
                path: `/list-page/${id}`,
                params: {
                    id: id,
                    name: id
                }
            })
        } else {
            if (!selectedKeys.value.includes((e.key as string))) {
                router.push({
                    name: (e.key as string)
                })
            }
        }
    }
</script>

<style scoped lang="less">
.side_menu{
    z-index: 1000;
    width: 240px ;
    height: 100vh;
    overflow-y: auto;
    transition: all 0.2s ease;
}
.side_menu_header{
    display: flex;
    justify-content: space-between;
    padding: 0 8px;
    align-items: center;
    height: 40px;
    .side_menu_title{
        font-weight: 400;
        font-size: 18px;
    }
}
.scroll_side_menu{
    border-top:1px solid #e5e7eb;
    height:calc(100vh - 40px)
}

.slide-leave-active,.slide-enter-active {
    transition: all 0.2s ease;
}
.slide-enter-from,.slide-leave-to {
    width:0;
}
</style>
