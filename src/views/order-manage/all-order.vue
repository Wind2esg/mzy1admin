<style lang="less">
    
    .all-order{
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
            width: 250px;
            vertical-align: top;
        }
    }
</style>

<template>
    <Card class="all-order">
        <div class="search">
            <Input v-model="keywords" placeholder="输入关键字" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            <order-state @on-change="stateChange" style="margin-right:10px;margin-bottom:10px;"></order-state>
            <user-level @on-change="levChange" style="margin-right:10px;margin-bottom:10px;"></user-level>
            
            <date-apply  placeholder="选择时间" @on-change="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

            <div class="btn-wraper">
                <Button type="primary">搜索</Button>
                <Button type="info">导出</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data"></Table>
        </div>

        <Page :total="total" @on-change="pageChange"></Page>

        <order-detail :visible="visibleDetail" @cancel="hideDetail"></order-detail>
        <order-history :visible="visibleHistory" @cancel="hideHistory"></order-history>
        <logistics-info :visible="visibleLogistics" @cancel="hideLogistics"></logistics-info>
        <abolish-order :visible="visibleAbolish" @cancel="hideAbolish"></abolish-order>

    </Card>
</template>

<script>

import orderState from '../components/order-state';
import userLevel from '../components/user-level';
import dateApply from '../components/date';

import orderDetail from './components/order-detail';
import orderHistory from './components/order-history';
import logisticsInfo from './components/logistics-information';
import abolishOrder from './components/abolish-order';

const styles = {
            display: 'inline-block',
            color: '#2d8cf0',
            textDecoration: 'underline',
            marginRight:'10px',
            cursor: 'pointer'
        };

export default {
    components: {
        orderState,
        userLevel,
        dateApply,
        orderDetail,
        orderHistory,
        logisticsInfo,
        abolishOrder
    },
    data () {
        return {
            visibleDetail: false,
            visibleHistory: false,
            visibleLogistics: false,
            visibleAbolish: false,
            keywords: '',
            state: '',
            level: '',
            date: ['', ''],
            total: 100,
            pageSize: 15,
            pageIndex: 1,
            columns: [
                {
                    title: '订单编号',
                    width: 200,
                    key: 'name'
                },
                {
                    title: '下单日期',
                    width: 200,
                    key: 'age'
                },
                {
                    title: '下单金额',
                    width: 100,
                    key: 'age'
                },
                {
                    title: '下单产品',
                    width: 200,
                    key: 'age'
                },
                {
                    title: '产品数量',
                    width: 100,
                    key: 'age'
                },
                {
                    title: '订单状态',
                    width: 100,
                    key: 'age'
                },
                {
                    title: '下单代理',
                    width: 100,
                    key: 'age'
                },
                {
                    title: '代理等级',
                    width: 100,
                    key: 'age'
                },
                {
                    title: '代理电话',
                    width: 150,
                    key: 'age'
                },
                {
                    title: '收货人',
                    width: 100,
                    key: 'age'
                },
                {
                    title: '收货人电话',
                    width: 150,
                    key: 'age'
                },
                {
                    title: '备注',
                    width: 200,
                    key: 'age'
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 280,
                    render: (h, params)=>{

                        let arr = [
                            h('span', {
                                style: styles,
                                on:{
                                    click:()=>{
                                        this.showDetail(params.row);
                                    }
                                }
                            }, '交易详情'),
                            h('span', {
                                style: styles,
                                on:{
                                    click:()=>{
                                        this.showHistory(params.row);
                                    }
                                }
                            }, '订单记录')
                        ];



                        //待发货、已审单、已发货 显示订单作废
                        if (params.row.type == 1 || params.row.type == 2 || params.row.type == 5){
                            arr.push(h('span', {
                                        style: styles,
                                        on:{
                                            click:()=>{
                                                this.showAbolish(params.row);
                                            }
                                        }
                                    }, '订单作废'));
                        }

                        //已发货、已完成  显示物流信息
                        if (params.row.type == 5 || params.row.type == 6){
                            arr.push(h('span', {
                                        style: styles,
                                        on:{
                                            click: ()=>{
                                                this.showLogistics(params.row);
                                            }
                                        }
                                    }, '物流信息'));
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
                    type: 4
                },
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03',
                    type: 5
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01',
                    type: 6
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                }
            ]
        }
    },
    methods: {
        editBack(){
            this.visible = false;
        },
        stateChange(value){
            this.state = value;
        },
        levChange(value){
            this.level = value;
        },
        dateChange(){

        },
        pageChange(){

        },
        showDetail(record){
            this.visibleDetail = true;
        },
        hideDetail(){
            this.visibleDetail = false;
        },
        showHistory(record){
            this.visibleHistory = true;
            console.log(record,999)
        },
        hideHistory(){
            this.visibleHistory = false;
        },
        showLogistics(){
            this.visibleLogistics = true;
        },
        hideLogistics(){
            this.visibleLogistics = false;
        },
        showAbolish(){
            this.visibleAbolish = true;
        },
        hideAbolish(){
            this.visibleAbolish = false;
        }
    }
};
</script>
