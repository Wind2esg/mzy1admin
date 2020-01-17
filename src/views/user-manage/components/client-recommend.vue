<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}
.highLink_wrap{
  
  .row_box{
    margin-top: 12px;
  }
  .link_btn{
    cursor: pointer;
  }
}

</style>
<template>

    <Modal v-model="isShow" width=900 title='' @on-cancel="Modal_cencel" class="agent_modalwarp">
        
        <div>
            <Input type="text" placeholder="姓名、电话" v-model="keywords" style="width: 200px" />
            <Select v-model="roleId" class="selectType" placeholder="选择等级"  style="width: 160px">
                <Option v-for="(item,index) in roleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
                <Option value="0">用户</Option>
            </Select>
            <Select v-model="level" class="selectType" placeholder="选择推荐层级"  style="width: 160px">
                <Option value="1">一级推荐</Option>
                <Option value="2">二级推荐</Option>
            </Select>
            
            <Button type="primary" @click="getData">搜索</Button>
            <Button type="info" @click="expressData">导出</Button>
            <Button type="primary" @click="editRecommendData">批量修改</Button>
        </div>

        <div style="margin:10px 0">
            <Table :columns="columns" @on-selection-change="selectionChange" :data="list" :loading="loading"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>

        <edit-recommend :visible="recommendVisible" :transfer="false" :memberId="memberId" @cancel="recommendCancel"></edit-recommend>


        <div slot="footer">
            <!-- <Button size="large" @click="Modal_cencel">取消</Button>
            <Button type="primary" :loading="save_loading" size="large" @click="Modal_ok" >确认</Button> -->
        </div>
    </Modal>

</template>
<script>

import dateApply from '@/views/components/date';

//修改推荐人
import editRecommend from './editClientRecommend';

import utils            from '@/libs/util';

export default {
    props: {
        visible: {
          type: Boolean,
          default: false
        },
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    components: {
        dateApply,
        editRecommend
    },
    data() {

        const phoneCheck = (rule, value, callback)=>{
              
            if (value === '') {
                callback(new Error('ID不能为空'));
            } else if(value=='-1'){
                callback();
            }else{
                callback();
            }
        }

        return {
            isShow: this.visible,
            state: '',
            keywords: '',
            date: ['',''],
            stateList:this.$store.state.user.OrderStateList,
            loading: false,
            total: 0,
            pageSize: 8,
            pageIndex: 1,
            list: [],
            roleList: [],
            roleId: '',
            recommandLevel: [],
            level: '',
            recommendVisible: false,
            save_loading: false,
            memberId: [],
            formInfo:{
                ID: '',
            },
            phone:'',
            name:'',
            nickName: '',
            ruleInfo:{
                ID: [
                    { required: true, validator:  phoneCheck, trigger: 'blur'},
                ]
            },
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'memberId'
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '微信昵称',
                    key: 'nickName'
                },
                {
                    title: '电话',
                    key: 'phone'
                },
                {
                    title: '推荐层级',
                    key: 'levelValue'
                },
                {
                    title: '消费金额',
                    key: 'sumOrderPrice'
                }
            ],
        }
    },
    created() {
        
    },
    methods: {
        getData(){
            const params = {
                MemberId: this.data.id,
                RoleId: this.roleId,
                RecommendLevel: this.level,
                KeyWords: this.keywords,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.loading = true;

            this.$request(this.$api.UserRecommendMemberList, params, data=>{
                this.total = data.result.totalCount;
                this.list = data.result.resultList;
                this.loading = false;
            })

        },
        dateChange(value){
            this.date = value;
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        expressData(){
            location.href = this.$api.UserRecommendMemberList + '?' +
                            [
                                'MemberId='+this.data.id,
                                'RoleId='+this.roleId,
                                'RecommendLevel='+this.level,
                                'KeyWords='+this.keywords
                            ].join('&');
        },
        recommendCancel(){
            this.recommendVisible = false;
        },
        editRecommendData(){
            this.recommendVisible = true;
            //this.memberId = [record.id];
        },
        selectionChange(selection){
            
            this.memberId = selection.map(item=>{
                return item.memberId
            })
            console.log(this.memberId);
        },
        Modal_cencel(){
            this.$emit('cancel');
        },
        Modal_ok(){

        },
        query_click(){

        },
        info_model_ok(){

        }
    },
    watch: {
        visible(value) {
            this.isShow = value;

            if (value){
                utils.getRoleList(this,data => {
                  this.roleList  = data
                })

                this.getData();
                
            }else{
                this.date = ['', ''];
                this.keywords = '';
                this.state = '';
            }
        },
    }
};

</script>
