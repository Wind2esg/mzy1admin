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
}
</style>
<template>
  <div class="model_page">
    <Modal v-model="isModalShow" width=820 title='交易详情' @on-cancel="Modal_cencel" class="modal_warp allDetails_model" >
      <div class="model_CardWarp">
        <Row class="model_CardWarp_Top">
          <Col span="12" class="allDetails_model_goods" style="padding-right:14px;">
            <Card class="allDetails_goodsCard">
              <p slot="title">收货信息</p>
              <Form :label-width="100" class="allDetails_from">
                <FormItem label="收货人" class="goods_row">{{OrderInfo.receiveName}}</FormItem>
                <FormItem label="手机号" class="goods_row">{{OrderInfo.receivePhone}}</FormItem>
                <FormItem label="收货地址" class="goods_row">{{OrderInfo.receiveAddress}}</FormItem>
                <FormItem label="备注"  class="goods_row">{{OrderInfo.orderRemark}}</FormItem>
              </Form>
            </Card>
          </Col>
          <Col span="12" class="allDetails_model_goods" style="padding-left:14px;">
            <Card class="allDetails_goodsCard">
              <p slot="title">订单信息</p>
              <Form :label-width="100" class="allDetails_from">
                <FormItem label="订单编号" class="goods_row">{{OrderInfo.orderNo}}</FormItem>
                <FormItem label="订单金额" class="goods_row">{{OrderInfo.orderPrice}}</FormItem>
                <FormItem label="下单人" class="goods_row">{{OrderInfo.memberName}}</FormItem>
                <FormItem label="下单人电话" class="goods_row">{{OrderInfo.memberPhone }}</FormItem>
                <FormItem label="下单时间" class="goods_row">{{OrderInfo.payTime}}</FormItem>
                <FormItem label="订单状态" class="goods_row">{{OrderInfo.orderStateValue}}</FormItem>

              </Form>
            </Card>
          </Col>

        </Row>

        <Row class="model_CardWarp_Bottom">
          <Card class="allDetails_goodsCard">
            <p slot="title">商品信息</p>
            <Table ref="selection" :columns="columns" :data="OrderInfo.orderDetails" size="small"></Table>
          </Card>
        </Row>
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
      isEdit:false,
      OrderNo:'',
      ReceiveInfo: {},
      OrderInfo: {},
      columns: [
        {
          title: '商品名称',
          key: 'productName',
          align: 'center',
        },{
          title: '商品规格',
          key: 'specValue',
          align: 'center',
        },{
          title: '商品数量',
          key: 'productCount',
          align: 'center',
        },{
          title: '商品单价',
          key: 'productPrice',
          align: 'center',
        },
      ]
    }
  },
  methods: {
    //表单提交
    Modal_ok() {
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
        let requedata = {
          OrderNo:that.orderNo
        };
        return that.$request(this.$api.OrderDetailsInfo, requedata, data => {
          //console.log(data);
          if (!data.isSuccess){
            this.$Message.error(data.message);
            that.OrderInfo = {};
          }else{
            that.OrderInfo = data.result || {}
          }
          
        })
      }
    }
  }
};
</script>
