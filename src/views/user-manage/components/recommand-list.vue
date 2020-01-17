<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}
.agent_modalWraper{
  .selectType{
    width:140px;
    vertical-align:top;
    margin-right: 12px;
  }
  .agent_modalTable {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .btn-wraper {
    display: inline-block;
    vertical-align: top;
  }
}
.agentInfo_model{
  .fromInput{
    width: 200px;
  }
}


</style>
<template>
<div class="agent_warper">
  <Modal v-model="isShow" width=800 :title='title' @on-cancel="Modal_cencel" class="agent_modalwarp">
      <div class="agent_modalWraper">
        <Input v-model="keywords" placeholder="姓名、电话" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
        <Select v-model="RoleId" v-if="RoleList.length" class="selectType" placeholder="选择代理等级">
          <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
        </Select>
        <Select v-model="recommandVal" class="selectType" placeholder="选择推荐层级">
          <Option v-for="(item,index) in recommandLevel" :value="item.level" :key="index">{{ item.levelStr }}</Option>
        </Select>
        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="search_click">搜索</Button>
          <Button type="success" @click="exportDocument_click" icon="document-text">导出</Button>
          <Button type="primary" icon="compose" @click="batchModify_click">批量修改</Button>
        </div>
        <div class="agent_modalTable">
          <Table :loading="loading" :columns="columns" :data="apidata" size="small" @on-selection-change="select_change"></Table>
        </div>
        <Page :total="total" @on-change="pageChange" :current="pageIndex" v-if="total>pageSize"></Page>
      </div>

      <div slot="footer">
        <Button size="large" @click="Modal_cencel">关闭</Button>
      </div>
  </Modal>

  <Modal
      v-model="info_model"
      width=460
      title="修改推荐人" class="agentInfo_model" @on-cancel="bingPopCancel">
      <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100">
        <div class="agent_tips">备注:推荐人电话填-1时，将解除该代理与其推荐人的推荐关系</div>
        <FormItem prop="phone" label="推荐人电话">
          <Input v-model="formInfo.phone" class="fromInput"></Input>
          <Button type="info"  @click="query_click" class="query_btn" style="margin-left: 12px">查询</Button>
        </FormItem>
        <FormItem prop="name" label="推荐人姓名">
          <span>{{formInfo.name}}</span>
        </FormItem>
      </Form>
      
      <Card v-if="resultList.length">
          <div style="max-height:400px;overflow:auto;">
              <div v-for="item in resultList"  style="font-size:12px;" :style="{color: item.isSuccess?'#666':'#f84444'}">{{item.name+', '+item.result}}</div>
          </div>
      </Card>

      <div slot="footer">
        <Button size="large" @click="bingPopCancel">关闭</Button>
        <Button type="primary" size="large" :loading="save_loading" @click="info_model_ok" >确认</Button>
      </div>
  </Modal>
</div>
</template>
<script>
import utils            from '@/libs/util';

let  that
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title:String,
    memberId:Number,
    lmlRoleId: Number
  },
  components: {

  },
  data() {
    const phoneCheck = (rule, value, callback)=>{
      //let reg = 
      if (value == '-1'){
        callback();
      }else if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (!(/^1\d{10}$/.test(value))) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    }
    return {
      save_loading:false,
      recommandLevel: [],
      recommandVal:'',
      result:{},
      editIdList:[],
      info_model:false,
      loading:true,
      total:0,
      pageSize: 10,
      pageIndex: 1,
      keywords:'',
      ApplyStateList:[],
      ApplyState:'',
      RoleList:[],
      RoleId:'',
      apidata:[],
      resultList: [],
      isShow: this.visible,
      columns:[
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },{
          title: '姓名',
          key: 'name',
          align: 'center',
        },{
          title: '电话',
          key: 'phone',
          align: 'center',
        },{
          title: '推荐层级',
          key: 'levelStr',
          align: 'center'
        },{
          title: '等级',
          key: 'roleName',
          align: 'center',
        },{
          title: '余额云仓',
          key: 'stock',
          align: 'center',
        },
      ],
      formInfo:{
        phone:'',
        name:''
      },
      ruleInfo:{
        phone: [{
          required: true,
          validator:  phoneCheck,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    that = this
    return utils.getRoleList(that,data => {
      that.RoleList  = data
    })
    //console.log(this.MemberId);
  },
  methods: {
    //导出文档
    exportDocument_click() {
      let requedata = {
        keywords:that.keywords,
        RecommandLevel:that.recommandVal || '',
        MemberId:that.memberId
      };
      let url = this.$api.ExportRecommandMemberList;
      let initUrl = url
      //console.log(requedata);
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
    search_click(){
      return that.recoveryData(that.GetList)
    },
    pageChange(value) {
      this.pageIndex = value;
      that.loading = true
      return that.GetList()
    },

    //批量修改
    batchModify_click(){
      if(that.editIdList.length>0){
        that.info_model = true
      }else{
        this.$Message.warning('请选择代理'); 
      }
    },

    select_change(selection){
      
      that.editIdList = selection.map((el, ix) => {
        return el.memberId;
      })
      //console.log('s',that.editIdList);
    },
    select_all(selection){
      console.log('all',selection);
    },

    GetList(callback){
      let requedata = {
        PageIndex:that.pageIndex,
        PageSize:that.pageSize,
        Keywords:that.keywords,
        RecommandLevel:that.recommandVal || '',
        MemberId:that.memberId
      };

      return that.$request(this.$api.getRecommandMemberList, requedata, data => {
        that.total = data.result.totalCount || 0;
        that.apidata = data.result.resultList || [];
        that.loading = false
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
    //表单提交
    Modal_ok() {
      //console.log('Modal_ok');
      //console.log(that.apidata);
    },

    //对话框取消
    Modal_cencel(){
      
      this.$refs.formInfo.resetFields();
      return this.$emit('modal-cancel')
    },

    bingPopCancel(){
      this.formInfo.phone = '';
      this.formInfo.name = '';
      this.resultList = [];
      this.info_model=false;
    },

    //弹框确认 == 批量修改
    info_model_ok(){
      console.log(that.editIdList);
      if(that.formInfo.name || that.formInfo.phone==-1){
        that.save_loading = true
        let requedata = {
          RecommandId:(that.formInfo.phone=='-1')?0:that.result.memberId,
          MemberList:that.editIdList.map(item=>{
            return {
              MemberId: item
            }
          })
        };

        return that.$request(this.$api.editMemberRecommand, requedata, data => {
          console.log('batchEditRecommand',data);

          that.save_loading = false
          if(data.isSuccess){
            // that.$Message.success('修改成功');
            // that.info_model = false
            this.resultList = data.result;
          }else if(data.message) that.$Message.error(data.message);
        }, null, ()=>{}, true)
      }else{
        that.$Message.error('未进行查询');
      }
    },
    //查询姓名
    query_click(){
      return this.$refs['formInfo'].validate((valid) => {
        if(valid){
          let requedata = {
            Phone:that.formInfo.phone
          };
          return that.$request(this.$api.getMemberInfoByPhone, requedata, data => {
            if(data.isSuccess){
              
              if(data.result) {
                console.log(data.result.name);
                that.result = data.result[0]
                that.formInfo.name = data.result[0].name
              } 

            }else if(data.message) that.$Message.error(data.message);
          })
        }else that.$Message.error('查询失败');
      })
      
    }
  },
  watch: {
    visible(value) {
      this.isShow = value;
      if(value){
        this.RoleList = this.RoleList.filter(item=>{
            if (this.lmlRoleId === 1 || this.lmlRoleId === 2){
                return item.id == 1 || item.id == 2;
            }else{
                return false;
            }
          
        })

        const params = {
          MemberId: this.memberId
        }

        this.$request(this.$api.getRecommandLevel, params, data=>{
            this.recommandLevel = data.result;
            this.GetList();
        })

        //return that.GetList()
      }
    }
  }
};
</script>
