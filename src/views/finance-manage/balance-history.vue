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
</style>

<template>
    <Card class="saled-order">
        <div class="search">
            <Input v-model="keywords" placeholder="输入关键字" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            
            <Select v-model="level" placeholder="请选择代理等级" style="margin-right:10px;margin-bottom:10px;width:150px">
                <Option :key="item.id" v-for="item in roleList" :value="item.id">{{item.roleName}}</Option>
            </Select>

            <Select v-model="type" placeholder="请选择操作类型" style="margin-right:10px;margin-bottom:10px;width:150px">
                <Option  :key="item.id" v-for="item in typeList" :value="item.id">{{item.value}}</Option>
            </Select>
            
            <DatePicker type="daterange" v-model="date" format="yyyy-MM-dd" show-week-numbers placement="bottom-end" placeholder="申请时间" style="width: 200px;vertical-align:top"></DatePicker>

            <div class="btn-wraper">
                <Button type="primary" @click="getData">搜索</Button>
                <Button type="info" @click="exportData">导出</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>

    </Card>
</template>

<script>

import utils            from '@/libs/util';

const styles = {
            display: 'inline-block',
            color: '#2d8cf0',
            textDecoration: 'underline',
            marginRight:'10px',
            cursor: 'pointer'
        };

export default {
    components: {
    },
    data () {
        return {
            visible: false,
            keywords: '',
            level: '',
            type: '',
            date: ['',''],
            roleList: [],
            typeList: this.$store.state.app.stockType,
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            columns: [
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '操作时等级',
                    key: 'roleName'
                },
                {
                    title: '电话',
                    key: 'phone'
                },
                {
                    title: '操作类型',
                    key: 'recordTypeStr'
                },
                {
                    title: '操作人',
                    key: 'operationName'
                },
                {
                    title: '收入',
                    key: 'inCome'
                },
                {
                    title: '支出',
                    key: 'outCome'
                },
                {
                    title: '结余',
                    key: 'afterStock'
                },
                {
                    title: '申请时间',
                    key: 'addTime'
                },
                {
                    title: '备注',
                    key: 'remark'
                }
            ],
            data: []
        }
    },
    created(){

        utils.getRoleList(this,data => {
          this.roleList  = data
        })

        this.getData();
    },
    methods: {
        getData(){
            const params = {
                KeyWords: this.keywords,
                RoleId: this.level,
                RecordType: this.type,
                StartTime: this.date[0]||'',
                EndTime: this.date[1]||'',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.GetMemberStockRecordList, params, data=>{
                this.total = data.result.totalCount;
                this.data = data.result.resultList;
            })

        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        format(date){
            let year = date.getFullYear();
            let month = (date.getMonth()+1) < 10 ? ('0'+(date.getMonth()+1)) : (date.getMonth()+1);
            let day = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
            return [year, month, day].join('-');
        },
        exportData(){
            let url = this.$api.ExportMemberStockRecordList + '?' + 
                ['KeyWords='+this.keywords, 
                'RoleId='+this.level, 
                'RecordType='+this.type, 
                'StartTime='+(this.date[0]?this.format(new Date(this.date[0])):''), 
                'EndTime='+(this.date[1]?this.format(new Date(this.date[1])):'')].join("&");
            location.href = url;
        }
    }
};
</script>
