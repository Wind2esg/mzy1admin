<style lang="less">

.allDetails_model{
  font-size: ;
  .goods_row{
    border-bottom: 1px dashed #eee;
    margin: 0;
    padding: 10px 0;
  }
  .ivu-form-item-label{
    font-weight: bold;
  }
  .allDetails_from{
    font-size: 12px;
  }
  .model_CardWarp_Bottom{
    margin-top: 28px;
  }
  .logistics_wraper{
    margin-left: 20px;
  }
}
</style>
<template>
  <div class="model_page">
    <Modal v-model="isModalShow" width=600 title='物流信息' @on-cancel="Modal_cencel" class="modal_warp allDetails_model">
      <div class="model_CardWarp logistics_wraper">
        <Form :label-width="100" class="allDetails_from">
          <FormItem label="物流公司" class="goods_row">{{apidata.expressCompany}}</FormItem>
          <FormItem label="物流单号" class="goods_row">{{apidata.expressNo}}</FormItem>
          <FormItem label="物流详情" class="goods_row" >
            
            <Steps :current="traces.length-1" direction="vertical" v-if="traces.length>0">
                <Step :title="item.acceptTime" :content="item.acceptStation" v-for="(item,idx) in traces" :key="idx"></Step>
            </Steps>
            <span v-if="traces.length<=0">暂无物流信息</span>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="Modal_cencel">关闭</Button>
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
      apidata: {},
      traces:[]
    }
  },
  methods: {
    //表单提交
    Modal_ok() {
    },

    //列表
    GetList(callback){
      let requedata = {
        PageIndex:that.pageIndex,
        Take:that.pageSize,
        OrderNo:that.orderNo
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.GetExpressInfo, requedata, data => {
        //console.log(data.traces);
        if(data.message) that.$Message.info(data.message);
        that.apidata = data.result

        let traces = data.result.orderExpressList || []

        if(!traces[0].ErrorCode){
          that.traces = traces
        }

        return callback && callback()
      })
    },

    //对话框取消
    Modal_cencel(){
      return this.$emit('modal-cancel')
    }
  },
  watch: {
    visible(value){
      this.isModalShow = value
      if(value){
        that.traces = []
        that.apidata = {}
        return that.GetList()
      }
    }
  }
};
</script>
