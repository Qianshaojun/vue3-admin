<template>
    <div class="tw-flex tw-flex-col tw-justify-between" style="height:100%">
        <a-card :bordered="false" style="height:auto">
            <slot name="flex-header"></slot>
        </a-card>
        <div style="flex:1;padding:8px 8px">
            <a-card :bordered="false" style="height: 100%">
                <slot name="flex-main"></slot>
            </a-card>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>
