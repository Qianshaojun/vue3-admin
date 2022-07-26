<template>
    <div
        class="pageHeader"
        :style="{
            color: theme === 'realDark' ? 'white' : 'black',
            backgroundColor: theme === 'realDark' ? 'black' : 'white',
        }"
    >
        <div class="tabs-area">
            <tabs>
                <template #setting-area>
                    <div class="setting-area">
                        <fullscreen></fullscreen>
                        <localePick></localePick>
                        <userDropdown></userDropdown>
                        <setting></setting>
                    </div>
                </template>
            </tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
    import setting from './components/projectSetting/index.vue'
    import userDropdown from './components/userDropdown/index.vue'
    import localePick from './components/localePick/index.vue'
    import fullscreen from './components/fullScreen/index.vue'
    import tabs from '../tabs/index.vue'
    defineProps({
        theme: {
            type: String,
        },
    })
</script>

<style scoped lang="less">
    .pageHeader {
        height: 40px;
        line-height: 40px;
        color: black;
        border-bottom: 1px solid #e5e7eb;
        .setting-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 280px;
            padding: 0 8px;
        }
    }
</style>
