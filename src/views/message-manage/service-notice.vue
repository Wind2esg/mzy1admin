<style lang="less">
    @import '../../styles/common.less';

    .btn-wraper{
        display: inline-block;
        width: 290px;
        vertical-align: top;
    }
    .news-apply{
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
    .height-100{
        height:100%;
    }
    .card-no-title .ivu-card-head{
        display: none;
    }
</style>

<template>
    <div class="news-apply">
        
        <Row class="height-100">
            <Col span="18" class="height-100">
                <Card  class="card-no-title height-100">
                    <p slot="title" style="display:none">用户</p>
                    <div class="search">
                        <Input v-model="keywords" placeholder="姓名、电话" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
                        <select-type style="width: 150px;margin-right:10px;margin-bottom:10px;" class="selectType" placeholder="选择授权状态" :typeList="ApplyStateList" @selectChange="ApplyState_Change"></select-type>

                        <Select style="width: 150px;margin-right:10px;margin-bottom:10px;" v-model="RoleVal" class="selectType" placeholder="选择代理等级">
                          <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
                        </Select>
                        <div class="btn-wraper">
                            <Button type="primary" @click="getList">搜索</Button>
                        </div>
                    </div>
                    
                    <div class="table-wraper">
                        <Table :columns="columns" :data="data" @on-selection-change="selectionChange" ></Table>
                    </div>

                    <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>

                </Card>
            </Col>
            <Col span="6">
                <Card style="margin-left: 20px;">
                    <p slot="title">消息发送 </p>
                    <Form ref="form" :model="form" :rules="rule" :label-width="70">
                        <FormItem prop="title" label="消息标题">
                            <Input type="text" v-model="form.title" :maxlength="30" />
                        </FormItem>
                        <FormItem prop="content" label="消息内容">
                            <Input type="textarea" v-model="form.content" :maxlength="500" />
                        </FormItem>
                    </Form>
                    <Button type="primary" style="margin-left: 100px" @click="seedMessage">发送</Button>
                </Card>
            </Col>
        </Row>

        
        
    </div>
</template>

<script>

import auditApply from '../components/audit';
import statusApply from '../components/status';

import selectType       from '@/views/components/selectType';
import utils            from '@/libs/util';


export default {
    name: 'service-notice',
    components: {
        auditApply,
        statusApply,
        selectType
    },
    data () {
        return {
            RoleList: [],
            ApplyStateList: [],
            RoleVal :'',
            ApplyState: '',
            keywords: '',
            ischeckAll:false,
            form: {
                title: '',
                content:'',
            },
            rule: {
                title: [
                    { required: true, message: '请输入消息标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入消息内容', trigger: 'blur' }
                ]
            },
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                  title: 'ID',
                  key: 'memberId',
                  align: 'center',
                  sortable: true,
                  width:100,
                },
                {
                  title: '姓名',
                  key: 'name',
                  align: 'center',
                  width:150,
                },
                {
                  title: '微信昵称',
                  key: 'nickName',
                  align: 'center',
                  width:150,
                },
                {
                  title: '联系电话',
                  key: 'phone',
                  width:110,
                  ellipsis:true,
                  align: 'center',
                  width:150,
                },
                {
                  title: '等级',
                  key: 'roleName',
                  align: 'center',
                  width:150,
                },
                {
                  title: '上级',
                  key: 'superName',
                  align: 'center',
                  width:150,
                },
                {
                  title: '上级电话',
                  key: 'superPhone',
                  align: 'center',
                  width:110,
                  ellipsis:true
                },
                {
                  title: '推荐人',
                  key: 'recommandName',
                  align: 'center',
                  width:150,
                },
                {
                  title: '推荐人电话',
                  key: 'recommandPhone',
                  align: 'center',
                  width:110,
                  ellipsis:true
                },
                {
                  title: '授权状态',
                  key: 'applyStateStr',
                  align: 'center',
                  width:150,
                },
              ],
            data: [],
            memberId: []
        }
    },
    computed: {
    },
    created(){
        utils.getRoleList(this,data => {
          this.RoleList  = data;
         
        })

        this.ApplyStateList = this.$store.state.user.ApplyStateList //代理授权状态
        //console.log(this.$store.state.app.sliderType)
        this.getList();
         console.log(this.ApplyStateList,666)
    },
    methods: {
        getList(){
            let params = {
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                keywords: this.keywords,
                ApplyState: this.ApplyState || '',
                RoleId: this.RoleVal || '',
            };

            this.memberId = [];
            
            this.$request(this.$api.getMemberInfoMangerList, params, data => {
                this.total = data.result.totalCount || 0;
                this.data = data.result.resultList || []
                this.loading = false;
                console.log(this.data,66666)
            })
        },
        seedMessage(){

            if (!this.memberId.length){
                this.$Message.error('请选择代理');
                return;
            }

            this.$refs['form'].validate((valid)=>{
                if (valid){
                    const params = {
                        Title: this.form.title,
                        Content: this.form.content,
                        MemberIds: this.memberId
                    }

                    this.$request(this.$api.CreateSystemMessage, params, data=>{
                        if (data.isSuccess){
                            this.$Message.success('发送成功');
                        }else{
                            this.$Message.error(data.message);
                        }
                    }, null, ()=>{}, true)

                }
            })
        },
        //授权状态
        ApplyState_Change(val){
          //console.log(val);
          this.ApplyState = val
        },
        pageChange(value){
            this.pageIndex = value;
            this.getList();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getList();
        },
        selectionChange(selection){
            this.ischeckAll=! this.ischeckAll;
             //是否全选 
             // let  checks={
             //     IsCheckAll:this.ischeckAll
             // }

             // this.$request(this.$api.MemberIsCheckAll,checks,data=>{
             //      console.log(data)
             // });

            this.memberId = selection.map(item=>{
                return item.memberId
            })

            console.log( this.memberId ,66)
        },
        getUID(){
            return new Date().getTime()
        }
    }
};
</script>
