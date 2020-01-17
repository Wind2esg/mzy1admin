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
            width: 130px;
            vertical-align: top;
        }
    }

    .number-money{
        font-size:18px;
        margin-top:5px;
        color:#333;
        .right-numbers{
            margin-left:25px;
        }
    }
</style>

<template>
    <Card class="saled-order">
        <div class="search">
            <Input v-model="keywords" placeholder="输入姓名、电话" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            
            <Select v-model="level" placeholder="请选择代理等级" style="margin-right:10px;margin-bottom:10px;width:150px">
                <Option :key="item.id" v-for="item in roleList" :value="item.id">{{item.roleName}}</Option>
                <Option :value="0">用户</Option>
            </Select>

            <Select v-model="productId" placeholder="请选择产品" style="margin-right:10px;margin-bottom:10px;width:150px">
                <Option :key="item.id" v-for="item in productList" :value="item.id">{{item.productName}}</Option>
            </Select>
            
            <DatePicker type="daterange" v-model="date" format="yyyy-MM-dd" show-week-numbers placement="bottom-end" placeholder="下单时间" style="width: 200px;vertical-align:top"></DatePicker>

            <div class="btn-wraper">
                <Button type="primary" @click="getData">搜索</Button>
                <Button type="info" @click="exportData">导出</Button>
            </div>

        </div>


        <div class="number-money">
            <span>累计出货数量:{{results.totalOrderCount}}</span>
            <span class="right-numbers">累计出货金额:{{results.totalSellMoney}}</span>

        </div>



        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data" @on-sort-change='sortOrder' ></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>

        <sell-detail :visible="visible" :productId="productId" :date="date" :memberId="memberId" @cancel="detailHide"></sell-detail>

    </Card>
</template>

<script>

import utils            from '@/libs/util';

import sellDetail from './components/sell-detail';

const styles = {
            display: 'inline-block',
            color: '#2d8cf0',
            textDecoration: 'underline',
            marginRight:'10px',
            cursor: 'pointer'
        };

export default {
    components: {
        sellDetail
    },
    data () {
        return {
            visible: false,
            keywords: '',
            level: '',
            productId: null,
            productName: '',
            date: ['',''],
            roleList: [],
            productList: [],
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            memberId: 0,
            storeNum:1000,
            storeMoney:1000,
            results:[],
            OrderByParam:'',
            IsAsc:'',
            columns: [
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '电话',
                    key: 'phone'
                },
                {
                    title: '代理等级',
                    key: 'roleName'
                },
                {
                    title: '出货产品',
                    key: 'productName'
                },
                {
                    title: '产品数量',
                    key: 'productCount',
                    sortable: true,
                },
                {
                    title: '出货金额',
                    key: 'sellMoney',
                    sortable: true,

                },
                {
                    title: '操作',
                    key: '',
                    render: (h, params)=>{
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                },
                                on: {
                                    click: ()=>{
                                        this.showDetail(params.row);
                                    }
                                }
                            }, '查看详情')
                        ])
                    }
                }
            ],
            data: []
        }
    },

    beforeMount(){
       
    },
    created(){

        utils.getRoleList(this,data => {
          this.roleList  = data
        })

        this.$request(this.$api.getProductIdAndNameList, {}, data=>{
            this.productList = data;
        })

        this.getData();
    },
    methods: {
        getData(){
            const params = {
                KeyWords: this.keywords,
                RoleId: this.level,
                ProductId: this.productId,
                ProductName: ((this.productList.filter(item=>{
                    return item.id == this.productId
                })[0] || {}).productName || ''),
                StartTime: this.date[0]||'',
                EndTime: this.date[1]||'',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                OrderByParam: this.OrderByParam,
                IsAsc: this.IsAsc
            }

            this.$request(this.$api.GetOrderSellStatisticsList, params, data=>{
                this.results=data.result;
                this.total = data.result.totalCount;
                this.data = data.result.resultList;

                 console.log(123,this.results)
            });
        

        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        showDetail(record){
            this.visible = true;
            this.memberId = record.memberId;
        },
        detailHide(){
            this.visible = false;
        },
        format(date){
            let year = date.getFullYear();
            let month = (date.getMonth()+1) < 10 ? ('0'+(date.getMonth()+1)) : (date.getMonth()+1);
            let day = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
            return [year, month, day].join('-');
        },
        exportData(){
            let url = this.$api.ExportOrderSellStatisticsList + '?' + 
                ['KeyWords='+this.keywords, 
                'RoleId='+this.level, 
                'StartTime='+(this.date[0]?this.format(new Date(this.date[0])):''), 
                'EndTime='+(this.date[1]?this.format(new Date(this.date[1])):'')]
                .join("&");
            location.href = url;
        },

        sortOrder(event){
            
             this.OrderByParam=event.column.key;
              if(event.order=="asc"){
                this.IsAsc=1;
              }else{
                this.IsAsc=0;
              };

            this.getData();

              


        }


    }
};
</script>
