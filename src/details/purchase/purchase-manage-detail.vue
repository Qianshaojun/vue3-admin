<template>
    <FlexContainer>
        <template #flex-header>采购合同详情</template>
        <template #flex-main>
            获取的id为：{{id}}
        </template>
    </FlexContainer>
</template>

<script lang="ts" setup>
    import {computed} from 'vue'
    import {useRoute} from 'vue-router'
    const route = useRoute()
    const id = computed(()=>route.params.id)
</script>
