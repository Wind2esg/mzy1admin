<style lang="less">

</style>

<template>
   <div>
       <div class="search" style="margin-bottom:10px;" >
            <Input type="text" v-model="keywords" style="width:160px;" placeholder="姓名、电话"/>
            <Select v-model="roleId" v-if="roleData.length" style="width:160px;" placeholder="选择代理等级">
                <Option v-for="(item,index) in roleData" v-if="item.id>memberRole" :value="item.id" :key="index">{{ item.roleName }}</Option>
            </Select>
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
        memberRole: Number,
        memberId:{
            type: Number,
            default: 0
        }
    },
    created(){
        this.roleData = this.roleList.filter(item=>{
            return item.id > this.memberRole;
        })
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
            roleData: [],
            columns: [
                {
                    title: '充值代理',
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
                    title: '充值金额',
                    key: 'rechargeBalance'
                },
                {
                    title: '充值交易单号',
                    key: 'channelNo'
                },
                {
                    title: '新增差价利润',
                    key: 'awardMoney'
                },
                {
                    title: '充值时间',
                    key: 'checkTime'
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
                RoleId: this.roleId,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.GetMemberProfitAwardList, params, data=>{
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
            const url = this.$api.ExportMemberProfitAwardList + '?' +
                            [
                                'MemberId='+this.memberId,
                                'KeyWords='+this.keywords,
                                'StartTime='+(this.date[0]||''),
                                'EndTime='+(this.date[1]||''),
                                'RoleId='+this.roleId
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
