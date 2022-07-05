<template>
    <div class="not-found">
        <a-button type="primary" @click="goHome">返回首页</a-button>
    </div>
</template>

<script lang="ts" setup>
    import {useRouter} from 'vue-router'

    const router = useRouter()
    const goHome =()=>{
        router.push({
            name:'welcome'
        })
    }
</script>

<style scoped>
.not-found{
    width: 100%;
    height: 100%;
    background: url('./src/assets/404.png');
    background-size: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
