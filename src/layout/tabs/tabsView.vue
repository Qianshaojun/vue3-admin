<template>
    <div class="view-content">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.view-content{
    height: calc(100vh - 40px);
}
</style>
