import type { App, AppContext } from 'vue'
export const context = {
    appContext: null as null | AppContext,
}

export default {
    install: (app: App) => {
        context.appContext = app._context
    },
}
