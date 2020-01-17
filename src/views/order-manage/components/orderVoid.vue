<style lang="less">
</style>
<template>
  <div class="model_page">
    <Modal v-model="isModalShow" width=420 title='作废原因' @on-cancel="Modal_cencel" class="modal_warp allDetails_model">
      <Form ref="formVeto" :model="formVeto" :rules="ruleVeto">
        <FormItem prop="reason">
          <Input type="textarea" v-model="formVeto.reason" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入原因"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="Modal_cencel">取消</Button>
        <Button :loading="save_loading" type="primary" size="large" @click="Modal_ok" >确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>


let that
export default {
  props: {
    orderNo: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
  },
  created(){
    that = this;
  },
  data() {
    return {
      isModalShow:false,
      loading:true,
      save_loading:false,
      formVeto:{},
      ruleVeto:{
        reason:[{ required: true, message: '请输入原因', trigger: 'blur'}]
      }
    }
  },
  methods: {
    //表单提交
    Modal_ok() {
      this.$refs['formVeto'].validate((valid) =>{
        if(valid){
          let that = this
          let requedata = {
            DestoryReason:that.formVeto.reason,
            OrderNo:that.orderNo
          };

          that.save_loading = true
          return that.$request(this.$api.OrderDestory, requedata, data => {
            that.save_loading = false
            if(data.isSuccess){
              that.$emit('modal-ok')
              if(data.message) that.$Message.success(data.message);
            }else if(data.message) that.$Message.error(data.message);
          },()=>{
            that.save_loading = false
          })
        }else{
          this.$Message.error('操作失败');
        }
      })
    },

    //对话框取消
    Modal_cencel(){
      this.$refs.formVeto.resetFields();
      return this.$emit('modal-cancel')
    }
  },
  watch: {
    visible(value){
      this.isModalShow = value
      if(value){
        this.formVeto = {}
      }
    }
  }
};
</script>
