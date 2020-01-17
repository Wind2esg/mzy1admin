<style lang="less">
.spearate-order .ivu-modal-body{
    background: #f5f5f5;
}
</style>

<template>
   <Modal
        v-model="isShow"
        width=300 
        title="审核订单"
        @on-ok="ok"
        @on-cancel="cancel">
    
        <Form ref="form" :model="form" :rules="rule">
            <FormItem prop="rule" label="发货pda">
                <Select v-model="form.pda" style="width:200px">
                    <Option v-for="item in list" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
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
