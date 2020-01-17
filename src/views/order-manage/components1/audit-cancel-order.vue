<style lang="less">
.spearate-order .ivu-modal-body{
    background: #f5f5f5;
}
</style>

<template>
   <Modal
        v-model="isShow"
        title="取消订单审核"
        @on-ok="ok"
        @on-cancel="cancel">
    
        <Form ref="form" :model="form" :rules="rule">
            <FormItem prop="rule" label="取消原因">
                <span class="">1123123</span>
            </FormItem>
            <FormItem prop="rule" label="审核结果">
                <RadioGroup v-model="type">
                    <Radio label="通过申请"></Radio>
                    <Radio label="撤销申请"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem prop="rule" v-if="this.type=='撤销申请'" label="撤销申请原因">
                <Input type="textarea"></Input>
            </FormItem>
        </Form>

    </Modal>
</template>

<script>

export default {
    components: {
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: ()=>{
                return [
                    {
                        name: '订单1',
                        id:  4
                    },{
                        name: '订单2',
                        id:  3
                    },{
                        name: '订单3',
                        id:  2
                    }
                ]
            }
        }
    },
    data () {
        return {
            isShow: this.visible,
            type: '通过申请',
            form: {
                pda: ''
            },
            rule: {}
        }
    },
    methods: {
        ok(){

        },
        cancel(){
            this.$emit('cancel')
        },
    },
    watch:{
        visible (value){
            this.isShow = value;
        }
    }
};
</script>
