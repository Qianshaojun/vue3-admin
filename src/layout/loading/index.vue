<template>
    <div>
        <transition name="loadingBox">
            <div class="loading-top" v-if="loadingState.loading && !loadingState.loadingMask">
                <a-spin tip="Loading..."></a-spin>
            </div>
        </transition>
        <div class="loading-wrap" v-if="loadingState.loadingMask">
            <a-spin tip="Loading..." size="large">
            </a-spin>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {useLoadingStore} from '@/stores/modules/loading'
    import {computed} from 'vue'

    const loadingStore = useLoadingStore()
    const loadingState = computed(()=>{
        return loadingStore.getLoadingState
    })
</script>

<style lang="less" scoped>
.loading-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999 !important;
}
/**
  顶部loading样式
 */
.loadingBox-leave-active,
.loadingBox-enter-active {
    transition: all 0.1s ease;
}

.loadingBox-enter-from {
    transform: translateY(-200%);
}

.loadingBox-enter-to {
    transform: translateY(0);
}

.loadingBox-leave-from {
    transform: translateY(0);
}

.loadingBox-leave-to {
    transform: translateY(-200%);
}

.loading-top {
    position: absolute;
    left: 50%;
    top: 31px;
    background-color: rgba(255, 255, 255, 0.87);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    color: rgb(255, 255, 255);
    padding: 10px 16px;
    pointer-events: all;
    align-items: center;
    z-index: 9999 !important;
}

.loading-top .ant-spin-spinning {
    display: flex !important;
}

:deep( .loading-top .ant-spin.ant-spin-show-text .ant-spin-text ){
    padding-left: 10px !important;
}
</style>
