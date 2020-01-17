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
            <Input v-model="keywords" placeholder="输入关键字" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            <channel-apply @on-change="channelChange" style="margin-right:10px;margin-bottom:10px;"></channel-apply>
            <status-apply @on-change="statusChange" style="margin-right:10px;margin-bottom:10px;"></status-apply>
            <date-apply  placeholder="申请时间" @on-change="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

            <div class="btn-wraper">
                <Button type="primary" @click="getData">搜索</Button>
                <Button type="info" @click="exportData">导出</Button>
                <Button type="success">审核分配</Button>
             <!--    <Button type="error">忽略意向</Button> -->
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>

        <Modal
            v-model="recordVisible"
            title="代理分配轨迹"
            @on-cancel="cancel">
            
            <Timeline style="margin-left:100px">
                <TimelineItem  :key="item.operationTrajectory" v-for="item in timerList">
                    <p class="time">{{item.operationTrajectory}}</p>
                    <!-- <p class="content">Apple I 问世</p> -->
                </TimelineItem>
            </Timeline>

            <div slot="footer">
            </div>
        </Modal>


        <allocation-member @cancel="allocationCancel" @reload="getData" :visible="allocationVisible" :list="allocationList"></allocation-member>

    </Card>
</template>

<script>

import channelApply from '../components/channel';
import statusApply from '../components/status';
import dateApply from '../components/date';

import allocationMember from './components/allocationMember';

// const mockData = {
//   isSuccess: false,
//   message: "",
//   result: {
//     totalCount: 20,
//     resultList: [
//       {
//         memberId: 1,
//         name: "用户1",
//         phone: "123456789",
//         applyFrom: 1,
//         applyFromStr: "商户申请",
//         applyReason: "水电费",
//         applyTime: "2017-12-12",
//         state: "0"
//       },
//       {
//         memberId: 2,
//         name: "用户2",
//         phone: "123456789",
//         applyFrom: 1,
//         applyFromStr: "商户申请",
//         applyReason: "水电费",
//         applyTime: "2017-12-12",
//         state: "0"
//       },
//       {
//         memberId: 3,
//         name: "用户3",
//         phone: "123456789",
//         applyFrom: 1,
//         applyFromStr: "商户申请",
//         applyReason: "水电费",
//         applyTime: "2017-12-12",
//         state: "1"
//       }
//     ]
//   }
// }

export default {
    name: 'intention-apply',
    components: {
        channelApply,
        statusApply,
        dateApply,
        allocationMember
    },
    data () {
        return {
            keywords: '',
            channel: '',
            status: '',
            date: ['', ''],
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            timerList: [],
            recordVisible: false,
            allocationVisible: false,
            allocationList: [],
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '电话',
                    key: 'phone'
                },
                {
                    title: '渠道来源',
                    key: 'applyFromStr'
                },
                {
                    title: '备注',
                    key: 'applyReason'
                },
                {
                    title: '申请时间',
                    key: 'applyTime'
                },
                {
                    title: '状态',
                    key: 'state',
                    render: (h, params)=>{
                        return h('div', params.row.state === '0' ? '待分配' : '已分配')
                    }
                },
                {
                    title: '操作',
                    key: '',
                    render: (h, params)=>{
                        let arr = [];
                        if (params.row.state == 1){
                            arr.push(h('Button', {
                                props: {
                                    type: 'info'
                                },
                                style:{
                                    marginRight: '10px'
                                },
                                on:{
                                    click: ()=>{
                                        this.recordModel(params.row)
                                    }
                                }
                            }, '分配记录'))
                        }else{
                            arr.push(h('Button', {
                                props: {
                                    type: 'primary'
                                },
                                style:{
                                    marginRight: '10px'
                                },
                                on:{
                                    click: ()=>{
                                        this.recordCheck([params.row])
                                    }
                                }
                            }, '审核分配'))
                        }

                        return h('div', arr);
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
                ApplyFrom: this.channel,
                State: this.status,
                StartTime: this.date[0] || '',
                EndTime: this.date[1] || '',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.getMemberDevelopInfoList, params, data=>{
                this.data = data.result.resultList || [];
                this.total = data.result.totalCount || 0;
            })
        },
        channelChange(value){
            this.channel = value;
        },
        statusChange(value){
            this.status = value;
        },
        dateChange(value){
            this.date = value;
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        recordModel(record){
            this.timerList = [];
            this.recordVisible = true;

            const params = {
                MemberId: record.memberId
            }
            

            this.$request(this.$api.getMemberDevelopDistributRecord, params, data=>{
                this.timerList = data.result;
            })

        },
        cancel(){
            this.recordVisible = false;
        },
        recordCheck(record){
            this.allocationList = record;
            this.allocationVisible = true;
        },
        allocationCancel(){
            this.allocationVisible = false;
        },
        exportData(){
            let url = ['KeyWords='+this.keywords, 
                        'ApplyFrom='+this.channel, 
                        'State='+this.status, 
                        'StartTime='+(this.date[0] || ''),
                        'EndTime='+(this.date[1] || '')
                        ].join('&');
            location.href = this.$api.exportMemberDevelopInfoList + '?' + url;
        }
    }
};
</script>
