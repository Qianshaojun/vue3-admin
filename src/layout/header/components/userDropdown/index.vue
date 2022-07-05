<template>
    <a-dropdown placement="bottomRight">
        <div class="tw-cursor-pointer tw-inline-block">
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
            <span class=" tw-mx-1">{{ userStore.username }}</span>
        </div>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <div @click.prevent="logOut">
                        <poweroff-outlined class="icon-size tw-px-0.5" />{{ $t('global.logOut') }}
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts" setup>
    import {useUserStore} from '@/stores/modules/user'
    import {QuestionCircleOutlined,PoweroffOutlined} from '@ant-design/icons-vue'
    import {Modal,message} from 'ant-design-vue'
    import {createVNode} from 'vue'
    import {useRouter,useRoute} from 'vue-router'
    import {LOGIN_NAME} from '@/router/constant'
    import {useI18n} from 'vue-i18n'

    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const {t} = useI18n()

    const logOut = async() => {
        Modal.confirm({
            title: t('logOutConfirm'),
            icon: createVNode(QuestionCircleOutlined),
            centered: true,
            onOk: async() => {
                userStore.logOut()
                localStorage.clear()
                message.success( t('logOutSuccess'))
                await  router.replace({
                    name: LOGIN_NAME,
                    query: {
                        redirect: route.fullPath,
                    },
                })
            },
        })
    }
</script>
<i18n>
{
    "en-us": {
        "logOutConfirm": "Are you sure to log out?",
        "logOutSuccess": "LogOut Success"
    },
    "zh-cn": {
        "logOutConfirm": "您确定退出登录吗？",
        "logOutSuccess": "退出登录成功"
    }
}
</i18n>
