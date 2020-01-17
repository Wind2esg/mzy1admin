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
            date: ['', ''],
            list: [],
            columns: [
                {
                    title: '代理',
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
                    title: '推荐关系',
                    key: 'recommandLevel'
                },
                {
                    title: '团队出货',
                    key: 'teamShipMent'
                },
                {
                    title: '团队裂变奖励',
                    key: 'teamFissionAward'
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

            this.$request(this.$api.GetTeamFissionAwardList, params, data=>{
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
            const url = this.$api.ExportTeamFissionAwardList + '?' +
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
