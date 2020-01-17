<style lang="less">

</style>

<template>
   <div>
       <div class="search" style="margin-bottom:10px;" >
            <Input type="text" v-model="keywords" style="width:160px;" placeholder="姓名、电话"/>
            <Select v-model="roleId" style="width:160px;" placeholder="被介绍人等级">
                <Option v-for="(item,index) in roleList" v-if="item.roleName!=='一级'" :value="item.id" :key="index">{{ item.roleName }}</Option>
            </Select>
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
            list: [],
            columns: [
                {
                    title: '被介绍人',
                    key: 'name'
                },
                {
                    title: '被介绍人电话',
                    key: 'phone'
                },
                {
                    title: '被介绍人等级',
                    key: 'roleName'
                },
                {
                    title: '我的奖励',
                    key: 'awardMoney'
                },
                {
                    title: '被介绍人授权时间',
                    key: 'authTime'
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
                RoleId: this.roleId,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.GetIntroduceAwardList, params, data=>{
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
            const url = this.$api.ExportIntroduceAwardList + '?' +
                            [
                                'MemberId='+this.memberId,
                                'KeyWords='+this.keywords,
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
