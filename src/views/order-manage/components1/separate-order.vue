<style lang="less">
.spearate-order .ivu-modal-body{
    background: #f5f5f5;
}
</style>

<template>
   <Modal
        class-name="spearate-order"
        v-model="isShow"
        title="拆单"
        @on-ok="ok"
        @on-cancel="cancel">
        
        <order-item v-for="item in list" :data="item" style="margin-bottom:10px;"></order-item>
        
    </Modal>
</template>

<script>

import orderItem from './separate-order-item';

export default {
    components: {
        orderItem
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
                        count:  4
                    },{
                        name: '订单2',
                        count:  3
                    },{
                        name: '订单3',
                        count:  2
                    }
                ]
            }
        }
    },
    data () {
        return {
            isShow: this.visible,
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
