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
                <Option :key="item.id" :value="item.id" v-for="item in roleList">{{item.roleName}}</Option>
            </Select>

            <Select v-model="state" placeholder="请选择状态" style="margin-right:10px;margin-bottom:10px;width:150px">
                <Option :key="item.label" :value="item.value" v-for="item in stateList">{{item.label}}</Option>
            </Select>

            <DatePicker type="daterange" v-model="date" format="yyyy-MM-dd" show-week-numbers placement="bottom-end" placeholder="申请时间" style="width: 200px;vertical-align:top"></DatePicker>

            <div class="btn-wraper" style="width:210px">
                <Button type="primary" @click="getData">搜索</Button>
                <Dropdown style="display:inline-block;vertical-align:top" trigger="click" @on-click="itemChange">
                    <Button type="primary">
                        批量审核
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="pass">审核通过</DropdownItem>
                        <DropdownItem name="fail">审核否决</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="info" @click="exportData">导出</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data" @on-selection-change="tabSelectChange"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>

        <!-- 审核否决和通过的弹框 -->
        <Modal
            v-model="modalBox"
            @on-ok="ok"
            @on-cancel="cancel"
            width="350"
            >
            <p style="font-size:18px;text-align:center;padding-top:15px;">确认此操作？</p>
        </Modal>

    </Card>
</template>

<script>

// const mockData = {
//       result: {
//       totalCount: 20,
//       resultList: [
//         {
//           id: 1,
//           name: "事件1",
//           phone: "12345678945",
//           roleName: "懂事",
//           waitCommission: 100,
//           balance: 200,
//           addTime: "2017-12-12",
//           balanceState: "1",
//           balanceStateValue: "状态",
//           bankName: "招商银行",
//           bankAccount: "654123457841321",
//           remark: "备注"
//         },
//         {
//           id: 2,
//           name: "事件2",
//           phone: "12345678945",
//           roleName: "懂事",
//           waitCommission: 100,
//           balance: 200,
//           addTime: "2017-12-12",
//           balanceState: "1",
//           balanceStateValue: "状态",
//           bankName: "招商银行",
//           bankAccount: "654123457841321",
//           remark: "备注"
//         },
//         {
//           id: 3,
//           name: "事件3",
//           phone: "12345678945",
//           roleName: "懂事",
//           waitCommission: 100,
//           balance: 200,
//           addTime: "2017-12-12",
//           balanceState: "1",
//           balanceStateValue: "状态",
//           bankName: "招商银行",
//           bankAccount: "654123457841321",
//           remark: "备注"
//         },
//         {
//           id: 4,
//           name: "事件4",
//           phone: "12345678945",
//           roleName: "懂事",
//           waitCommission: 100,
//           balance: 200,
//           addTime: "2017-12-12",
//           balanceState: "1",
//           balanceStateValue: "状态",
//           bankName: "招商银行",
//           bankAccount: "654123457841321",
//           remark: "备注"
//         }
//       ]
//     }
// }



