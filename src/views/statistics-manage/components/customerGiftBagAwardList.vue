<style lang="less">

</style>

<template>
   <div>
       <div class="search" style="margin-bottom:10px;" >
            <Input type="text" v-model="keywords" style="width:160px;" placeholder="姓名、电话"/>
            <date-apply  placeholder="选择时间" @dateChange="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>
            <Button type="primary" @click="getData">搜索</Button>
            <Button type="info" @click="expressData">导出</Button>
        </div>
        <div class="member-tab" style="margin-bottom:10px;min-height:300px">
            <Table :columns="columns" border :data="list" :loading="loading"></Table>
        </div>
        <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
   </div>
</template>

<script>

import dateApply        from '@/views/components/dateApply';

export default {
    components: {
        dateApply
    },
    props: {
        roleList: {
            type: Array,
            default: ()=>{
                return []
            }
        },
        memberId:{
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            loading: false,
            total: 0,
            pageSize: 8,
            pageIndex: 1,
            keywords: '',
            roleId: '',
            date: ['', ''],
            list: [],
            columns: [
                {
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
                    title: '订单金额',
                    key: 'orderPrice'
                },
                {
                    title: '奖励类型',
                    key: 'awardType'
                },
                {
                    title: '我的奖励',
                    key: 'awardMoney'
                },
                {
                    title: '订单状态',
                    key: 'orderStateStr'
                },
                {
                    title: '下单时间',
                    key: 'addTime'
                }
            ],
        }
    },
    methods: {
        getData(){
            this.loading = true;

            const params = {
                MemberId: this.memberId,
                KeyWords: this.keywords,
                StartTime: this.date[0] || '',
                EndTime: this.date[1] || '',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.GetCustomerGiftBagAwardList, params, data=>{
                this.list = data.result.resultList;
                this.total = data.result.totalCount;
                this.loading = false;
            }, null, ()=>{
                this.loading = false;
            })
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        dateChange(value){
          this.date = value;
        },
        expressData(){
            const url = this.$api.ExportCustomerGiftBagAwardList + '?' +
                            [
                                'MemberId='+this.memberId,
                                'KeyWords='+this.keywords,
                                'StartTime='+(this.date[0]||''),
                                'EndTime='+(this.date[1]||'')
                            ].join('&');
            location.href = url;
        }
    },
    mounted(){
        this.getData();
    },
    watch:{
    }
};
</script>
