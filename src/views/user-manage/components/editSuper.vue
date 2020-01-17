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
     <!--  <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100" class="Modal_from"> -->
      <Form ref="formInfo" :model="formInfo"  :label-width="100" class="Modal_from">
        <FormItem prop="phone" label="搜索上级">
          <Input v-model="phoneNumber" class="fromInput" clearable ></Input>
          <Button type="info"  @click="query_click" class="query_btn" style="margin-left: 12px">查询</Button>
        </FormItem>
        <FormItem prop="name" label="上级信息" >
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
    // const phoneCheck = (rule, value, callback)=>{
    //   //let reg = 

    //   console.log(value,8989)
    //   if (value === '') {
    //     callback(new Error('搜索上级不能为空'));
    //   } else if (!(/^1\d{10}$/.test(value))) {
    //     // callback(new Error('请输入正确的手机号'));
    //   } else {
    //     callback();
    //   }
    // }
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
      phoneNumber:'',
      isShow: this.visible,
      formInfo:{
        phone:'',
        name:''
      },
      // ruleInfo:{
      //   phone: [{
      //     required: true,
      //     trigger: 'blur'
      //   }]
      // }
    }
  },
  created() {
    that = this
    //console.log(this.MemberId);
  },
  methods: {

    //对话框取消
    Modal_cencel(){
      // this.$refs.formInfo.resetFields();
      this.formInfo = {
        phone:'',
        name:''
      }
      return this.$emit('modal-cancel')
    },

    //弹框确认 == 修改
    info_model_ok(){
      if(that.phoneNumber){
        that.save_loading = true;
        let supers;
        if(that.result.length<2){
            supers=that.result[0].memberId;
        }else{
            supers=that.result.memberId;
        }
        let requedata = {
          SuperId:supers,
          MemberList: [{
            MemberId: that.memberId   
          }]
        };
        return that.$request(this.$api.memberInfoEditSuper, requedata, data => {
          console.log('EditMemberSuper',data);
          that.save_loading = false
          if(data.isSuccess){
            this.formInfo = {
              phone:'',
              name:''
            };
            return that.$emit('modal-ok')
          }else if(data.message) that.$Message.error(data.message);
        }, null, ()=>{}, true)
      }else{
        that.$Message.error('未进行查询');
      }
    },
    //查询姓名
    query_click(){
      // return this.$refs.formInfo.validate((valid) => {
      //   console.log(valid,799456)
        // if(valid){

          if (that.phoneNumber === '') {
             that.$Message.error('搜索上级不能为空');
             return false;
          } 


          let requedata = {
            Phone:that.phoneNumber
          };
          return that.$request(this.$api.getMemberInfoByPhone, requedata, data => {

            if(data.isSuccess && data.result.length){
              // if(data.result.length) {

                that.result = data.result;
                console.log(that.result,999)
                that.showPhone=true;
              // } 

            }else{
                that.showPhone=false;                
                that.$Message.error('未查询到')
            }
          })
        // }
        // else that.$Message.error('查询失败');
      // })
      
    }
  },
  watch: {
    visible(value) {
      console.log(value)
      this.isShow = value;
      if(value){
        that.showPhone=false;
        that.phoneNumber='';
        //console.log(that.memberId);
        //return that.GetList()
      }
    }
  }
};
</script>
