<style lang="less">
.btn-wraper {
  display: inline-block;
  width: 290px;
  vertical-align: top;
}

.intention-apply {
  height: 100%;
  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .table-wraper {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.ivu-table .demo-table-info-row td {
  background-color: #fafbfc;
}
.agent_information{
  .selectType{
    width:140px;
    vertical-align:top;
    margin-right: 12px;
  }
}
.manage_box{
  height: 100%;
  display: flex;
  flex-direction: column;

  .search{
    flex: 0 0 auto;
  }
  .table-wraper{
    flex: 1 1 auto;
    height: 100%;
    overflow: auto;
  }
  .page-wraper{
    flex: 0 0 auto;
  }
}

.information-delect{
  font-size:16px;
  text-align:center;
}
</style>
<template>
  <Card class="agent_information intention-apply">
    <div class="manage_box">
      <div class="search">
        <Input v-model="keywords" placeholder="姓名、电话" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
        <select-type class="selectType" placeholder="选择授权状态" :typeList="ApplyStateList" @selectChange="ApplyState_Change"></select-type>
        <Select v-model="RoleVal" clearable class="selectType" placeholder="选择代理等级">
          <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
        </Select>

      
        <Select v-model="leaders" class="selectType" placeholder="是否团队长">
          <Option v-for="(item,index) in teamLeader" :value="item.id" :key="index">{{ item.value}}</Option>
        </Select>


        <date-apply  placeholder="申请时间" @dateChange="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="search_click">搜索</Button>
          <Button type="success" @click="exportDocument_click" icon="document-text">导出</Button>
          <!-- <Button type="success" @click="highLink_visible=true" v-if="RoleVal<2">最高级授权链接</Button> -->

          <Upload
              :show-upload-list="false"
              :on-success="handleSuccess"
              :action="$api.CreateMember"
              style="display: inline-block;">
              <Button type="info" icon="document-text">导入代理</Button>
          </Upload>
          
        </div>
      </div>
      <div class="table-wraper">
        <Table :loading="loading" :columns="columns" :data="apidata" size="small"></Table>
      </div>
      <div class="page-wraper">
        <Page :total="total" @on-change="pageChange" :page-size="pageSize" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" :current="pageIndex" ></Page>
      </div>
    </div>

    <edit-material :visible="editVisible" :MemberId="MemberId" :isTeamLeader="isTeamLeader" @edit-cancel="edit_cancel" @edit-ok="edit_ok"></edit-material>

    <!-- 我的下级 -->
    <lower-grade :visible="lowerGrade_visible" :lmlRoleId="lmlRoleId" :memberId="lmlId" :title="model_tit"  @modal-cancel="lowerGrade_visible=false"></lower-grade>

    <!-- 我的推荐人 -->
    <recommand-list :visible="recommandList_visible"  :lmlRoleId="lmlRoleId" :memberId="lmlId" :title="model_tit"  @modal-cancel="recommandList_visible=false"></recommand-list>
    
    <!-- 修改推荐人 -->
    <edit-recommend :visible="editRecommend_visible" :memberId="lmlId" :title="model_tit" @modal-cancel="editRecommend_visible=false" @modal-ok='editRecommend_ok'></edit-recommend>

    <!-- 修改上级 -->
    <edit-super :visible="editSuper_visible" :memberId="lmlId" :title="model_tit" @modal-cancel="editSuper_visible=false" @modal-ok='editSuper_ok'></edit-super>
    
    <!-- 最高级链接 -->
    <high-link :visible="highLink_visible" @modal-cancel="highLink_visible=false"></high-link>

    <!-- 设置团队长 -->
    <set-official :visible="setOfficial_visible" :title="model_tit" :isTeamLeader="isTeamLeader" :memberId="lmlId" @modal-cancel="setOfficial_visible=false"></set-official>

    <!-- 修改代理资料 -->

    <editeAngecy :visible="editeAngecy_visivle"  :title="model_tit"  :memberId="lmlId" :angeyData="angeyData"  @modal-cancel="editeAngecy_visivle=false" @saveButton='saveButton'></editeAngecy>

    
    <!-- 设置保护区域 -->
    <!-- <protect-area :visible="protectArea_visible" :title="model_tit" :memberId="lmlId" @modal-cancel="protectArea_visible=false" @modal-ok='protectArea_ok'></protect-area> -->
  
    <bank-list :visible="protectArea_visible" :memberId="lmlId" @modal-cancel="protectArea_visible=false" @modal-ok='protectArea_ok'></bank-list>

    <Modal v-model="modal1"
            :title="productTitle">

            <span class="title-box">电话:</span><Input v-model="valuePhone"  clearable style="width: 200px;margin-left:5px;"></Input>

            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary"  @click="saveBtn">保存</Button>
            </div>

  </Modal>

  <!-- 删除非代理 -->
    <Modal
            v-model="delectAnge"
            :title='titleUser' width='400'>
            <div class="information-delect">删除操作不可恢复，你确认要删除吗</div>



            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary" @click="saveselect" >保存</Button>
            </div>

    </Modal>

    <!-- 取消授权的弹框 -->
    <Modal
            v-model="canselShou"
            :title='titlCansel' width='400'>
            <div class="information-delect">取消操作不可恢复，你确认要取消吗</div>



            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary" @click="saveCansel" >保存</Button>
            </div>

    </Modal>

    <!-- 修改代理等级的弹框 -->

     <Modal
        v-model="eiditRank"
        :title="eiditRanktitle" width="400">

        <div class="rankName" style="font-size:15px;">
          <span>代理姓名:{{angecyNames}}</span>
          <span style="margin-left:80px">当前等级:{{angecyRanks}}</span>
        </div>

        <div class="rankBigbox" style="font-size:15px;margin-top:10px;">
          <div style="float:left;height:30px;line-height:30px;">修改代理等级为</div>
          <Select v-model="editers" class="selectType" placeholder="选择代理等级" style="width:230px;margin-left:20px;">
            <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
          </Select>
        </div>

        <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary" @click="saveiditRank" >保存</Button>
        </div>
    </Modal>

    <!-- 修改代理等级时的再次弹框 -->
     <Modal
        v-model="eidateTips"
        title="提示"
        @on-ok="eidateTipsok"
        @on-cancel="eidateTipscancel">
        <div style="font-size:15px;">您确实将{{angecyNames}} 修改为{{afterRanks}}等级吗?</div>
    </Modal>


  </Card>
</template>
<script>
import selectType       from '@/views/components/selectType';
import dateApply        from '@/views/components/dateApply';
import editMaterial     from './components/editMaterial';     //编辑
import highLink         from './components/highLink';        //最高级链接复制

import lowerGrade       from './components/lower-grade';      //我的下级
import recommandList    from './components/recommand-list';   //我的推荐人
import editRecommend    from './components/editRecommend';    //修改推荐人
import editSuper        from './components/editSuper';        //修改上级
import setOfficial      from './components/setOfficial';      //设置团队长
import protectArea      from './components/protectArea';      //设置保护区域

import bankList         from './components/bankList';      //查看银行卡

import editeAngecy      from './components/edite-angecy.vue'; //修改代理资料




import utils            from '@/libs/util';

let that;
let dropList = [
  {
    'value':1,
    'label':'我的下级'
  },
  {
    'value':2,
    'label':'我推荐的人'
  },
  {
    'value':3,
    'label':'修改上级'
  },
  {
    'value':4,
    'label':'修改推荐人'
  },
  {
    'value':5,
    'label':'设置团队长'
  },
  {
    'value':6,
    'label':'查看银行卡'
  },
  {
    'value':7,
    'label':'修改代理资料'
  },
  {
    'value':8,
    'label':'取消授权'
  },
  {
    'value':9,
    'label':'修改代理等级'
  }
]
export default {
  components: {
    selectType,
    dateApply,
    editMaterial,
    lowerGrade,
    recommandList,
    editRecommend,
    editSuper,
    highLink,
    setOfficial,
    bankList,
    editeAngecy,
  },
  created() {
    that = this;

    utils.getRoleList(that,data => {
      that.RoleList  = data;
    })

    that.ApplyStateList = that.$store.state.user.ApplyStateList //代理授权状态
    
    return that.GetList();
  },
  data() {
    return {
      protectArea_visible:false,
      setOfficial_visible:false,
      highLink_visible:false,
      editRecommend_visible:false,
      editSuper_visible:false,
      recommandList_visible:false,
      lowerGrade_visible:false,
      model_tit:'',
      editVisible:false,
      isTeamLeader: false,
      editeAngecy_visivle:false, 
      eiditRank:false,     
      MemberId:0,
      lmlId:0,
      loading:true,
      ApplyState:'',
      ApplyStateList:[],
      RoleList:[],
      RoleVal :'',
      lmlRoleId:1, //我的下级代理显示需求
      keywords: '',
      StartTime:'',
      EndTime:'',
      total: 0,
      pageSize: 15,
      pageIndex: 1,
      modal1:false,
      productTitle:'修改电话',
      titleUser:'删除用户',
      titlCansel:'取消授权',
      eiditRanktitle:'更换等级',
      angecyRanks:'',
      angecyNames:'',
      canselShou:false,
      valuePhone:'',
      angecyId:'',
      angeyData:{},
      delectAnge:false,
      eidateTips:false,
      angecyList:'',
      canselList:'',
      editersL:'',
      editers:'',
      eiditRanklist:'',
      afterRanks:'',
      leaders:-1,
      teamLeader:[
        {id:1,value:'是'},
        {id:2,value:'否'}
      ],
      columns: [
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
          title: '电话',
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
          title: '团队奖真实充值',
          key: 'realRechargeStock',
          align: 'center',
          width:150,
        },
        {
          title: '余额云仓',
          key: 'stock',
          align: 'center',
          width:120,
        },
        {
          title: '是否团队长',
          key: 'isTeamLeader',
          align: 'center',
          width:110,
          render: (h, params) => {
              return h('div', params.row.isTeamLeader==true ? '是':'否')
          }
        },
        {
          title: '地域',
          key: 'city',
          align: 'center',
          width:300,
          ellipsis:true
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
          title: '状态',
          key: 'applyStateStr',
          align: 'center',
          width:150,
        },
        {
          title: '授权时间',
          key: 'authTime',
          width:200,
          align: 'center'
        },{
          title: '操作',
          key: 'action',
          align: 'center',
          "fixed": "right",
          width:300,
          render(row, column, index) {
            let arr = [];

            arr.push(row('Button', {
              props: {
                type: 'primary'
              },
              style: {
                marginRight: '10px'
              },
              on: {
                click() {
                  that.editphone(column.row)
                }
              }
            }, '修改手机号'))

            arr.push(row('Button', {
              props: {
                type: 'primary'
              },
              style: {
                marginRight: '10px'
              },
              on: {
                click() {
                  that.editApi_click(column.row)
                }
              }
            }, '查看'))

            if(column.row.applyState!==4){
                  arr.push(row('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click() {
                        that.delectUsers(column.row)
                      }
                    }
                  }, '删除用户'))
            }

            let array = [];
            dropList.map((el, ix) => {

              if(ix===2){
                if(column.row.roleGradeNum!==1){  //最高无上级
                  array.push(row('DropdownItem',{
                    props:{
                      name:el.label
                    },
                  },el.label))
                }
              }else if(ix===0){   //最低无下级
                if(column.row.roleGradeNum!==5){  
                  array.push(row('DropdownItem',{
                    props:{
                      name:el.label
                    },
                  },el.label))
                }
              }else if(ix===4||ix===5){
                if(column.row.roleGradeNum===1||column.row.roleGradeNum===2){
                  array.push(row('DropdownItem',{
                    props:{
                      name:el.label
                    },
                  },el.label))
                }
              }
              else{
                array.push(row('DropdownItem',{
                  props:{
                    name:el.label
                  },
                },el.label))
              }
            })

            if(column.row.applyState===4){
              arr.push(row('Dropdown', {
                props:{
                  trigger: 'click',
                  transfer:true
                },
                on:{
                  'on-click'(name) {
                    return that.DropApi_click(name,column.row)
                  }
                }
              }, [
                row('Button', {
                  props:{
                    type: 'info'
                  }
                }, '更多'),
                row('DropdownMenu', {
                  slot: 'list'
                }, array)
              ]))
            }
            

            return row('div', {
              style: {
                textAlign: "center"
              }
            }, arr);
          }
        }
      ],
      apidata: []
    }
  },
  methods: {
    pageChange(value) {
      this.pageIndex = value;
      that.loading = true
      return that.GetList()
    },
    pageSizeChange(value){
        this.pageSize = value;
        this.GetList();
    },
    //导出文档
    exportDocument_click() {
      let requedata = {
        keywords:that.keywords,
        ApplyState:that.ApplyState || '',
        RoleId:that.RoleVal || '',
        IsTeamLeader:this.leaders || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime
      };
      let url = this.$api.exportMemberInfoMangerList;
      let initUrl = url
      //location.href = that.ajaxUrl
      for(let key in requedata){
        if(requedata[key]) {
          if(url===initUrl) url += '?'+key+'='+requedata[key]
            else url += '&'+key+'='+requedata[key]
        }
      }
      //console.log(url);
      location.href = url
    },

    GetList(callback){
      let requedata = {
        PageIndex:that.pageIndex,
        PageSize:that.pageSize,
        keywords:that.keywords,
        ApplyState:that.ApplyState || '',
        RoleId:that.RoleVal || '',
        IsTeamLeader:this.leaders || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.getMemberInfoMangerList, requedata, data => {
        that.total = data.result.totalCount || 0;
        that.apidata = data.result.resultList || []
        that.loading = false;
        return callback && callback(data)
      })
    },
    //恢复数据
    recoveryData(callback){
      that.total = 0
      that.loading = true
      //that.apidata = []
      that.pageIndex = 1
      return callback && callback()
    },

    //搜索
    search_click(){
      return that.recoveryData(that.GetList)
    },

    //编辑
    editApi_click(row){
     // console.log('editApi_click',row.memberId);
      that.editVisible = true
      that.MemberId = row.memberId
    },
    
    //时间选择
    dateChange(value){
      that.StartTime  = value[0] || ''
      that.EndTime    = value[1] || ''
      //console.log(value);
    },

    //授权状态
    ApplyState_Change(val){
      //console.log(val);
      that.ApplyState = val
    },

    //更多菜单
    DropApi_click(val,row){
      
      this.angeyData=row;
      that.lmlId = row.memberId;
      that.lmlRoleId = row.roleGradeNum;
      this.isTeamLeader = row.isTeamLeader;
      that.model_tit = val
      if(val===dropList[0].label){
        //console.log(row.roleId);
        
        that.lowerGrade_visible = true 
      }else if(val===dropList[1].label){
        that.recommandList_visible = true 
      }else if(val===dropList[2].label){
        that.editSuper_visible = true 
      }else if(val===dropList[3].label){
        that.editRecommend_visible = true 
      }else if(val===dropList[4].label){

        that.setOfficial_visible = true
      }else if(val===dropList[5].label){
        that.protectArea_visible = true
      }else if(val===dropList[6].label){
        that.editeAngecy_visivle=true
      }else if(val===dropList[7].label){
        this.canselList=row;       
        this.canselShou=true;
      }else if(val===dropList[8].label){
        this.editers='';
        this.eiditRanklist=row;
        this.angecyNames=row.name;
         this.angecyRanks=row.roleName;       
        this.eiditRank=true;


      }
    },

    // 取消授权保存
    saveCansel(){
      let waou={
            Id:this.canselList.memberId
         }

        this.$request(this.$api.MemberInfoDeauthorize,waou,data=>{
          if (data.isSuccess){
                this.$Message.success(data.message || '取消成功!');                        
                this.GetList();
                this.canselShou=false;
          }else{
                this.$Message.error(data.message);
          }
        })
    },

    // 修改代理商的保存
    saveiditRank(){
      if(this.editers==''){
        this.$Message.error('请选择代理级别');
        return false;
      }
      this.eiditRank=false;
      this.eidateTips=true;
      this.RoleList.map(item=>{
         if(item.id==this.editers){
            this.afterRanks=item.roleName;
         }
      })
    },

    // 修改代理等级提示的取消
   eidateTipscancel(){

    },

    // 修改代理等级提示的确定
    eidateTipsok(){
       let palmer={
          Id:this.eiditRanklist.memberId,
          RoleID:this.editers
       }

       this.$request(this.$api.MemberInfoModifyAgentLevel,palmer,data=>{
          if (data.isSuccess){
                this.$Message.success(data.message || '修改成功!');                        
                this.delectAnge=false;
                this.GetList();

          }else{
                this.$Message.error(data.message);
          }
      })


    },

    edit_cancel(){
      that.editVisible = false
    },

    edit_ok(){
      that.editVisible = false
      return that.recoveryData(()=>{
        return that.GetList(()=>{
          return that.$Message.success('保存成功');
        })
      })
    },
    // 删除用户
    delectUsers(records){
      this.angecyList=records;
      this.delectAnge=true;
      
    },

    // 删除用户保存
    saveselect(){
      let halam={
        MemberId:this.angecyList.memberId
      }

      this.$request(this.$api.suerDelete,halam,data=>{
          if (data.isSuccess){
                this.$Message.success(data.message || '删除成功!');                        
                this.delectAnge=false;
                this.GetList();

          }else{
                this.$Message.error(data.message);
          }
      })

    },

    //推荐人ok
    editRecommend_ok(){
      that.editRecommend_visible = false
      //that.$Message.success('修改成功');
      return that.recoveryData(that.GetList)
    },

    //修改上级ok
    editSuper_ok(){
      that.editSuper_visible = false
      that.$Message.success('修改成功');
      return that.recoveryData(that.GetList)
    },

    //最高链接
    highLink_ok(){
      //that.highLink_click
    },

    //设置区域
    protectArea_ok(){
      that.protectArea_visible = false;
    },

    handleSuccess(data){

      if (data.isSuccess){
        let list = data.result.map(item=>{
          return '<p>'+item+'</p>'
        })

        this.$Modal.info({
            title: '导入结果',
            content: list.join('')
        });

        this.GetList();


      }else{
        this.$Message.error(data.message||'导入失败')
      }

      
    },

    // 修改手机号
    editphone(ward){
      this.valuePhone=ward.phone;
      this.angecyId=ward.memberId;
      this.modal1=true;
    },
    saveButton(){
      this.GetList()
    },

    // 保存
    saveBtn(){

        function isPhone(str) {
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            return reg.test(str);
        };
        if(this.valuePhone == undefined  || !isPhone(this.valuePhone)){
            alert("请填写正确的手机号");
            return false;
       }

       let pamer={
          MemberId:this.angecyId,
          UpdatePhone:this.valuePhone
       }
       this.$request(this.$api.UpdatePhone,pamer,data=>{
            if(data.isSuccess){
                this.$Message.success('修改成功');
                this.modal1=false;
                this.GetList();
            }else{
                this.$Message.error(data.message);
            }
        });

    },
    
  }
};
</script>
