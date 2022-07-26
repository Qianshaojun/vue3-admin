<template>
    <div class="tw-flex tw-flex-col tw-justify-between container">
        <div class="top-container">
            <slot name="flex-header"></slot>
        </div>
        <div class="bottom-container">
            <slot name="flex-main"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="less">
    .container {
        height: calc(100vh - 40px);
        .top-container {
            height: auto;
            background-color: white;
            padding: 8px 8px;
        }
        .bottom-container {
            flex: 1;
            overflow: hidden;
            padding: 8px 8px;
            background-color: white;
            margin: 8px 8px;
        }
    }
</style>
