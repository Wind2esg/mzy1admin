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
  <Modal v-model="isShow"  :transfer="transfer" width=460 title='修改推荐人' @on-cancel="Modal_cencel" class="agent_modalwarp">
      <Form v-if="isShow" ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100" class="Modal_from">
        <div class="agent_tips">备注:推荐人ID填-1时，将解除该代理与其推荐人的推荐关系</div>
        <FormItem prop="ID" label="推荐人ID">
          <Input v-model="formInfo.ID" class="fromInput"></Input>
          <Button type="info"  @click="query_click" class="query_btn" style="margin-left: 12px">查询</Button>
        </FormItem>
        <div style="margin-left:33px;">
          <span>姓名：</span><span style="display:inline-block;width: 80px;">{{name}}</span>
          <span>微信昵称：</span><span style="display:inline-block;width: 80px;">{{nickName}}</span>
          <span>电话：</span><span style="display:inline-block;width: 80px;">{{phone}}</span>
        </div>
      </Form>
      
      <Card style="margin-top:10px;" v-if="resultList.length">
          <div style="max-height:400px;overflow:auto;">
              <div v-for="item in resultList" style="font-size:12px;" :style="{color: item.isSuccess?'#666':'#f84444'}">{{item.name+', '+item.result}}</div>
          </div>
      </Card>

      <div slot="footer">
        <Button size="large" @click="Modal_cencel">关闭</Button>
        <Button type="primary" :loading="save_loading" size="large" @click="info_model_ok" >确认</Button>
      </div>
  </Modal>
</div>
</template>
<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title:String,
    memberId: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    transfer: {
      type: Boolean,
      default: true
    }
  },
  components: {

  },
  data() {
    const phoneCheck = (rule, value, callback)=>{
      //let reg = 
      if (value === '') {
        callback(new Error('ID不能为空'));
      } else if(value=='-1'){
        callback();
      }else{
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
      isShow: this.visible,
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
      resultList: []
    }
  },
  created() {

    //console.log(this.MemberId);
  },
  methods: {
   
    //对话框取消
    Modal_cencel(){
      this.$refs['formInfo'].resetFields();
      this.formInfo = {}
      return this.$emit('cancel')
    },

    //弹框确认 == 修改
    info_model_ok(){
      this.$refs['formInfo'].validate((valid) => {
        if(valid){
          if(this.formInfo.ID||this.formInfo.ID==-1){

            this.save_loading = true;

            let phoneId = this.formInfo.ID;
            let requedata = {
              UserRecommendId: phoneId,
              MemberIdList: this.memberId
            };

            this.$request(this.$api.EditUserRecommend, requedata, data => {

              this.save_loading = false;

              if(data.isSuccess){
                
                if (data.result.length === 1){
                    this.$Message.info(data.result[0].result);
                }else{
                    this.resultList = data.result;
                }

                return this.$emit('modal-ok');
              }else if(data.message){
                this.$Message.error(data.message);
              }

            }, null, ()=>{}, true)

          }else{

            this.$Message.error('未进行查询');

          }
        }else{
          this.$Message.error('操作失败');
        }
      })
      
    },
    //查询姓名
    query_click(){

      if (this.formInfo.ID == -1){
        this.name = '';
        this.phone = '';
        this.nickName = '';
        return;
      }

      this.$refs['formInfo'].validate((valid) => {
        if(valid){
          console.log(this.formInfo.ID)
          let requedata = {
            UserRecommendId:this.formInfo.ID
          };
          return this.$request(this.$api.GetUserRecommendInfo, requedata, data => {
            if(data.isSuccess){
    
              this.result = data.result;
              this.name = this.result.name;
              this.phone = this.result.phone;
              this.nickName = this.result.nickName;
              console.log(this.formInfo)
              

            }else if(data.message) this.$Message.error(data.message);
          })
        }else this.$Message.error('查询失败');
      })
      
    }
  },
  watch: {
    visible(value) {
      this.isShow = value;
      if(value){
        
        //console.log(this.memberId);
        //return this.GetList()
      }else{
        this.formInfo.ID = '';
        this.nickName = '';
        this.phone = '';
        this.name = '';
        this.resultList = [];
      }
    }
  }
};
</script>
