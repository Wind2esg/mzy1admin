<style lang="less">
    
    .saled-order{
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

        .btn-wraper{
            display: inline-block;
            width: 335px;
            vertical-align: top;
        }
    }
</style>

<template>
    <Card class="saled-order">
        <div class="search">
            <Input v-model="keywords" placeholder="输入关键字" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            
            <Select v-model="state" placeholder="请选择售后状态" style="margin-right:10px;margin-bottom:10px;width:150px">
                <Option value="1">待审核</Option>
                <Option value="2">已完成</Option>
                <Option value="3">审核否决</Option>
            </Select>

            <date-apply  placeholder="选择时间" @on-change="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

            <div class="btn-wraper">
                <Button type="primary">搜索</Button>
                <Button type="info">导出</Button>
                <Button type="info" @click="showAddress">管理售后地址</Button>
                <Button type="info" @click="showCause">管理售后原因</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data"></Table>
        </div>

        <Page :total="total" @on-change="pageChange"></Page>

        <address-manage :visible="visibleAddress" @cancel="hideAddress"></address-manage>
        <cause-manage :visible="visibleCause" @cancel="hideCause"></cause-manage>

    </Card>
</template>

<script>

import dateApply from '../components/date';

import addressManage from './components/address-manage';
import causeManage from './components/cause-manage';

const styles = {
            display: 'inline-block',
            color: '#2d8cf0',
            textDecoration: 'underline',
            marginRight:'10px',
            cursor: 'pointer'
        };

export default {
    components: {
        dateApply,
        addressManage,
        causeManage
    },
    data () {
        return {
            visibleAddress: false,
            visibleCause: false,
            keywords: '',
            state: '',
            date: ['', ''],
            total: 100,
            pageSize: 15,
            pageIndex: 1,
            columns: [
                {
                    title: '关联订单号',
                    width: '15%',
                    key: 'name'
                },
                {
                    title: '代理',
                    width: '10%',
                    key: 'age'
                },
                {
                    title: '电话',
                    width: '10%',
                    key: 'age'
                },
                {
                    title: '售后类型',
                    width: '10%',
                    key: 'age'
                },
                {
                    title: '售后内容',
                    width: '20%',
                    key: 'age'
                },
                {
                    title: '申请时间',
                    width: '10%',
                    key: 'age'
                },
                {
                    title: '售后状态',
                    width: '10%',
                    key: 'age'
                },
                {
                    title: '操作',
                    render: (h, params)=>{

                        let arr = [];

                        if (params.row.type == 1){
                            arr.push(h('Button', {
                                props: {
                                    type: 'primary'
                                },
                                on:{
                                    click: ()=>{
                                        this.auditOrder(params.row)
                                    }
                                }
                            }, '审核'))
                        }else {
                            arr.push(h('Button', {
                                props: {
                                    type: 'info'
                                },
                                on:{
                                    click: ()=>{
                                        this.orderDetail(params.row)
                                    }
                                }
                            }, '查看详情'))
                        }

                        return h('div', {
                                    style:{
                                        textAlign:"center"
                                    }
                                }, arr);
                    }
                }
            ],
            data: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03',
                    type: 1
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01',
                    type: 2
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02',
                    type: 3
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04',
                    type: 1
                },
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03',
                    type: 2
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01',
                    type: 3
                }
            ]
        }
    },
    methods: {
        stateChange(value){
            this.state = value;
        },
        dateChange(){

        },
        pageChange(){

        },
        auditOrder(){

        },
        orderDetail(){

        },
        showAddress(){
            this.visibleAddress = true;
        },
        hideAddress(){
            this.visibleAddress = false;
        },
        showCause(){
            this.visibleCause = true;
        },
        hideCause(){
            this.visibleCause = false;
        }
    }
};
</script>
