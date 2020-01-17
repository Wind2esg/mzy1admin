<style lang="less">
.spearate-order .ivu-modal-body{
    background: #f5f5f5;
}
</style>

<template>
    <!-- 1 -->
   <Modal
        v-model="isShow"
        width=300 
        title="审核订单"
        @on-cancel="cancel">
    
        <Form ref="form" :model="form" :rules="rule">
            <FormItem prop="rule" label="发货pda">
                <Select v-model="form.pda" style="width:200px">
                    <Option v-for="item in list" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
        </Form>

        <div slot="footer">
            <Button type="primary" @click="ok">确定</Button>
        </div>

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
        orderList: {
            type: Array,
            default: ()=>{
                return []
            }
        },
        list: {
            type: Array,
            default: ()=>{
                return [
                    {
                        name: 'pda1',
                        id:  '10000001'
                    },{
                        name: 'pda2',
                        id:  '10000002'
                    },{
                        name: 'pda3',
                        id:  '10000003'
                    },{
                        name: 'pda4',
                        id:  '10000004'
                    },{
                        name: 'pda5',
                        id:  '10000005'
                    },{
                        name: 'pda6',
                        id:  '10000006'
                    },{
                        name: 'pda7',
                        id:  '10000007'
                    },{
                        name: 'pda8',
                        id:  '10000008'
                    }
                ]
            }
        }
    },
    data () {
        return {
            //1
            isShow: this.visible,
            form: {
                pda: ''
            },
            rule: {}
        }
    },
    methods: {
        ok(){
            const params = {
                PdaNo:this.form.pda,
                OrderNos: this.orderList
            }

            this.$request(this.$api.OrderCheck, params, data=>{
                if (data.isSuccess){
                    this.$Message.success(data.message, 5);
                    this.cancel();
                }else{
                    this.$Message.error(data.message, 5);
                }
            }, null, ()=>{}, true)

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
