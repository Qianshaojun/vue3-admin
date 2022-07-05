// @ts-nocheck
import { h, render } from 'vue'
import CustomModal from '@/components/globalComponents/modal/index.vue'
import { context } from '@/plugins/getAppInstance'

/**
 * 渲染组件实例
 */
const renderInstance = (componentName, resolve, reject, data?, props?: Record<string, any>) => {
    // 创建组件容器
    const container = document.createElement('div') as HTMLElement

    // 销毁组件容器
    const destroyContainer = () => {
        render(null, container)
    }

    // 创建虚拟节点, 渲染组件
    const vnode = h(
        CustomModal,
        {
            ...props,
            onCancel: () => {
                destroyContainer()
            },
        },
        // vue3渲染子组件需改为函数形式，否则会报warning
        () => [
            h(componentName, {
                ...data,
                onModalSubmit: (res) => {
                    resolve(res)
                    destroyContainer()
                },
                onModalCancel: (res) => {
                    reject(res)
                    destroyContainer()
                },
            }),
        ],
    )
    // 必须获取app上下文实例，否则无法渲染a-modal组件
    if (context) vnode.appContext = context.appContext
    render(vnode, container)

    // 添加子元素(组件)至父元素
    container.firstElementChild && document.body.appendChild(container)
}

export function useModal(componentName, data?, options?): Promise<any> {
    return new Promise((resolve, reject) => {
        renderInstance(componentName, resolve, reject, data, options)
    })
}
