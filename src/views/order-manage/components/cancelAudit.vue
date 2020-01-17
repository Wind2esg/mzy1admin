<style lang="less">

.modal_warp{
  .fromInput {
    width: 300px;
  }
  .Selectbox {
    width: 300px;
    /* vertical-align: middle; */
  }
}
</style>
<template>
  <div class="model_page">
    <Modal v-model="isModalShow" width=580 title='取消订单审核' @on-cancel="Modal_cencel" class="modal_warp">
      <div class="staff_from">
        <Form :label-width="100" ref="formInfo" :model="formInfo" :rules="rule" class="allDetails_from">
          <FormItem label="取消原因" class="goods_row" v-if="formInfo.cancelReason">{{order.cancelReason}}</FormItem>
          <FormItem label="审核结果" class="goods_row" prop="gender">
            <RadioGroup v-model="formInfo.gender">
                <Radio label="yes">通过申请</Radio>
                <Radio label="no">撤销申请</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="撤销申请原因" class="goods_row" v-if="formInfo.gender=='no'">
            <Input v-model="formInfo.applyReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="撤销申请原因" class="fromInput"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="Modal_cencel">取消</Button>
        <Button type="primary" :loading="save_loading" size="large" @click="Modal_ok" >确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

let that
export default {
  props: {
    order: {
        type: Object,
        default: ()=>{
            return {}
        }
    },
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
      save_loading:false,
      isModalShow:false,
      OrderNo:{},
      formInfo: {
        cancelReason:'',
        gender:'no',
        applyReason:'', //申请原因
      },
      rule: {
        applyReason:[{
          required: true,
          message: '请填写撤销申请原因',
          trigger: 'blur'
        }],
        gender:[{required: true, message: '请选择结果', trigger: 'change'}]
      }
    }
  },
  methods: {
    init(){
      that.formInfo = {
        cancelReason: this.order.cancelReason,
        applyReason:'', //申请原因
        gender:'no',
      }
      // let requedata = {
      //   OrderNo:that.orderNo
      // };
      // return that.$request('memberOrderCancelReason', requedata, data => {
      //   that.formInfo.cancelReason = data.cancelReason || ''
      //   if(data.message) that.$Message.error(data.message);
      //   /*if(data.isSuccess){
      //     return that.recoveryData(that.GetList)
      //     if(data.message) that.$Message.success(data.message);
      //   }else if(data.message) that.$Message.error(data.message);*/
      // })
    },
    //表单提交
    Modal_ok() {
      if(that.formInfo.gender==='no'&&!that.formInfo.applyReason){
        return that.$Notice.error({
          title: '错误',
          desc: '请填写撤销申请原因',
          duration:2, //自动关闭的延时，单位秒，不关闭可以写 0
        });
      }
      return that.$refs['formInfo'].validate((valid) => {
        console.log('valid',valid,that.formInfo);
        if (valid) {
          //that.$refs.formInfo.resetFields();
          let formInfo = that.formInfo;
          let requedata = {
              OrderNo:that.order.orderNo,
          };
          
          if(formInfo.gender==='yes'){
              requedata.CheckState = true;
          }else if(formInfo.gender==='no'){
              requedata.CheckState = false;
              requedata.RejectReason = that.formInfo.applyReason;
          }

          return that.$request(this.$api.OrderCancel, requedata, data => {
              if(data.isSuccess){
                if(data.message) that.$Message.success(data.message);
                return this.$emit('modal-ok')
              }else if(data.message) that.$Message.error(data.message);
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
    visible(value){
      this.isModalShow = value
      //console.log('OrderNo',that.orderNo);
      if(value){
        return that.init();
      }
    }
  }
};
</script>
