<template>
    <div>
        <vxe-grid ref="xGrid" v-bind="gridOptions"></vxe-grid>
    </div>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue'
    import { VxeGridProps } from 'vxe-table'

    const gridOptions = reactive<VxeGridProps>({})
</script>
