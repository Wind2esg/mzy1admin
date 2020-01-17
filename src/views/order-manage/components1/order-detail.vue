<style lang="less">
.spearate-order .ivu-modal-body{
    background: #f5f5f5;
}
</style>

<template>
   <Modal
        class-name="spearate-order"
        width="800px"
        @on-cancel="cancel"
        v-model="isShow">
        
        <Card>
            <p slot="title">收货信息</p>
            <Table :columns="columns1" border :data="data1"></Table>
        </Card>
        <Card style="margin-top:10px;">
            <p slot="title">产品信息</p>
            <Table :columns="columns2" border :data="data2"></Table>
        </Card>
        <Card style="margin-top:10px;">
            <p slot="title">订单信息</p>
            <Table :columns="columns3" border :data="data3"></Table>
        </Card>

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
            columns1: [{
                    title: '收货人',
                    key: 'name'
                },{
                    title: '收货人手机',
                    key: 'phone'
                },{
                    title: '收货地址',
                    key: 'address'
                }],
            data1: [{
                id:1,
                name: '菜大头',
                phone: '15370016430',
                address: '浙江杭州'
            }],
            columns2: [{
                    title: '商品名称',
                    key: 'name'
                },{
                    title: '商品规格',
                    key: 'phone'
                },{
                    title: '商品数量',
                    key: 'address'
                },{
                    title: '商品单价',
                    key: 'address'
                }],
            data2: [{
                id:1,
                name: '菜大头',
                phone: '15370016430',
                address: '浙江杭州'
            }],
            columns3: [{
                    title: '订单编号',
                    key: 'name'
                },{
                    title: '订单金额',
                    key: 'phone'
                },{
                    title: '下单人',
                    key: 'address'
                },{
                    title: '下单人等级',
                    key: 'address'
                },{
                    title: '下单人电话',
                    key: 'address'
                },{
                    title: '下单时间',
                    key: 'address'
                },{
                    title: '订单状态',
                    key: 'address'
                }],
            data3: [{
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
