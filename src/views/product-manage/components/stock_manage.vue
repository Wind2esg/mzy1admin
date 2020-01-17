<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}

</style>
<template>
<Modal v-model="isShow" width=400 title='库存管理' @on-cancel="Modal_cencel" class="agent_modalwarp">
    <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100" class="Modal_from">
      <FormItem prop="ChangeNum" label="改变库存">
        <Input v-model="formInfo.ChangeNum" number class="fromInput"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button size="large" @click="Modal_cencel">取消</Button>
      <Button :loading="save_loading" type="primary" size="large" @click="Modal_ok" >确定</Button>
    </div>
  </Modal>

</template>
<script>

let  that
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    memberId:Number,
    stockType:Number
  },
  components: {

  },
  data() {
    const changeNumCheck = (rule, value, callback)=>{
      //console.log(/^(-?\d+)(\.\d{1,2})?$/.test(value));
      if (!(/^(-?\d+)(\.\d{1})?$/.test(value))) {
        callback(new Error('请输入一位小数'));
      } else if(value<=0){
        callback(new Error('请输入库存数量'));
      }else {
        callback();
      }
    }

    return {
      save_loading:false,
      formInfo:{ChangeNum:0},
      ruleInfo:{
        ChangeNum: [{
          required: true,
          validator: changeNumCheck,
          trigger: 'change'
        }]
      },
      isShow: this.visible,
    }
  },
  created() {
    that = this
    //console.log(this.MemberId);
  },
  methods: {
    //列表
    GetList(callback){
      let requedata = {
        Id:that.memberId,
        ChangeType:that.stockType,
        ChangeNum :that.formInfo.ChangeNum
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.changeProductStock, requedata, data => {
        return callback && callback(data)
      })
    },
    //表单提交
    Modal_ok() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          //that.$emit('modal-ok')
          that.save_loading = true
          return that.GetList(data => {
            that.save_loading = false
            if(data.isSuccess){
              that.$emit('modal-ok')
            }else if(data.message) that.$Message.error(data.message);
              else that.$Message.error('提交失败');
          })
        } else {
          this.$Message.error('提交失败');
        }
      })
    },

    //对话框取消
    Modal_cencel(){
      this.$refs.formInfo.resetFields();
      return this.$emit('modal-cancel')
    }
  },
  watch: {
    visible(value) {
      this.isShow = value;
      this.formInfo.ChangeNum = 0
    }
  }
};
</script>
