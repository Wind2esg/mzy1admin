<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}

.agent_tips{
  color: red;
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 10px;
  text-align: center;
}
</style>
<template>
<div class="agent_warper">
  <Modal v-model="isShow" width=460 :title='title' @on-cancel="Modal_cencel" class="agent_modalwarp">
      <Form ref="formInfo" :model="formInfo" :label-width="100" class="Modal_from">
        <div class="agent_tips">备注:推荐人电话填-1时，将解除该代理与其推荐人的推荐关系</div>
        <FormItem prop="phone" label="搜索推荐人">
          <Input v-model="phoneNumber" class="fromInput" clearable></Input>
          <Button type="info"  @click="query_click" class="query_btn" style="margin-left: 12px">查询</Button>
        </FormItem>
        <FormItem prop="name" label="推荐人信息">
          <div v-for="namePhone in result "  v-show="showPhone">
              <span>姓名:{{namePhone.name}}</span>
              <span style="margin-left:15px;">电话:{{namePhone.phone}}</span>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="Modal_cencel">关闭</Button>
        <Button type="primary" :loading="save_loading" size="large" @click="info_model_ok" >确认</Button>
      </div>
  </Modal>
</div>
</template>
<script>

let  that
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title:String,
    memberId:Number,
  },
  components: {

  },
  data() {
    const phoneCheck = (rule, value, callback)=>{
      //let reg = 
      console.log(value);
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if(value=='-1'){
        callback();
      } else if (!(/^1\d{10}$/.test(value))) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    }
    return {
      save_loading:false,
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
      showPhone:false,
      isShow: this.visible,
      phoneNumber:'',
      formInfo:{
        phone:'',
        name:''
      },
      // ruleInfo:{
      //   phone: [
      //     { required: true, validator:  phoneCheck, trigger: 'blur'},
      //   ]
      // }
    }
  },
  created() {
    that = this
    //console.log(this.MemberId);
  },
  methods: {
    //导出文档
    exportDocument_click() {
      let requedata = {
        keywords:that.keywords,
        RoleId:that.RoleId || '',
        MemberId:that.memberId
      };
      let url = this.$api.ExportRecommandMemberList;
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
        Take:that.pageSize,
        Keywords:that.Keywords,
        RecommandLevel:that.recommandVal || 0,
        RoleId:that.RoleId || 0,
        MemberId:that.memberId
      };

      return that.$request(this.$api.getRecommandMemberList, requedata, data => {
        that.total = data.length || 0
        that.apidata = data.list || []
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
      this.$refs['formInfo'].resetFields();
      this.formInfo = {}
      return this.$emit('modal-cancel')
    },

    //弹框确认 == 修改
    info_model_ok(){
      // return that.$refs['formInfo'].validate((valid) => {
        // if(valid){
          if(that.phoneNumber||that.phoneNumber==-1){

            that.save_loading = true;
            // console.log(that.result,56)
            let supers;
            if(that.result.length<2){
                supers=that.result[0].memberId;
            }else{
                supers=that.result.memberId;
            }
            let phoneId = (that.phoneNumber==-1)?0:supers;
            console.log(that.result,89)
            let requedata = {
              RecommandId:phoneId,
              MemberList: [{
                MemberId: that.memberId
              }]
            };
            return that.$request(this.$api.editMemberRecommand, requedata, data => {
              console.log('EditMemberRecommend',data.result[0].result);
              that.save_loading = false
              if(data.isSuccess){
                that.$Message.info(data.result[0].result);
                return that.$emit('modal-ok');
              }else if(data.message) that.$Message.error(data.message);
            }, null, ()=>{}, true)
          }else{
            that.$Message.error('未进行查询');
          }
        // }
        // else{
        //   that.$Message.error('操作失败');
        // }
      // })
      
    },
    //查询姓名
    query_click(){
      // return this.$refs['formInfo'].validate((valid) => {
        // if(valid){

          if (that.phoneNumber === '') {
             that.$Message.error('搜索推荐人不能为空');
             return false;
          } 

          let requedata = {
            Phone:that.phoneNumber 
          };
          return that.$request(this.$api.getMemberInfoByPhone, requedata, data => {
            if(data.isSuccess && data.result.length){
              //console.log(data);
              // if(data.result) {
                that.result = data.result;
                that.showPhone=true;
                console.log(this.result,66)
                // that.formInfo.name = that.result.name
              // } 

            }else{
                that.showPhone=false;                
                that.$Message.error('未查询到')
            }
            // else if(data.message) that.$Message.error(data.message);
          })
        // }
        // else that.$Message.error('查询失败');
      // })
      
    }
  },
  watch: {
    visible(value) {
      this.isShow = value;
      if(value){
        // this.formInfo.phone = '';
        // this.formInfo.name = '';
        that.showPhone=false;
        that.phoneNumber='';
        //console.log(that.memberId);
        //return that.GetList()
      }
    }
  }
};
</script>
