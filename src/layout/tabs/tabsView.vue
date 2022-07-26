<template>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" :key="Component" />
        </keep-alive>
    </router-view>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped></style>
