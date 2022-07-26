<template>
    <vxe-grid ref="xGrid" v-bind="gridOptions"></vxe-grid>
</template>

<script lang="ts" setup>
    import { reactive, withDefaults } from 'vue'
    import { VxeGridProps } from 'vxe-table'

    interface IProps {
        tableId: string
        border?: boolean
        stripe?: boolean
        columns: any[]
        data: any[]
    }
    const props = withDefaults(defineProps<IProps>(), {
        border: true,
        stripe: true,
    })

    const gridOptions = reactive<VxeGridProps>({
        id: props.tableId,
        border: props.border,
        stripe: props.stripe,
        data: props.data,
        autoResize: true,
        size: 'small',
        height: 'auto',
        columns: [{ title: 'xxx' }, { title: 'xxx' }],
    })
</script>
