<style lang="less">
    @import '../../styles/common.less';

    .btn-wraper{
        display: inline-block;
        width: 290px;
        vertical-align: top;
    }
    .intention-apply{
        height: 100%;

        .ivu-card-body{
            display: flex;
            flex-direction: column;

            height: 100%;
        }

        .table-wraper{
            margin-top: 20px;
            margin-bottom: 20px;
            flex: 1 1 auto;
            overflow: auto;
        }
    }
</style>

<template>
    <Card class="intention-apply">
        <div class="search">
            <Input v-model="keywords" placeholder="姓名、电话、昵称、id" style="width: 200px;margin-right:10px;margin-bottom:10px;"></Input>
            
            <date-apply placeholder="选择注册时间" @on-change="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

            <div class="btn-wraper">
                <Button type="primary" @click="getData">搜索</Button>
                <Button type="info" @click="expressData">导出</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" :data="data" :loading="loading"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>

        <client-order :visible="visible" :data="editData" @cancel="cancel"></client-order>

        <edit-recommend :visible="recommendVisible" :memberId="memberId" @cancel="recommendCancel"></edit-recommend>

        <client-recommend :visible="clientVisible" :data="clientData" @cancel="clientCancel"></client-recommend>

    </Card>
</template>

<script>

import dateApply from '../components/date';

//查看订单
import clientOrder from './components/client-order';

//推荐的人
import clientRecommend from './components/client-recommend';

//修改推荐人
import editRecommend from './components/editClientRecommend';

export default {
    name: 'client-apply',
    components: {
        dateApply,
        clientOrder,
        editRecommend,
        clientRecommend
    },
    data () {
        return {
            visible: false,
            recommendVisible: false,
            clientVisible: false,
            editData: {},
            clientData: {},
            keywords: '',
            date: ['', ''],
            total: 100,
            pageSize: 15,
            pageIndex: 1,
            loading: false,
            memberId: [],
            columns: [
                {
                    title: 'ID',
                    key: 'id',
                    width: 80,
                },
                {
                    title: '姓名',
                    key: 'name',
                    width: 140,
                },
                {
                    title: '微信昵称',
                    key: 'nickName',
                    width: 140,
                },
                {
                    title: '电话',
                    key: 'phone',
                    width: 180,
                },
                {
                    title: '推荐人',
                    key: 'userRecommandName',
                    width: 120,
                },
                {
                    title: '推荐人电话',
                    key: 'userRecommandPhone',
                    width: 200,
                },
                {
                    title: '推荐人等级',
                    key: 'roleName',
                    width: 120,
                },
                {
                    title: '是否下载app',
                    key: 'isAppValue',
                    width: 160,
                },
                {
                    title: '消费金额',
                    key: 'sumOrderPrice',
                    width: 140,
                },
                {
                    title: '累计佣金',
                    key: 'sumCommission',
                    width: 140,
                },
                {
                    title: '剩余佣金',
                    key: 'waitCommission',
                    width: 140,
                },
                {
                    title: '注册时间',
                    key: 'addTime',
                    width: 200,
                },
                {
                    title: '操作',
                    width: 300,
                    fixed: 'right',
                    render: (h, params)=>{
                        let array = [];
                        array.push(h('Button', {
                            props: {
                                type: 'primary',
                            },
                            style:{
                                marginRight: '5px'
                            },
                            on: {
                                click: ()=>{
                                    this.showEdit(params.row)
                                }
                            }
                        }, '查看订单'))

                        array.push(h('Button', {
                            props: {
                                type: 'primary',
                            },
                            style:{
                                marginRight: '5px'
                            },
                            on: {
                                click: ()=>{
                                    this.showRecommend(params.row);
                                }
                            }
                        }, '修改推荐人'))

                        array.push(h('Button', {
                            props: {
                                type: 'primary',
                            },
                            on: {
                                click: ()=>{
                                    this.showEditClient(params.row);
                                }
                            }
                        }, '推荐的人'))

                        return h('div', array);

                    }
                }
            ],
            data: []
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){
            const params = {
                KeyWords: this.keywords,
                StartTime: this.date[0]||'',
                EndTime: this.date[1]||'',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
            }

            this.loading = true;

            this.$request(this.$api.UserManagementList, params, data=>{
                this.total = data.result.totalCount;
                this.data = data.result.resultList;
                this.loading = false;
            })

        },
        expressData(){
            location.href = this.$api.UserManagementList + '?' +
                            [
                                'StartTime='+(this.date[0]||''),
                                'EndTime='+(this.date[1]||''),
                                'KeyWords='+this.keywords
                            ].join('&');
        },
        cancel(){
            this.visible = false;
        },
        showEdit(record){
            this.editData = record;
            this.visible = true;
        },
        recommendCancel(){
            this.recommendVisible = false;
        },
        showRecommend(record){
            this.recommendVisible = true;
            this.memberId = [record.id];
        },
        clientCancel(){
            this.clientVisible = false;
        },
        showEditClient(record){
            this.clientVisible = true;
            this.clientData = record;
        },
        dateChange(value){
            this.date = value;
            console.log(value);
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
    }
};
</script>
