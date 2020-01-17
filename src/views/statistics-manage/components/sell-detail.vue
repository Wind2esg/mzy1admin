<style lang="less">

</style>

<template>
   <Modal
        :width=920 
        v-model="isShow"
        title="出货详情"
        @on-cancel="cancel">
    
        <div class="search-box">
            <Input type="text" v-model="keywords" placeholder="订单编号、收货人、收货人电话" style="width:200px"/>
            <Button type="primary" @click="getData">搜索</Button>
            <Button type="info" @click="exportData">导出</Button>
        </div>

        <div style="margin-top:20px;margin-bottom:20px">
            <Table :columns="columns" border :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>

        <div slot="footer"></div>

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
        memberId: Number,
        productId: Number,
        date:{
            type: Array,
            default: ()=>{
                return ['', '']
            }
        }
    },
    data () {
        return {
            isShow: this.visible,
            columns: [{
                title: '订单编号',
                key: 'orderNo'
            },
            {
                title: '收货人',
                key: 'receiveName'
            },
            {
                title: '收货人电话',
                key: 'receivePhone'
            },
            {
                title: '订单产品',
                key: 'productName'
            },
            {
                title: '产品数量',
                key: 'productCount'
            },
            {
                title: '订单金额',
                key: 'orderPrice'
            },
            {
                title: '订单状态',
                key: 'orderState',
                render: (h, params)=>{
                    return h('div', (this.$store.state.user.OrderStateList.filter(item=>{
                        return item.value == params.row.orderState;
                    })[0]||{}).label || '' )
                }
            },
            {
                title: '下单时间',
                key: 'addTime'
            }],
            data: [],
            keywords: '',
            total: 0,
            pageSize: 10,
            pageIndex: 1,

        }
    },
    methods: {
        getData(){
            const params = {
                MemberId: this.memberId,
                KeyWords: this.keywords,
                ProductId: this.productId,
                StartTime: this.date[0]||'',
                EndTime: this.date[1]||'',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }
            this.$request(this.$api.GetSellOrderDetailList, params, data=>{
                this.data = data.result.resultList;
                this.total = data.result.totalCount;
            })
        },
        ok(){
            this.$emit('cancel')
        },
        cancel(){
            this.$emit('cancel')
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        format(date){

            if (date == '') return '';

            let year = date.getFullYear();
            let month = (date.getMonth()+1) < 10 ? ('0'+(date.getMonth()+1)) : (date.getMonth()+1);
            let day = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
            return [year, month, day].join('-');
        },
        exportData(){
            location.href = this.$api.ExportSellOrderDetailList + '?' +
                            [
                                'MemberId='+this.memberId,
                                'KeyWords='+(this.keywords||''),
                                'ProductId='+(this.productId||''),
                                'StartTime='+this.format(this.date[0]||''),
                                'EndTime='+this.format(this.date[1]||''),
                            ].join('&');
        }
    },
    watch:{
        visible (value){
            this.isShow = value;
            if (this.isShow){
                this.getData();
            }
            
        }
    }
};
</script>
