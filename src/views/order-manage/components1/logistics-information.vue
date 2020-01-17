<style lang="less">
    .logistics-row{
        padding-bottom: 20px;
        border-bottom: 1px dashed #ddd;
        margin-bottom: 20px;
    }
    .logistics-row .row-left{
        text-align: right;
        padding-right: 20px;
    }
</style>

<template>
   <Modal
        title="物流信息"
        @on-cancel="cancel"
        v-model="isShow">
    
        <Row class="logistics-row" style="margin-top:30px">
            <Col span="6" class="row-left">物流公司</Col>
            <Col span="16">申通</Col>
        </Row>
        <Row class="logistics-row">
            <Col span="6" class="row-left">物流单号</Col>
            <Col span="16">123456789456</Col>
        </Row>
        <Row class="logistics-row" style="border-bottom:none">
            <Col span="6" class="row-left">物流详情</Col>
            <Col span="16">
                <Steps :current="0" direction="vertical">
                    <Step title="已完成" icon="android-plane" content="这里是该步骤的描述信息"></Step>
                    <Step title="已完成" icon="android-plane" content="这里是该步骤的描述信息"></Step>
                    <Step title="进行中" icon="android-plane" content="这里是该步骤的描述信息"></Step>
                    <Step title="待进行" icon="android-plane" content="这里是该步骤的描述信息"></Step>
                </Steps>
            </Col>
        </Row>

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
