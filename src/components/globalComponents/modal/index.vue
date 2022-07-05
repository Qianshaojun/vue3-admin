<template>
    <div ref="modalWrapRef" class="custom-modal" :class="{ fullscreen: fullscreenModel }">
        <a-modal
            v-model:visible="visible" :width="width" :centered="true" :footer="null"
            :mask-closable="false" :get-container="() => modalWrapRef">
            <template #title>
                <div ref="modalTitleRef" style="width: 100%; cursor: move">{{title}}</div>
            </template>
            <template #closeIcon>
                <div style="padding-right: 10px">
                    <a-space size="middle" @click.stop>
                        <fullscreen-outlined
                            v-if="!fullscreenModel"
                            @click="fullscreenModel = true" />
                        <fullscreen-exit-outlined v-else @click="restore" />
                        <close-outlined @click="closeModal" />
                    </a-space>
                </div>
            </template>
            <template #modalRender="{ originVNode }" v-if="!fullscreenModel">
                <div :style="transformStyle">
                    <component :is="originVNode" />
                </div>
            </template>
            <slot></slot>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
    import {ref,computed,CSSProperties,watch,watchEffect} from 'vue'
    import {FullscreenOutlined, FullscreenExitOutlined, CloseOutlined} from '@ant-design/icons-vue'
    import {useDraggable} from '@vueuse/core'

    const modalWrapRef = ref<HTMLDivElement>()

    const modalTitleRef = ref<HTMLElement>()

    defineProps({
        title: {
            type: String,
            required: true
        },
        width: {
            type: [Number, String],
            default: 520
        }
    })
    const emit = defineEmits(['cancel'])
    const visible = ref<boolean>(true)
    const closeModal = () => {
        visible.value = false
        emit('cancel')
    }

    const fullscreenModel = ref<boolean>(false)

    const restore = () => {
        fullscreenModel.value = false
    }
    // 拖拽
    const { x, y, isDragging } = useDraggable(modalTitleRef)

    const startX = ref<number>(0)
    const startY = ref<number>(0)
    const startedDrag = ref(false)
    const transformX = ref(0)
    const transformY = ref(0)
    const preTransformX = ref(0)
    const preTransformY = ref(0)
    const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 })

    watch([x, y], () => {
        if (!startedDrag.value) {
            startX.value = x.value
            startY.value = y.value
            const bodyRect = document.body.getBoundingClientRect()
            const titleRect:any =  modalTitleRef.value && modalTitleRef.value.getBoundingClientRect()
            dragRect.value.right = bodyRect.width - titleRect.width
            dragRect.value.bottom = bodyRect.height - titleRect.height
            preTransformX.value = transformX.value
            preTransformY.value = transformY.value
        }
        startedDrag.value = true
    })
    watch(isDragging, () => {
        if (!isDragging) {
            startedDrag.value = false
        }
    })

    watchEffect(() => {
        if (startedDrag.value) {
            transformX.value =
                preTransformX.value +
                Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
                startX.value
            transformY.value =
                preTransformY.value +
                Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
                startY.value
        }
    })

    const transformStyle = computed<CSSProperties>(() => {
        return {
            transform: `translate(${transformX.value}px, ${transformY.value}px)`,
        }
    })
</script>

<style lang="less">
.custom-modal {
    &.fullscreen {
        .ant-modal {
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100vw !important;
        }

        .ant-modal-content {
            width: 100% !important;
            height: 100% !important;
        }
    }
    .ant-modal {
        .ant-modal-content {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            min-height: 200px;
            min-width: 200px;
            overflow: hidden;
            .ant-modal-body {
                flex: auto;
                overflow: auto;
                height: 100%;
            }
        }
    }
}
</style>

