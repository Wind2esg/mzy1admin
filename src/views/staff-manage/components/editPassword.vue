<style lang="less">
.Modal_from {
  .fromInput {
    width: 200px;
  }
  .Selectbox {
    width: 200px;
  }
}
</style>
<template>
  <Modal v-model="isShow" width=540 title='修改密码' @on-cancel="cancel_fn">
    <Form ref="formInfo" :model="formInfo" :rules="rule" :label-width="100" class="Modal_from">
      <FormItem label="新密码" prop="Password">
        <Input type="password" v-model="formInfo.Password" placeholder="请输入新密码" class="fromInput"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="PasswdCheck">
        <Input type="password" v-model="formInfo.PasswdCheck" placeholder="请输入确认密码" class="fromInput"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button size="large" @click="cancel_fn">取消</Button>
        <Button :loading="save_loading" type="primary" size="large" @click="ok_fn" >确定</Button>
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
    memberId:Number
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
    return {
      save_loading:false,
      isedit: false,
      isShow: this.visible,
      formInfo: {
        Password: '',
        PasswdCheck: '',
      },
      rule: {
        Password:[
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' },
          { required: true, validator: validatePass, trigger: 'blur'}
        ],
        PasswdCheck:[{
          required: true,
          validator: validatePassCheck,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    //console.log(this.formInfo);
  },
  methods: {
    handleSuccess() {

      },
      ok_fn() {
        let that = this
        return this.$refs['formInfo'].validate((valid) => {
          if (valid) {
            that.save_loading = true
            let requedata = {
              Id:that.memberId,
              Password:that.formInfo.Password,
              ConfirmPassword:that.formInfo.PasswdCheck
            };

            //console.log(requedata);
            return that.$request(this.$api.resetPasswordEmployee, requedata, data => {
              //console.log(data);

              that.save_loading = false
              let msg = data.message || '修改成功'
              this.$Message.success(msg);
              this.$emit('cancelpasd')
            })
            //this.$emit('okAdd', this.form.name)
          } else {
            this.$Message.error('提交失败');
          }
        })
        //console.log('ok_fn',this.form.name);
        
      },
      cancel_fn() {
        this.$refs.formInfo.resetFields();
        this.$emit('cancelpasd')
      }
  },
  watch: {
    visible(value) {
      //console.log('d',value)
      this.isShow = value;
    }
  }
};
</script>
