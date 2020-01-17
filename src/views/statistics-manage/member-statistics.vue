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
            <Input v-model="keywords" placeholder="输入姓名、电话" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            
            <Select v-model="level" placeholder="请选择代理等级" style="margin-right:10px;margin-bottom:10px;width:150px">
                <Option :key="item.id" v-for="item in roleList" :value="item.id">{{item.roleName}}</Option>
                <Option :key="0" :value="0">用户</Option>
            </Select>
            
            <!-- <DatePicker type="daterange" v-model="date" format="yyyy-MM-dd" show-week-numbers placement="bottom-end" placeholder="申请时间" style="width: 200px;vertical-align:top" @on-change="changeTime"></DatePicker> -->

            <DatePicker type="date" placeholder="申请时间(最小时间)" style="width: 200px; vertical-align: top;" v-model="minDate"  @on-change="changeTime"></DatePicker>

            <DatePicker type="date" placeholder="申请时间(最大时间)" style="width: 200px;vertical-align: top;" v-model="maxDate" class="maxDatas" @on-change="changeTime1"></DatePicker> 


            <div class="btn-wraper">
                <Button type="primary" @click="getData">搜索</Button>
                <Button type="info" @click="exportData">导出</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>

        <member-detail :visible="visible" :data="editData" @cancel="detailCancel"></member-detail>

    </Card>
</template>

<script>

import utils            from '@/libs/util';
import memberDetail     from './components/member-detail';

const styles = {
            display: 'inline-block',
            color: '#2d8cf0',
            textDecoration: 'underline',
            marginRight:'10px',
            cursor: 'pointer'
        };

export default {
    components: {
        memberDetail
    },
    data () {
        return {
            visible: false,
            keywords: '',
            level: '',
            date: ['',''],
            roleList: [],
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            editData: {},
            minDate:'',
            maxDate:'',
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
                    title: '差价利润',
                    key: 'profitAward'
                },
                {
                    title: '团队奖励',
                    key: 'teamAward'
                },
                {
                    title: '团队裂变奖励',
                    key: 'teamFissionAward'
                },
                {
                    title: '区域奖励',
                    key: 'areaAward'
                },
                {
                    title: '区域推荐奖励',
                    key: 'areaRecommandAward'
                },
                {
                    title: '伯乐奖励',
                    key: 'introduceAward'
                },
                {
                    title: '客户分享奖',
                    key: 'customerShareAward'
                },
                {
                    title: '客户礼包奖',
                    key: 'customerGiftBagAward'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 120,
                    render: (h, params)=>{
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary'
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
                StartTime:this.formatDate(this.minDate||''),
                EndTime:this.formatDate(this.maxDate||''),
                // StartTime: this.date[0]||'',
                // EndTime: this.date[1]||'',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

           
            this.$request(this.$api.GetMemberCommissionStatisticsList, params, data=>{
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
            let url = this.$api.ExportMemberCommissionStatisticsList + '?' + 
                ['KeyWords='+this.keywords, 
                'RoleId='+this.level, 
                'StartTime='+(this.minDate?this.formatDate(this.minDate||''):''), 
                'EndTime='+(this.maxDate?this.formatDate(this.maxDate||''):'')]
                // 'StartTime='+(this.date[0]?this.formatDate(new Date(this.date[0])):''), 
                // 'EndTime='+(this.date[1]?this.formatDate(new Date(this.date[1])):'')]
                .join("&");
            location.href = url;
        },
        showDetail(record){
            this.visible = true;
            this.editData = record;
        },
        detailCancel(){
            this.visible = false;
        },

        formatDate(date){
           if (!date) return '';

           const year = date.getFullYear();
           const month =  date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1): date.getMonth()+1;
           const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

           return [year, month, day].join('-')
         },

        // 日期的改变
        changeTime(){
           this.minTime=this.formatDate(this.minDate||''); 

        },
        changeTime1(){
           this.maxTime=this.formatDate(this.maxDate||'');
        }
    }
};
</script>
