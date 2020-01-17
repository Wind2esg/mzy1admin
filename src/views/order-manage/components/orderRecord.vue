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
  .page_wraper{
    margin-top: 24px;
    overflow: hidden;
  }
  .pages{
    float: right;
  }
}
</style>
<template>
  <div class="model_page">
    <Modal v-model="isModalShow" width=900 title='订单记录' @on-cancel="Modal_cencel" class="modal_warp allDetails_model">
      <div class="model_CardWarp">
        <div class="table-wraper">
          <Table ref="selection" :loading="loading" :columns="columns" :data="apidata" size="small"></Table>
        </div>
        <div class="page_wraper" v-if="total>pageSize">
          <Page :total="total" :page-size="pageSize" :current="pageIndex" show-total  @on-change="pageChange" class="pages"></Page>
        </div>
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
      total: 100,
      loading:true,
      pageSize: 10,
      pageIndex: 1,
      apidata: [],
      columns: [
        {
          title: '操作时间',
          key: 'operatorTime',
          width:155,
          align: 'center',
        },{
          title: '操作人',
          key: 'operatorName',
          align: 'center',
        },{
          title: '操作人电话',
          width:120,
          key: 'operatorPhone',
          align: 'center',
        },
        // {
        //   title: '操作类型',
        //   key: 'recordTypeShow',
        //   align: 'center',
        // },
        {
          title: '订单状态',
          key: 'orderStateValue',
          align: 'center',
        },{
          title: '备注',
          key: 'remark',
          align: 'center',
        },{
          title: 'IP',
          key: 'ipAddress',
          width: 130,
          align: 'center',
        },
      ]
    }
  },
  methods: {
    //表单提交
    Modal_ok() {
    },

    pageChange(value) {
      this.pageIndex = value;
      that.loading = true
      return that.GetList()
    },

    //列表
    GetList(callback){
      let requedata = {
        PageIndex:that.pageIndex,
        PageSize:that.pageSize,
        OrderNo:that.orderNo
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.GetOrderRecordList, requedata, data => {
        //console.log(data.length);
        that.total = data.result.totalCount || 0;
        that.apidata = data.result.resultList || [];
        that.loading = false;
        return callback && callback()
      })
    },
    //恢复数据
    recoveryData(callback){
      that.total = 0
      that.loading = true
      //that.apidata = []
      that.pageIndex = 1
      return callback && callback()
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
        return that.recoveryData(that.GetList)
      }
    }
  }
};
</script>
