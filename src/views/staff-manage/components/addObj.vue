<template>
  <Modal v-model="isShow" width=631 :title='title' @on-ok="ok_fn" @on-cancel="cancel_fn">
    <Form ref="form" :model="form" :rules="rule" :label-width="100">
      <FormItem label="职称" prop="name">
        <Input v-model="form.name" placeholder="职称" style="width:200px;"></Input>
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
      isedit: false,
      title: '添加职称',
      isShow: this.visible,
      form: {
        name: ''
      },
      rule: {
        name: [{
          required: true,
          message: '职位名称不能为空',
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
          //console.log('ok_fn',this.form.name);
        this.$refs['form'].validate((valid) => {
          if (valid) {
            //that.$Spin.show();
            this.$emit('okAdd', this.form.name)
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
        this.form.name = value.name
        if (value.name) {
          this.isedit = true;
          this.title = '修改职称'
        } else {
          this.isedit = false;
          this.title = '添加职称'
        }

      }
  }
};
</script>
