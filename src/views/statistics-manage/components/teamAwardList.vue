<style lang="less">

</style>

<template>
   <div>
       <div class="search" style="margin-bottom:10px;" >
            <Input type="text" v-model="keywords" style="width:160px;" placeholder="姓名、电话"/>

            <DatePicker type="month" placeholder="选择时间" v-model="date" style="width: 160px"  @on-change="changeTime"></DatePicker>
            <!-- <DatePicker type="month" placeholder="选择时间" style="width: 200px; vertical-align: top;" v-model="Daters"  @on-change="changeTime"></DatePicker> -->

            <Button type="primary" @click="search">搜索</Button>
            <Button type="info" @click="expressData">导出</Button>

            <span style="padding-left:30px">个人业绩：{{award.memberShipMent||0}}</span>
            <span style="padding: 0 40px">团队业绩：{{award.teamShipMent||0}}</span>
            <span>我的奖励：{{award.awardMoney||0}}</span>
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
                    title: '团队代理',
                    key: 'name'
                },
                {
                    title: '代理电话',
                    key: 'phone'
                },
                {
                    title: '代理等级',
                    key: 'roleName'
                },
                {
                    title: '推荐人',
                    key: 'recommandName'
                },
                {
                    title: '推荐人电话',
                    key: 'recommandPhone'
                },
                {
                    title: '个人业绩',
                    key: 'shipMent'
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
            
            this.$request(this.$api.GetTeamAwardList, params, data=>{
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
                Time: this.date
            }

            this.$request(this.$api.GetMemberTeamAwardShipMent, params, data=>{
                this.award = data.result;
            })

        },
        search(){
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
            const url = this.$api.ExportTeamAwardList + '?' +
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

        this.getAward();
    },
    watch:{
    }
};
</script>
