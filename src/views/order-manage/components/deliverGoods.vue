<style lang="less">

  .finance_modal{
    .fromInput {
      width: 250px;
    }
  }

</style>
<template>
<div class="agent_warper">
  <Modal v-model="isShow" width=460 title='发货' @on-cancel="Modal_cencel" class="finance_modal">
    <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100" class="Modal_from">
      <FormItem label="物流公司：">
        <Select v-model="formInfo.expressVal" class="fromInput" placeholder="选择物流" >
          <Option v-for="(item,index) in allExpress" :value="index" :key="index">{{ item.expressName }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="experssNo" label="快递单号：">
        <Input v-model="formInfo.experssNo" class="fromInput"></Input>
      </FormItem>
    </Form>
      
    <div slot="footer">
      <Button size="large" @click="Modal_cencel">取消</Button>
      <Button type="primary" size="large" :loading="save_loading" @click="Modal_ok" >确认</Button>
    </div>
  </Modal>
  
</div>

</template>
<script>
import utils            from '@/libs/util';

let that
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderNo:String
  },
  components: {
  },
  data() {
    return {
      formInfo:{},
      allExpress:[],
      save_loading:false,
      ruleInfo:{
        experssNo: [{ required: true, message: '请输入快递单号', trigger: 'blur'}],
        expressVal:[{ required: true, message: '请选择物流', trigger: 'change'}]
      },
      BigPic_model:false,
      BigPic_url:'http://img.xsmore.com/zmws/ImgPay/fdba74c9-7090-48e9-aa75-2de94e8a47bb.png',
      veto_model:false,
      isedit: false,
      isShow: this.visible,
    }
  },
  created() {
    that = this

    return utils.getAllExpress(that,data => {
      that.allExpress  = data
    })
  },
  methods: {
    Modal_cencel() {
      this.$refs.formInfo.resetFields();
      this.$emit('modal-cancel')
    },
    //否决确定
    Modal_ok(){
      this.$refs['formInfo'].validate((valid) =>{
        if(valid){
          let formInfo = that.formInfo
          
          if(typeof(formInfo.expressVal) !== 'undefined'){
            let curExpress = that.allExpress[formInfo.expressVal]
            //console.log(curExpress);
            let requedata = {
              ExperssNo:formInfo.experssNo,
              OrderNo:that.orderNo,
              ExpressValue:curExpress.expressName,
              ExpressId:curExpress.id
            };

            that.save_loading = true
            return that.$request('memberOrderSend', requedata, data => {
              that.save_loading = false
              if(data.isSuccess){
                let message = data.message || '操作成功'

                that.$refs.formInfo.resetFields();
                that.$Message.success(message);
                that.$emit('modal-ok')
              }else {
                let message = data.message || '操作失败'
                that.$Message.error(message);
              }
            },()=>{
              that.save_loading = false
            })
          }else{
            return that.$Notice.warning({
              title: '提示',
              desc: '请选择物流'
            });
          }
        }else{
          this.$Message.error('操作失败');
        }
      })
    },
  },
  watch: {
    visible(value) {
      //console.log(this.memberId);
      this.isShow = value;
      if(value) this.formInfo = {}
    }
  }
};
</script>
