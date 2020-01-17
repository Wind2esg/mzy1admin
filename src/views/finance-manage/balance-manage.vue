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

            <DatePicker type="date" v-model="date" format="yyyy-MM-dd" placeholder="申请时间（最大时间）" style="width: 200px;vertical-align:top"></DatePicker>

            <div class="btn-wraper">
                <Button type="primary" @click="getData">搜索</Button>
                <Button type="info" @click="exportData">导出</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" border :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>


        <Modal v-model="visible" width="360" @on-cancel="modalCancel">
            <p slot="header">
                {{rechargeType==1?'充值':'扣款'}}
            </p>
            
            <Form ref="form" :model="form" :rules="rule" :label-width="80">
                <FormItem :label="(rechargeType==1?'充值':'扣款')+'库存'" prop="price">
                    <InputNumber :precision=0 v-model="form.price" :min=0 style="width:200px"></InputNumber>
                </FormItem>
                <FormItem :label="(rechargeType==1?'充值':'扣款')+'原因'" prop="reason">
                    <Input type="textarea" v-model="form.reason" style="width:200px"/>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="save">确定</Button>
            </div>
        </Modal>

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
            rechargeType: 1,
            rechargeData: {},
            keywords: '',
            level: '',
            date: '',
            roleList: [],
            total: 100,
            pageSize: 15,
            pageIndex: 1,
            form: {
                price: 0,
                reason: ''
            },
            rule: {
                // price: [
                //     { required: true, message: '请输入金额', trigger: 'blur' }
                // ],
                // reason: [
                //     { required: true, message: '请输入原因', trigger: 'blur' }
                // ]
            },
            modal_loading: false,
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
                    title: '所属上级',
                    key: 'superName'
                },
                {
                    title: '当前余额云仓',
                    key: 'stock'
                },
                {
                    title: '云仓记录',
                    key: 'afterStock'
                },
                {
                    title: '操作',
                    width: 160,
                    render: (h, params)=>{

                        let arr = [];

                        
                        arr.push(h('Button', {
                            props: {
                                type: 'primary'
                            },
                            style:{
                                marginRight: '10px'
                            },
                            on:{
                                click: ()=>{
                                    this.recharge(params.row)
                                }
                            }
                        }, '充值'))
                    
                        arr.push(h('Button', {
                            props: {
                                type: 'warning'
                            },
                            on:{
                                click: ()=>{
                                    this.deduct(params.row)
                                }
                            }
                        }, '扣款'))
                       

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
                ApplyTime: this.date == '' ? '' : this.format(this.date),
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.GetMemberStockList, params, data=>{
                this.total = data.result.totalCount;
                this.data = data.result.resultList;
            })

        },
        recharge(record){
            this.visible = true;
            this.rechargeType = 1;
            this.rechargeData = record;
        },
        deduct(record){
            this.visible = true;
            this.rechargeType = 2;
            this.rechargeData = record;
        },
        save(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.saveData();
                }
            })
        },
        format(date){
            let year = date.getFullYear();
            let month = (date.getMonth()+1) < 10 ? ('0'+(date.getMonth()+1)) : (date.getMonth()+1);
            let day = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
            return [year, month, day].join('-');
        },
        saveData(){
            if (this.form.price <= 0){
                this.$Message.error('请输入库存');
                return
            }else if (this.form.reason == ''){
                this.$Message.error('请填写原因');
                return
            }

            let url = this.$api.PutRechargeStock;

            let params = {
                StockCount: this.form.price,
                MemberId: this.rechargeData.memberId
            }

            if (this.rechargeType == 1){
                params.RechargeReason = this.form.reason;
            }else{
                params.DeductReason = this.form.reason;
                url = this.$api.PutDeductStock;
            }

            this.$request(url, params, data=>{
                if (data.isSuccess){
                    this.$Message.success(data.message);
                    this.modalCancel();
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            })

        },
        modalCancel(){
            this.visible = false;
            this.form.price = 0;
            this.form.reason = '';
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        exportData(){
            let url = this.$api.ExportMemberStockList + '?' + 
                ['KeyWords='+this.keywords, 
                'RoleId='+this.level, 
                'ApplyTime='+(this.date==''?'':this.format(this.date))].join("&");
            location.href = url;
        }
    }
};
</script>