import dateApply from '../components/date';

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
    },
    data () {
        return {
            keywords: '',
            state: '',
            level:'',
            date: ['',''],
            roleList: [],
            reason: '',
            selection: [],
            stateList:[
              {label:"待审核",value:'1'},
              {label:"已受理",value:'2'},
              {label:"处理成功",value:'3'},
              {label:"处理失败",value:'4'},
              {label:"审核否决",value:'5'},
              {label:"到账成功",value:'6'}
            ],
            total: 0,
            pageSize: 15,
            pageIndex: 1, 
            modalBox:false, 
            lastPalam:{},          
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name',
                    align: 'center',
                    width:100
                },
                {
                    title: '电话',
                    key: 'phone',
                    align: 'center',
                    width:130
                },
                {
                    title: '代理等级',
                    key: 'roleName',
                    align: 'center',
                    width:140
                },
                {
                    title: '当前金额',
                    key: 'waitCommission',
                    align: 'center',
                    width:100
                },
                {
                    title: '提现金额',
                    key: 'balance',
                    align: 'center',
                    width:100
                },
                {
                    title: '申请时间',
                    key: 'addTime',
                    width:160,
                    align: 'center'
                },
                {
                    title: '状态',
                    key: 'balanceStateValue',
                    align: 'center',
                    width:150
                },
                {
                    title: '到账银行',
                    key: 'bankName',
                    align: 'center',
                    width:160
                },
                {
                    title: '到账银行卡',
                    key: 'bankAccount',
                    width:180,
                    align: 'center',
                },
                {
                    title: '备注',
                    key: 'remark',
                    align: 'center',
                    width:173
                },
                {
                    title: '操作',
                    width: 210,
                    align: 'center',
                    fixed:'right',
                    render: (h, params)=>{

                        let arr = [];

                        if(params.row.balanceState==1){
                        
                        arr.push(h('Button', {
                            props: {
                                type: 'primary'
                            },
                            style:{
                                marginRight: '10px'
                            },
                            on:{
                                click: ()=>{
                                    this.saveCheck([params.row])
                                }
                            }
                        }, '审核通过'))
                    
                        arr.push(h('Button', {
                            props: {
                                type: 'warning'
                            },
                            on:{
                                click: ()=>{
                                    this.showReason([params.row])
                                }
                            }
                        }, '审核否决'))

                    }
                       

                        return h('div', {
                                    style:{
                                        textAlign:"left"
                                    }
                                }, arr);
                    }
                }
            ],
            data: []
        }
    },
    created(){
        if(this.$store.state.user.RoleList.length>0){
            this.roleList = this.$store.state.user.RoleList
        }else{
            this.$request(this.$api.getMemberRoleList, {}, data => {
                this.roleList  = data.result || [] //代理等级
                this.$store.state.user.RoleList = this.roleList
            })
        }

        this.getData();
    },
    methods: {
        getData(){
            const params = {
                KeyWords: this.keywords,
                RoleId: this.level,
                State: this.state,
                StartTime: this.date[0] || '',
                EndTime: this.date[1] || '',
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }


            this.selection = [];

            this.$request(this.$api.WithdrawalsList, params, data=>{
                this.total = data.result.totalCount;
                this.data = data.result.resultList;
            })

        },
        tabSelectChange(selection){
            console.log(selection);
            this.selection = selection;

        },
        itemChange(name){

            if (!this.selection.length){
                this.$Message.error('请选择审核项!');
                return;
            }

            if (name == 'pass'){
                this.saveCheck(this.selection)
            }else{
                this.showReason(this.selection);
            }
        },
        showReason(record){
            this.reason = '';
            this.$Modal.confirm({
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: '',
                            autofocus: true,
                            placeholder: '输入否决原因'
                        },
                        on: {
                            input: (val) => {
                                this.reason = val;
                            }
                        }
                    })
                },
                onOk: () => {
                    // if (this.reason == ''){
                    //     this.$Message.info('请输入否决原因');
                    // }else{
                        this.saveCheck(record, this.reason||'');
                    //}
                }
            });
            this.getData();
        },
        saveCheck(record, reason){
            let params = {
                IsCheckSuccess: reason===undefined ? true:false,
                WithdrawalsIds: record.map(item=>{
                    return item.id;
                })
            }

            if (reason){
                params.FailReason = reason;
            }

            this.lastPalam=params;

            this.modalBox=true;

            

        },

        cancel(){

        },
        ok(){
          
            this.$request(this.$api.MultWithdrawalsCheck, this.lastPalam, data=>{
                if (data.isSuccess){
                    this.$Message.info(data.message, 4);
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            }, null, ()=>{}, true)

        },
        dateChange(){
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

           // console.log(this.state,this.keywords,this.level)
            let url = ['KeyWords='+this.keywords, 
                        'RoleId='+this.level, 
                        'State='+this.state, 
                        'StartTime='+(this.date[0]?this.format(new Date(this.date[0])):''),
                        'EndTime='+(this.date[1]?this.format(new Date(this.date[1])):'')
                        ].join('&');
            console.log(this.$api.WithdrawalsExport + '?' + url)
            location.href = this.$api.WithdrawalsExport + '?' + url;
        }
    }
};
</script>
