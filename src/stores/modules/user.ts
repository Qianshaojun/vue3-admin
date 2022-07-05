import { defineStore } from 'pinia'
import { ACCESS_TOKEN_KEY, MENUS_KEY, USER_LOGIN_INFO_KEY, SESSION_ID_KEY } from '@/enums/cacheEnum'
import { Storage } from '@/utils/Storage'

interface IUserState {
    userInfo: any
    userId?: number
    token?: string
    username: string
    customer_code: null
    session_id?: string
    department: any
    menus: any
    buttonAuthInfo: any
    sideMenusList?: any
}

let userInfo: object = {}
try {
    userInfo = JSON.parse(Storage.get(USER_LOGIN_INFO_KEY, '{}'))
} catch {
    userInfo = {}
}

export const useUserStore = defineStore({
    id: 'app-user',
    state: (): IUserState => ({
        userInfo: JSON.parse(Storage.get(USER_LOGIN_INFO_KEY, '{}')),
        userId: undefined,
        token: Storage.get(ACCESS_TOKEN_KEY, null),
        username: '',
        customer_code: null,
        department: undefined,
        menus: Storage.get(MENUS_KEY, undefined),
        buttonAuthInfo: undefined,
        sideMenusList: [],
        ...userInfo,
    }),
    getters: {
        getToken(): string | undefined {
            return this.token
        },
        getMenus(): Array<any> {
            return this.menus
        },
        getSideMenus(): Array<any> {
            return this.sideMenusList
        },
        getUserInfo(): any {
            return this.userInfo
        },
        getButtonAuthInfo(): any {
            return this.buttonAuthInfo
        },
    },
    actions: {
        addUserInfo(data: IUserState) {
            this.userInfo = data.userInfo
            this.userId = data.userId
            this.token = data.token
            this.username = data.username
            this.customer_code = data.customer_code
            this.department = data.department
            this.menus = data.menus
            this.buttonAuthInfo = data.buttonAuthInfo
            Storage.set(ACCESS_TOKEN_KEY, data.token)
            Storage.set(MENUS_KEY, data.menus)
            Storage.set(USER_LOGIN_INFO_KEY, JSON.stringify(this.$state))
        },
        addSideMenus(list) {
            this.sideMenusList = list
            Storage.set(USER_LOGIN_INFO_KEY, JSON.stringify(this.$state))
        },
        // 登出
        logOut() {
            this.resetToken()
        },
        resetToken() {
            this.token = ''
            userInfo = {}
            Storage.clear()
        },
    },
})
