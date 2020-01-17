<style lang="less">

</style>

<template>
   <div>
       <div class="search" style="margin-bottom:10px;" >
            <Input type="text" v-model="keywords" style="width:160px;" placeholder="姓名、电话"/>
            <DatePicker type="month" placeholder="选择时间" v-model="date" style="width: 160px" @on-change="changeTime"></DatePicker>
            <!-- <DatePicker type="date" placeholder="选择时间" style="width: 200px; vertical-align: top;" v-model="Daters"  @on-change="changeTime"></DatePicker> -->
            <Button type="primary" @click="search">搜索</Button>
            <Button type="info" @click="expressData">导出</Button>
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
            Daters:'',
            columns: [
                {
                    title: '我推荐的代理',
                    width: 120,
                    key: 'name'
                },
                {
                    title: '推荐代理电话',
                    key: 'phone'
                },
                {
                    title: '推荐代理业绩',
                    key: 'myShipMentMoney'
                },
                {
                    title: '推荐代理所在城市总奖励',
                    key: 'areaOrderPrice'
                },
                {
                    title: '推荐代理奖励占比',
                    key: 'awardRateStr',
                    // render: (h, params)=>{
                    //     return h('div', params.row.awardRate+'%');
                    // }
                },
                {
                    title: '我的奖励',
                    key: 'awardMoney'
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
                Time: this.date,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }
         
            this.$request(this.$api.GetAreaRecommandAwardList, params, data=>{
                this.list = data.result.resultList;
                this.total = data.result.totalCount;
                this.loading = false;
            }, null, ()=>{
                this.loading = false;
            })
        },
        search(){
       
            this.getData();
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

            let year = date.getFullYear();
            let month = (date.getMonth()+1) < 10 ? ('0'+(date.getMonth()+1)) : (date.getMonth()+1);
            let day = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
            return [year, month, day].join('-');
        },
        // 日期的改变
        changeTime(){
           // this.date=this.format(this.date);
        },
        expressData(){
            const url = this.$api.ExportAreaRecommandAwardList + '?' +
                            [
                                'MemberId='+this.memberId,
                                'KeyWords='+this.keywords,
                                'Time='+this.format(this.date)
                            ].join('&');
            location.href = url;
        }
    },
    mounted(){

        this.date = new Date().getFullYear()+'-'+(new Date().getMonth()<9?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1));

        this.getData();
    },
    watch:{
    }
};
</script>
