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
      <FormItem label="所属部门" prop="departSelect">
        <Select v-model="formInfo.departSelect"  @on-change="stateChange" class="Selectbox">
          <Option v-for="(item,index) in departData" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="职位" prop="jobSelect">
        <Select v-model="formInfo.jobSelect"  @on-change="jobChange" class="Selectbox">
          <Option v-for="(item,index) in jobData" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <!-- <FormItem label="登入密码" prop="Password">
        <Input type="password" v-model="formInfo.Password" placeholder="登入密码" class="fromInput"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="PasswdCheck">
        <Input type="password" v-model="formInfo.PasswdCheck" placeholder="确认密码" class="fromInput"></Input>
      </FormItem> -->
      <FormItem>
        <Button style="margin-right: 10px;" @click="cancel">返回</Button>
        <Button type="primary" @click="handleSubmit('formInfo')">保存</Button>
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
        that.$store.state.user.RoleList = AndRoleList
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
      formInfo: {
        Name: '',
        Phone: "",
        departSelect: '',
        jobSelect: '',
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
        departSelect: [{
          required: true,
          message: '请选择所属部门',
          trigger: 'change'
        }],
        jobSelect: [{
          required: true,
          message: '请选择职位',
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
            console.log(this.formInfo);
            this.$Message.success('保存成功');
          } else {
            this.$Message.error('提交失败');
          }
        })
      }
  }
};
</script>
