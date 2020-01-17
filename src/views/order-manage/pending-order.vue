<style lang="less">
    .btn-wraper{
        display: inline-block;
        width: 250px;
        vertical-align: top;
    }
    .pending-order{
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
    <Card class="pending-order">
        <div class="search">
            <Input v-model="keywords" placeholder="输入关键字" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            <order-state @on-change="stateChange" style="margin-right:10px;margin-bottom:10px;"></order-state>
            <user-level @on-change="levChange" style="margin-right:10px;margin-bottom:10px;"></user-level>
            <order-type @on-change="typeChange" style="margin-right:10px;margin-bottom:10px;"></order-type>
            
            <date-apply  placeholder="选择时间" @on-change="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

            <div class="btn-wraper">
                <Button type="primary">搜索</Button>
                <Button type="info">导出</Button>
                <Button type="info">批量审批</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data"></Table>
        </div>

        <Page :total="total" @on-change="pageChange"></Page>

        <separate-order :visible="visibleSeparate" @cancel="separateCancel"></separate-order>
        <edit-pda :visible="visiblePda" @cancel="pdaCancel"></edit-pda>
        <audit-cancel :visible="visibleAudit" @cancel="auditCancel"></audit-cancel>

    </Card>
</template>

<script>

import orderState from '../components/order-state';
import userLevel from '../components/user-level';
import orderType from '../components/order-type';
import dateApply from '../components/date';

import separateOrder from './components/separate-order';
import editPda from './components/edit-pda';
import auditCancel from './components/audit-cancel-order';

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
        orderType,
        dateApply,
        separateOrder,
        editPda,
        auditCancel
    },
    data () {
        return {
            visibleSeparate: false,
            visiblePda: false,
            visibleAudit: false,
            keywords: '',
            state: '',
            level: '',
            type: '',
            date: ['', ''],
            total: 100,
            pageSize: 15,
            pageIndex: 1,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
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
                    title: '订单类型',
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
                    width: 270,
                    render: (h, params)=>{

                        let arr = [];

                        if (params.row.type == 1){
                            arr = [
                                h('span', {
                                    style: styles,
                                    on:{
                                        click: ()=>{
                                            this.handleSeparate(params.row);
                                        }
                                    }
                                }, '拆单'),
                                h('span', {
                                    style: styles
                                }, '修改收货信息'),
                                h('span', {
                                    style: styles,
                                    on: {
                                        click: ()=>{
                                            this.handlePda(params.row);
                                        }
                                    }
                                }, '审单')
                            ];
                        }else if (params.row.type == 3){
                            arr = [
                                h('span', {
                                    style: styles,
                                    on:{
                                        click: ()=>{
                                            this.handleAudit(params.row);
                                        }
                                    }
                                }, '审核取消')
                            ];
                        }

                        arr.push([
                            h('span', {
                                style: styles
                            }, '查看交易详情')
                        ])

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
                    date: '2016-10-04'
                },
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
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
        typeChange(value){
            this.type = value;
        },
        dateChange(){

        },
        pageChange(){

        },
        handleSeparate(record){
            this.visibleSeparate = true;
        },
        separateCancel(){
            this.visibleSeparate = false;
        },
        handlePda(){
            this.visiblePda = true;
        },
        pdaCancel(){
            this.visiblePda = false;
        },
        handleAudit(){
            this.visibleAudit = true;
        },
        auditCancel(){
            this.visibleAudit = false;
        }
    }
};
</script>
