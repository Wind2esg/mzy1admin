<style lang="less">
.staff_from {
  padding: 20px 40px;
  .fromInput {
    width: 200px;
  }
  .Selectbox {
    width: 200px;
    /* vertical-align: middle; */
  }
}
</style>
<template>
  <div class="staff_from" @keydown.enter="handleSubmit('formInfo')">
    <Form ref="formInfo" :model="formInfo" :rules="rule" :label-width="100">
      <FormItem label="员工姓名" prop="Name">
        <Input v-model="formInfo.Name" placeholder="员工姓名" class="fromInput"></Input>
      </FormItem>
      <FormItem label="手机号" prop="Phone">
        <Input v-model="formInfo.Phone" placeholder="手机号" class="fromInput"></Input>
      </FormItem>
      <FormItem label="所属职位" prop="AndRoleVal">
        <Cascader :data="AndRoleList" v-model="formInfo.AndRoleVal" class="fromInput"></Cascader>
      </FormItem>
      <FormItem label="登入密码" prop="Password" v-if="!isEdit">
        <Input type="password" v-model="formInfo.Password" placeholder="登入密码" class="fromInput"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="PasswdCheck" v-if="!isEdit">
        <Input type="password" v-model="formInfo.PasswdCheck" placeholder="确认密码" class="fromInput"></Input>
      </FormItem>
      <FormItem>
        <Button style="margin-right: 10px;" @click="cancel">返回</Button>
        <Button :loading="save_loading" type="primary" @click="handleSubmit('formInfo')">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>

let that
export default {
  name: 'add-staff',
  props: {
    isedit: {
      type: Boolean,
      default: false
    },
    editData:Object
  },
  components: {
  },
   created(){
    that = this;

    if(that.$store.state.user.AndRoleList.length>0){
   
      that.AndRoleList = that.$store.state.user.AndRoleList
    }else{
     
      let AndRoleList = []
      //console.log('getRoleList1',that.$store.state.user.RoleList.length);
      that.$request(this.$api.getDepartmentAndRoleList, {}, data => {
     
        if(data.length>0){
          data.map((el1, ix1) => {
            let obj1 = {}
            obj1.value = el1.departmentId
            obj1.label = el1.departmentName
            obj1.children = []
            el1.roles.map((el2, ix2) => {
              let obj2 = {}
              obj2.value = el2.roleId
              obj2.label = el2.roleName
              obj1.children.push(obj2)
            })
            AndRoleList.push(obj1)
          })
        }
        that.AndRoleList = AndRoleList
        that.$store.state.user.AndRoleList = AndRoleList
      })
    }

    
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

    return {
      isEdit:false,
      save_loading:false,
      AndRoleList:[],
      formInfo: {
        AndRoleVal:[],
        Name: '',
        Phone: "",
        Password: '',
        PasswdCheck: '',
      },
      rule: {
        Name: [{
          required: true,
          message: '员工姓名不能为空',
          trigger: 'blur'
        }],
        Phone: [{
          required: true,
          validator:  phoneCheck,
          trigger: 'blur'
        }],
        AndRoleVal:[{
          type: 'array',
          required: true,
          message: '请选择所属职位',
          trigger: 'change'
        }],

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
      },
      departData: [{
        value: '100',
        label: '技术部'
      }, {
        value: '4444',
        label: '销售部'
      }],
      jobData: [{
        value: 'qiand',
        label: '前端'
      }, {
        value: 'shej',
        label: '设计'
      }]
    }
  },
  methods: {
    cancel() {
        this.$refs.formInfo.resetFields();
        this.$emit('cancelAdd')
          //this.lml = '3333'
      },
      //选择框
      stateChange(value) {
        console.log('stateChange', value);
      },
      jobChange(value) {
        console.log('职位', value);
      },
      //表单提交
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            that.save_loading = true
            let formInfo = this.formInfo,AndRoleVal = that.formInfo.AndRoleVal
            let requedata = {
              Id:that.editData.id || 0,
              Phone:formInfo.Phone,
              DepartmentId:AndRoleVal[0],
              EmployeeRoleId:AndRoleVal[1],
              Name:formInfo.Name
            };
            if(formInfo.Password) requedata.Password = formInfo.Password
            if(formInfo.PasswdCheck) requedata.ConfirmPassword = formInfo.PasswdCheck

            //console.log(requedata);
            return that.$request(this.$api.updateEmployee, requedata, data => {
              that.save_loading = false
                if(data.isSuccess){
                  this.$emit('staff-ok')
                }else if(data.message) that.$Message.error(data.message);
                  else that.$Message.error('保存失败');
            })
          } else {
            this.$Message.error('提交失败');
          }
        })
      }
  },
  watch: {
    editData(value) {
      let that = this
      if(value.id){
        that.formInfo.Name = value.employeeName || ''
        that.formInfo.Phone = value.phone || ''
        that.isEdit = true
        if(value.departmentId && value.roleId) that.formInfo.AndRoleVal = [value.departmentId,value.roleId]
      }else{
        that.isEdit = false
      }
      //console.log('dd',value);
    }
  }
};
</script>
