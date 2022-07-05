<template>
    <div class="tw-container tw-mx-auto tw-flex tw-justify-center login-container">
        <div class="tw-flex tw-flex-col tw-mt-72 tw-items-center">
            <div class="login-box">
                <div class="tw-flex tw-mb-10">
                    <img src="@/assets/company_logo.png" style="width: 168px" />
                    <h1 class="tw-text-5xl tw-font-bold tw-ml-2 tw-mb-0">Vue3 Admin</h1>
                </div>
                <a-form
                    :model="formState"
                    name="normal_login"
                    class="login-form"
                    @finish="onFinish"
                >
                    <a-form-item
                        label=""
                        name="login"
                        :rules="[{ required: true, message: t('global.plzInputUserName') }]"
                    >
                        <a-input v-model:value="formState.login" :placeholder="t('global.plzInputUserName')">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item
                        label=""
                        name="password"
                        :rules="[{ required: true, message: t('global.plzInputPassWord') }]"
                    >
                        <a-input-password v-model:value="formState.password" :placeholder="t('global.plzInputPassWord')">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <div class="login-form-wrap tw-float-right">
                        <!--                        <a-form-item name="remember" no-style>-->
                        <!--                            <a-checkbox v-model:checked="formState.remember"-->
                        <!--                            >{{$t('rememberMe')}}-->
                        <!--                            </a-checkbox>-->
                        <!--                        </a-form-item>-->
                    </div>
                    <div>
                        <img
                            :src="getAssetsImages"
                            width="22"
                            style="cursor: pointer"
                            @click="changeLang"
                        />
                    </div>
                    <div class="tw-clear-both"></div>

                    <a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            style="width: 100%"
                            class="tw-mt-6"
                            :loading="loginLoading"
                        >
                            {{loginName}}
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {useRouter,useRoute} from 'vue-router'
    import {computed, reactive, ref} from 'vue'
    import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
    import { useLocaleStore } from '@/stores/modules/locale'
    import {HttpLogin} from '@/api/login'
    import {useI18n} from 'vue-i18n'
    import {useUserStore} from '@/stores/modules/user'
    import { message } from 'ant-design-vue'
    import {useLocale} from '@/locales/useLocale'

    interface FormState {
        login: string
        password: string
    }
    const {t} = useI18n()
    const localeStore:any = useLocaleStore()
    const userStore:any = useUserStore()
    const router:any = useRouter()
    const route = useRoute()
    const formState = reactive<FormState>({
        login: '',
        password: ''
    })
    const loginLoading = ref<boolean>(false)
    const loginLabel = ref<string>('')
    loginLabel.value = 'global.login'
    const loginName = computed(()=>{
        return  t(loginLabel.value)
    })
    const onFinish = (values: any) => {
        loginLabel.value = 'global.inLogin'
        loginLoading.value = true
        HttpLogin<any>(values).then(({ user_login_info: res })=>{
            loginLoading.value = false
            loginLabel.value = 'global.login'
            if (!res){
                message.error(t('global.loginFailed'))
                return
            }
            userStore.addUserInfo({
                userInfo:res,
                token:res.csrf_token,
                username:res.login,
                userId:res.uid,
                customer_code:res.customer_code,
                department:res.department_info,
                menus:res.user_menu_list,
                buttonAuthInfo:res.button_list
            })
            message.success(t('global.loginSuccess'))
            setTimeout(() => router.replace((route.query.redirect as string) ?? '/'))
        }).catch((err)=>{
            console.log(err)
            loginLoading.value = false
            loginLabel.value = 'global.login'
            message.error(err.message)
        })
    }

    // 切换中英文
    const getAssetsImages = localeStore.locale === 'zh-cn' ? ref(new URL('/src/assets/icons/localeCn.png', import.meta.url).href) : ref(new URL('/src/assets/icons/localeUs.png', import.meta.url).href)
    const changeLang = () => {
        let _locale:any= ''
        let localeIconUrl:any= ''
        if (localeStore.locale === 'zh-cn') {
            _locale = 'en-us'
            localeIconUrl = 'icons/localeUs.png'
        } else if (localeStore.locale === 'en-us') {
            _locale = 'zh-cn'
            localeIconUrl = 'icons/localeCn.png'
        }
        // vite 动态获取图片
        getAssetsImages.value = new URL(`/src/assets/${localeIconUrl}`, import.meta.url).href
        const {changeLocale} = useLocale()
        changeLocale(_locale)
    }
</script>





<style scoped>
    .login-container {
        width: 100vw;
        height: 100vh;
        background: url('assets/../assets/login.svg');
        background-size: 100%;
    }

    .login-box {
        width: 500px;
        height: 365px;
        padding: 20px;
        background: rgb(255, 255, 255);
        border-radius: 0.4em;
        box-shadow: 0.3em 0.3em 0.7em #00000015;
        transition: border 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: rgb(250, 250, 250) 0.2em solid;
    }
</style>
