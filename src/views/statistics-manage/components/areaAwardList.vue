<style lang="less">

</style>

<template>
   <div>
       <div class="search" style="margin-bottom:10px;" >
            <Input type="text" v-model="keywords" style="width:160px;" placeholder="关键字"/>
            <DatePicker type="month" placeholder="选择时间" v-model="date" style="width: 100px"  @on-change="changeTime"></DatePicker>
            <Button type="primary" @click="search">搜索</Button>
            <Button type="info" @click="expressData">导出</Button>

            <span style="padding-left:10px">个人业绩：{{award.myShipMentMoney||0}}</span>
            <span style="padding-left:10px">区域奖总业绩：{{award.areaShipMentMoney||0}}</span>
            <span style="padding-left:10px">我的占比：{{(award.awardRate*100).toFixed(2)}}%</span>
            <span style="padding-left:10px">奖励池：{{award.areaOrderPrice||0}}</span>
            <span style="padding-left:10px">我的奖励：{{award.awardMoney||0}}</span>
            <div style="padding-top:5px;color:#f84444">当月区域业绩自动统计不做发放，每次月初把次月的区域业绩奖励发放至佣金中</div>
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
            date: '',
            list: [],
            award: {},
            flager:false,
            columns: [
                {
                    title: '下单人',
                    key: 'name'
                },
                {
                    title: '订单编号',
                    key: 'orderNo'
                },
                {
                    title: '订单产品',
                    key: 'products'
                },
                {
                    title: '订单产品数量',
                    key: 'productCount'
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
                    title: '收货人城市',
                    key: 'address',
                    render:(h, params)=>{
                        return h('div', params.row.province+'-'+params.row.city);
                    }
                },
                {
                    title: '订单盒数',
                    key: 'orderStock'
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
                Time:this.date,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.GetAreaAwardList, params, data=>{
                this.list = data.result.resultList;
                this.total = data.result.totalCount;
                this.loading = false;
            }, null, ()=>{
                this.loading = false;
            })
        },
        getAward(){
            const params = {
                MemberId: this.memberId,
                Time:this.date
            }

            this.$request(this.$api.GetAreaAwardStatistics, params, data=>{
                this.award = data.result;
            })

        },
        search(){
            if(!this.flager){
                this.date=this.date?this.format(this.date):''; 
            }           
            // console.log(this.date,258)
            this.getData();
            this.getAward();
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        dateChange(value){
          this.date = value;
        },
        format(date){

            if (date === '') return '';
            this.flager=true;
            let year = date.getFullYear();
            let month = (date.getMonth()+1) < 10 ? ('0'+(date.getMonth()+1)) : (date.getMonth()+1);
            let day = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
            return [year, month, day].join('-');
        },
        // 日期的改变
        changeTime(){
            this.flager=false;
        },
        expressData(){
            const url = this.$api.ExportAreaAwardList + '?' +
                            [
                                'MemberId='+this.memberId,
                                'KeyWords='+this.keywords,
                                'Time='+this.date
                            ].join('&');
            location.href = url;
        }
    },
    mounted(){

        this.date = new Date().getFullYear()+'-'+(new Date().getMonth()<9?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1));


        this.getData();

        this.getAward();
    },
    watch:{
    }
};
</script>
