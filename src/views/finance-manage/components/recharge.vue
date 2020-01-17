<style lang="less">

</style>

<template>
   <Modal
        v-model="isShow"
        title="作废订单"
        @on-ok="ok"
        @on-cancel="cancel">
    
        <Form ref="form" :model="form" :rules="rule">
            <FormItem label="作废单号">
                <span style="color:blue">JLB123456789</span>
            </FormItem>
            <FormItem prop="msg" label="作废原因">
                <Input type="textarea" v-model="form.msg"></Input>
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
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data () {
        return {
            isShow: this.visible,
            form: {
                msg: ''
            },
            rule: {}
        }
    },
    methods: {
        ok(){
            this.$emit('cancel')
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
