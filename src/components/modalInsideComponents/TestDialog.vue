<template>
    <div class="inside-dialog-container">
        <div class="inside-dialog-content">
            {{t('test')}},获取信息为：{{info}}
            <a-button type="primary" @click="addDialog">嵌套弹框</a-button>
            <div>222</div>
            <div>222</div>
            <div>222</div>
        </div>
        <div class="inside-dialog-footer">
            <a-button @click="cancel">取消</a-button>
            <a-button @click="onSubmit" type="primary">提交</a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {PropType} from 'vue'
    import {useI18n} from 'vue-i18n'
    import {useModal} from '@/hooks/useModal'
    import test from '@/components/modalInsideComponents/TestDialog.vue'
    interface IInfo{
        text:string
    }
    defineProps({
        info:{
            type:Object as PropType<IInfo>
        }
    })

    const {t} = useI18n()
    const emit = defineEmits(['modalSubmit', 'modalCancel'])
    // emit 事件
    const submit = (info) => {
        emit('modalSubmit', info)
    }
    const cancel = () => {
        emit('modalCancel')
    }
    // 提交
    const onSubmit = () => {
        submit({success: true})
    }

    const addDialog = ()=>{
        useModal(test,{info:{text:'haha'}},{title:t('dialogTitle')}).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }
</script>

<i18n>
{
    "en-us": {
        "test": "I Am Dialog",
        "dialogTitle": "DialogTitle2"
    },
    "zh-cn": {
        "test": "我是弹框",
        "dialogTitle": "弹框标题2"
    }
}
</i18n>
