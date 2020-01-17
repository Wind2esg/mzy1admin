<template>
  <Modal v-model="isShow" width=631 :title='title' @on-ok="ok_fn" @on-cancel="cancel_fn">
    <Form ref="form" :model="form" :rules="rule" :label-width="100">
      <FormItem label="部门名称" prop="name">
        <Input v-model="form.name" placeholder="部门名称" style="width:200px;"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editData: Object
  },
  components: {

  },
  data() {
    return {
      Id:0,
      title: '添加部门',
      isEdit:false,
      isShow: this.visible,
      form: {
        name: ''
      },
      rule: {
        name: [{
          required: true,
          message: '部门名称不能为空',
          trigger: 'blur'
        }],
      }
    }
  },
  methods: {
    handleSuccess() {

      },
      ok_fn() {
        let that = this

        this.$refs['form'].validate((valid) => {
            if (valid) {
              this.$emit('okAdd', that.form.name)
            } else {
              that.$Message.error('提交失败');
            }
          })
      },
      cancel_fn() {
        this.$refs.form.resetFields();
        this.$emit('cancelAdd')
      }
  },
  watch: {
    visible(value) {
        this.isShow = value;
      },
      editData(value) {
       
        this.form.name = value.departmentName

        if (value.departmentName) {
          this.title = '修改部门'
          this.isEdit = true
          this.Id = value.id
        } else {
          this.title = '添加部门'
          this.isEdit = false
          this.Id = 0
        }
      }
  }
};
</script>
