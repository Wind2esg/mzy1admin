<style lang="less">

</style>

<template>
   <Modal
        width="800px"
        title="订单记录"
        @on-cancel="cancel"
        v-model="isShow">
        
        
        <Table :columns="columns" border :data="data"></Table>
        

        <div slot="footer">
            <Button type="primary" size="large" @click="cancel">确定</Button>
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
            columns: [{
                    title: '操作时间',
                    key: 'name'
                },{
                    title: '操作人',
                    key: 'phone'
                },{
                    title: '操作人电话',
                    key: 'address'
                },{
                    title: '操作类型',
                    key: 'address'
                },{
                    title: '订单状态',
                    key: 'address'
                },{
                    title: '备注',
                    key: 'address'
                }],
            data: [{
                id:1,
                name: '菜大头',
                phone: '15370016430',
                address: '浙江杭州'
            }]
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
