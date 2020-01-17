<style lang="less">
.Modal_from {

  .Selectbox {
    width: 200px;
  }
  &.agent_Modal_from{
    .fromInput {
      width: 250px;
    }
  }
}
.Modal_upimg_warp{
  overflow: hidden;
  text-align: center;
  .agent_upimg_item{
    width: 50%;
    margin: 0 auto 20px;
  }
  .up_imgbox{
    margin: 0 30px 30px;
    overflow: hidden;
  }
  .imgbox-img{
    width: 100%;
    display: block;
  }
  .ResetUpimg{
    margin: 20px auto 0;
  }
}

</style>
<template>
  <Modal v-model="isShow" width=640 title='代理资料查看/修改' @on-cancel="cancel_fn">
    <div class="Modal_upimg_warp">
      <Upload
          type="drag"
          :show-upload-list="false"
          :on-success="upimgSuccess"
          :on-error="upimgError"
          :on-format-error="upimgFormatError"
          :max-size="2048"
          :format="['jpg','jpeg','png']"
          v-if="!formInfo.cardPicUrl"
          action="http://file.xsmore.com/api/image/upload?PlatForm=xmz&Path=Member"
          class="agent_upimg_item">
          <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>上传身份证截图</p>
          </div>
      </Upload>
      <div class="up_imgbox" v-if="formInfo.cardPicUrl">
        <img :src="formInfo.cardPicUrl" alt="" class="imgbox-img">
        <Button type="primary" class="ResetUpimg" @click="ResetUpimg_click">重置</Button>  
      </div>
      
    </div>
    
    <Form ref="formInfo" :model="formInfo" :rules="rule" :label-width="100" class="Modal_from agent_Modal_from">
      <FormItem label="姓名：" prop="name">
        <Input type="text" v-model="formInfo.name" placeholder="请输入姓名" class="fromInput"></Input>
      </FormItem>
      <FormItem label="手机号：" prop="phone">
        <Input type="text" v-model="formInfo.phone" placeholder="请输入手机号" class="fromInput"></Input>
      </FormItem>
      <FormItem label="身份证：" prop="cardID">
        <Input type="text" v-model="formInfo.cardID" placeholder="请输入身份证" class="fromInput"></Input>
      </FormItem>
      <FormItem label="所在省：" prop="province">
        <Input type="text" v-model="formInfo.province" placeholder="请输入所在省" class="fromInput"></Input>
      </FormItem>
      <FormItem label="所在市：" prop="city">
        <Input type="text" v-model="formInfo.city" placeholder="请输入所在市" class="fromInput"></Input>
      </FormItem>
      <FormItem label="所在区：" prop="area">
        <Input type="text" v-model="formInfo.area" placeholder="请输入所在区" class="fromInput"></Input>
      </FormItem>
      <FormItem label="详细地址：" prop="address">
        <Input type="textarea" v-model="formInfo.address" :rows="4" placeholder="请输入详细地址" class="fromInput"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button size="large" @click="cancel_fn">取消</Button>
        <Button type="primary" size="large" @click="ok_fn" >确定</Button>
    </div>
  </Modal>
</template>
<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    MemberId:Number
  },
  components: {

  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入你的密码'));
      } else {
        if (this.formInfo.PasswdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formInfo.validateField('PasswdCheck');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认你的密码'));
      } else if (value !== this.formInfo.Password) {
        callback(new Error('两个输入密码不匹配！'));
      } else {
        callback();
      }
    };

    const phoneCheck = (rule, value, callback)=>{
      //let reg = 
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (!(/^1\d{10}$/.test(value))) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    }

    const cardIDCheck = (rule, value, callback)=>{
      //let reg = 
      if (value === '') {
        callback(new Error('身份证号不能为空'));
      } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
        callback(new Error('身份证号填写有误'));
      } else {
        callback();
      }
    }
    return {
      isedit: false,
      isShow: this.visible,
      formInfo: {
        name: '',
        phone: '',
        province:'',
        city:'',
        area:'',
        address:'',
        cardID:'',
        cardPicUrl:''
      },
      rule: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          validator:  phoneCheck,
          trigger: 'blur'
        }],
        province: [{
          required: true,
          message: '请输入所在省',
          trigger: 'change'
        }],
        city: [{
          required: true,
          message: '请输入所在市',
          trigger: 'change'
        }],
        area: [{
          required: true,
          message: '请输入所在区',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'change'
        }],
        cardID: [{
          required: true,
          validator: cardIDCheck,
          trigger: 'change'
        }],
        Password:[{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        }],
        PasswdCheck:[{
          required: true,
          validator: validatePassCheck,
          trigger: 'blur'
        }]
      },
    }
  },
  created() {
    //console.log(this.MemberId);
  },
  methods: {
    handleSuccess() {

      },
      ok_fn() {
        let that = this

        this.$refs['formInfo'].validate((valid) => {
          if (valid) {
            console.log('提交成功');
            that.$Spin.show();

            let requedata = {},formInfo = that.formInfo;
            for(let key in formInfo){
              if(formInfo[key]) {
                let key1 = key.substring(0,1).toUpperCase()+key.substring(1);
                requedata[key1] = formInfo[key]
              }
            }
            requedata.MemberId = that.MemberId
            //console.log(requedata);

            return that.$request('memberInfoEdit', requedata, data => {
              that.$Spin.hide();
              if(data.isSuccess){
                that.$emit('edit-ok')
              }else if(data.message) that.$Message.error(data.message);
                else that.$Message.error('提交失败');
            })
            //this.$emit('okAdd', this.form.name)
          } else {
            that.$Message.error('提交失败');
          }
        })
        
      },
      cancel_fn() {
        this.$emit('edit-cancel')
      },

      //上传图片
      upimgSuccess(res, file){
        //console.log(res,file,this.imghost);
        if(res.length>0){
          this.formInfo.cardPicUrl = this.imghost + res[0]
        }
      },
      upimgError (file) {
        this.$Notice.warning({
            title: '上传',
            desc: file.name + '文件上传失败'
        });
      },
      upimgFormatError (file) {
        this.$Notice.warning({
            title: '文件格式不正确',
            desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
        });
      },

      //重置图片
      ResetUpimg_click(){
        this.formInfo.cardPicUrl = ''
      }
  },
  watch: {
    visible(value) {
      this.isShow = value;
    },
    MemberId(id){
      if(id){
        let that = this
        return that.$request('memebrInfoDetail', {MemberId:id}, data => {
          for(let key in that.formInfo){
            if(data[key]) that.formInfo[key] = data[key]
              else if(key==='cardPicUrl'){
                that.formInfo[key] = ''
              }
          }
        })
      }
    }
  }
};
</script>
