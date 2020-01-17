<style lang="less">
.btn-wraper {
  display: inline-block;
  width: 290px;
  vertical-align: top;
}

.intention-apply {
  height: 100%;
  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .table-wraper {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.ivu-table .demo-table-info-row td {
  background-color: #fafbfc;
}
.agent_information{
  .selectType{
    width:140px;
    vertical-align:top;
    margin-right: 12px;
  }
}
.manage_box{
  height: 100%;
  display: flex;
  flex-direction: column;

  .search{
    flex: 0 0 auto;
  }
  .table-wraper{
    flex: 1 1 auto;
    height: 100%;
    overflow: auto;
  }
  .page-wraper{
    flex: 0 0 auto;
  }
}
</style>
<template>
  <Card class="agent_information intention-apply">
    <div class="manage_box">
      <div class="search">
        <Input v-model="keywords" placeholder="关键字" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
        <select-type class="selectType" :typeVal="ApplyState" :typeList="ApplyStateList" @selectChange="ApplyState_Change"></select-type>
        
        <Select v-model="RoleVal" class="selectType"  clearable placeholder="选择下单等级">
          <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
        </Select>

        <Select v-model="orderType" clearable  class="selectType" placeholder="选择订单类型">
          <Option value="0">正常订单</Option>
          <Option value="1">礼包订单</Option>
          <Option value="2">客户正常单</Option>
          <Option value="3">客户礼包单</Option>
        </Select>

        <Select v-model="expressType" clearable  class="selectType" placeholder="选择快递类型">
          <Option v-for="(item,index) in expressList" :value="item.expressCompanyNo" :key="index">{{ item.expressCompanyName }}</Option>
        </Select>

         <Cascader :data="provinces" :render-format="format" v-model="areaVal"  @on-change="changeFun" placeholder="收货地区" style="display:inline-block;width: 200px;margin-right:10px;margin-bottom:10px;vertical-align:top"></Cascader>

        <date-apply  placeholder="下单时间" @dateChange="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="search_click">搜索</Button>
          <Button type="success" @click="exportDocument_click" icon="document-text">导出</Button>
        </div>
      </div>
      <div class="table-wraper">
        <Table :highlight-row="true" ref="selection" :loading="loading" :columns="columns" :data="apidata" size="small"   @on-selection-change="selectChange"></Table>
      </div>
      <Page :total="total" @on-change="pageChange" :page-size="pageSize" :current="pageIndex" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>
    </div>
    
    <!-- 交易详情 -->
    <all-details :visible="allDetails_visible" :orderNo="orderNo" @modal-cancel="allDetails_cancel"></all-details>
    
    <!-- 订单记录 -->
    <order-record :visible="orderRecord_visible" :orderNo="orderNo" @modal-cancel="orderRecord_cancel"></order-record>

    <!-- 物流信息 -->
    <logistics-info :visible="logisticsInfo_visible" :orderNo="orderNo" @modal-cancel="logisticsInfo_cancel"></logistics-info>
    
    <!-- 订单作废 -->
    <order-void :visible="orderVoid_visible" :orderNo="orderNo" @modal-cancel="orderVoid_visible=false" @modal-ok="orderVoid_ok"></order-void>

    <!-- 修改物流的弹框 -->

    <Modal
       v-model="modal13"
       title="修改物流">

       <p>请输入想要修改的物流单号</p>
       <Input v-model="model14"  clearable style="width: 300px;margin-top:15px;"></Input>

       <div slot="footer" style="text-align:center;">
          <Button  size="large"  type="primary"  @click="canselBtnfire" style="margin-right:20px">取消</Button>
          <Button  size="large"  type="primary"  @click="saveBtnfire">保存</Button>
       </div>

    </Modal>

  </Card>
</template>
<script>
import selectType             from '@/views/components/selectType';
import dateApply              from '@/views/components/dateApply';
import allDetails             from './components/allDetails';           //交易详情
import orderRecord            from './components/orderRecord';          //订单记录
import logisticsInfo          from '@/views/components/logisticsInfo';        //物流信息
import orderVoid              from './components/orderVoid';            //订单作废


import areaData               from '@/libs/arealist.json';

const styles = {
            display: 'inline-block',
            color: '#2d8cf0',
            textDecoration: 'underline',
            marginRight:'10px',
            cursor: 'pointer'
        };

let that;
export default {
  name: 'intention-apply',
  components: {
    selectType,
    dateApply,
    allDetails,
    orderRecord,
    logisticsInfo,
    orderVoid
  },
  mounted(){

  },
  created() {
    that = this;

    let obj={};
    let objs={};
    let obj1={};
    that.AreaData.Province.map(item=>{
     
         obj={
             value:item.value,
             label:item.label,
             children:[]
          }  
          
         
          item.children.map(record=>{
            objs={
                value:record.value,
                label:record.label,
                children:[]
            }
           
            // if(record.children){
            //     record.children.map(items=>{
            //       if(items.label.indexOf("市") != -1 && items.label.indexOf("区") == -1){
            //           obj1={
            //            value:items.value,
            //            label:items.label
            //           }
            //           objs.children.push(obj1)
            //       }
                
            //     })

            // }            

            obj.children.push(objs)
             
        })
        this.provinces.push(obj)
    })



    if(that.$store.state.user.RoleList.length>0){
      that.RoleList = that.$store.state.user.RoleList
    }else{
      //console.log('getRoleList',that.$store.state.user.RoleList.length);
      that.$request(this.$api.getMemberRoleList, {}, data => {
        that.RoleList  = data.result || [] //代理等级
        that.$store.state.user.RoleList = that.RoleList
      })
    }

    this.getExpressList();

    return that.GetList();
  },
  data() {
    return {
      orderNo:'',
      orderVoid_visible:false,
      logisticsInfo_visible:false,
      orderRecord_visible:false,
      allDetails_visible:false,
      cancelAudit_visible:false,
      modelData:{},
      MemberId:0,
      loading:true,
      ApplyState:'',
      model14:'',
      ApplyStateList:this.$store.state.user.OrderStateList,
      RoleList:[],
      modal13:false,
      RoleVal :'',
      keywords: '',
      StartTime:'',
      EndTime:'',
      orderType: '',
      total: 0,
      pageSize: 15,
      pageIndex: 1,
      areaVal: [],
      expressList: [],
      expressType: 0,
      AreaData: areaData,
      selectArray:[],
      newOrder:[],
      provinces:[],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        
        },
        {
          title: '订单号',
          key: 'orderNo',
          align: 'center',
          width:200,
        },
        {
          title: '下单日期',
          key: 'addTime',
          width:200,
          ellipsis:true,
          align: 'center'
        },
        {
          title: '下单金额',
          key: 'orderPrice',
          width:120,
          align: 'center',
        },
        {
          title: '运费',
          key: 'freight',
          width:120,
          align: 'center',
        },
        {
          title: '下单产品',
          key: 'orderProductShort',
          align: 'center',
          width:200,
        },
        {
          title: '产品数量',
          key: 'orderProductCount',
          align: 'center',
          width:120,
        },
        {
          title: '订单状态',
          key: 'orderStateValue',
          align: 'center',
          width:150,
        },
        {
          title: '订单类型',
          key: 'orderTypeValue',
          align: 'center',
          width:150,
        },
        {
          title: '下单代理',
          key: 'name',
          align: 'center',
          width:120
        },
        {
          title: '代理等级',
          key: 'roleName',
          align: 'center',
          width:120
        },
        {
          title: '代理电话',
          key: 'phone',
          align: 'center',
          width:150
        },
        {
          title: '收货人',
          key: 'receiveName',
          align: 'center',
          width:120
        },
        {
          title: '收货电话',
          key: 'receivePhone',
          align: 'center',
          width:150
        },{
          title: '收货地址',
          key: 'address',
          align: 'center',
          width:300
        },
        {
          title: '快递物流',
          key: 'expressValue',
          align: 'center',
          width:200
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center',
          width:300
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          "fixed": "right",
          width:270,
          render(row, column, index) {
            let arr = [];
            let orderState = column.row.orderStateValue;
            
            if(column.row.orderState== 1 || column.row.orderState==3 ){
                arr.push(row('span', {
                style: styles,
                on:{
                    click: ()=>{

                        that.confirmReceipt(column.row)
                    }
                }
               }, '确认收货'))
            }
            

            if(column.row.orderState== 1){
                arr.push(row('span', {
                style: styles,
                on:{
                    click: ()=>{
                        that.amendLogistics(column.row)
                    }
                }
               }, '修改物流'))
            }

            arr.push(row('span', {
                style: styles,
                on:{
                    click: ()=>{
                        that.allDetails_btn(column.row);
                    }
                }
            }, '交易详情'))

            arr.push(row('span', {
                style: styles,
                on:{
                    click: ()=>{
                        that.orderRecord_btn(column.row);
                    }
                }
            }, '订单记录'))

            if(orderState===that.ApplyStateList[0].label||orderState===that.ApplyStateList[1].label||orderState===that.ApplyStateList[4].label){

                arr.push(row('span', {
                    style: styles,
                    on:{
                        click: ()=>{
                            that.orderVoid_btn(column.row);
                        }
                    }
                }, '订单作废'))
            }
            if(orderState===that.ApplyStateList[4].label||orderState===that.ApplyStateList[5].label){
                arr.push(row('span', {
                    style: styles,
                    on:{
                        click: ()=>{
                            that.logisticsInfo_btn(column.row);
                        }
                    }
                }, '物流信息'))
            }
           
            
            return row('div', {
              style: {
                textAlign: "center"
              }
            }, arr);
          }
        }
      ],
      apidata: []
    }
  },
  methods: {
    getExpressList(){
        this.$request(this.$api.GetExpressInfoList, {}, data=>{
            this.expressList = data.result.expressTemplates;
        })

    },
    pageChange(value) {
      this.pageIndex = value;
      that.loading = true
      return that.GetList()
    },
    pageSizeChange(value){
        this.pageSize = value;
        this.GetList();
    },
    //导出文档
    exportDocument_click() {

      // 获取选中的
     this.newOrder=[];
      if(this.selectArray.length){
          this.selectArray.map(item=>{           
            this.newOrder.push(item.orderNo)
          })
      }

      let requedata = {
        keywords:that.keywords ,
        OrderState:that.ApplyState || '',
        RoleId:that.RoleVal || '',
        OrderType: that.orderType || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime,
        Province: that.areaVal[0] || '',
        City: that.areaVal[1] || '',
        Area: that.areaVal[2] || '',
        ExpressCompanyNo: this.expressType,
        OrderNoList:this.newOrder
      };
      let url = this.$api.ExportPendingOrderList;
      let initUrl = url
   
     
      //location.href = that.ajaxUrl
      for(let key in requedata){
        if(requedata[key]) {
          if(url===initUrl) url += '?'+key+'='+requedata[key]
            else url += '&'+key+'='+requedata[key]
        }
      }
      
      location.href = url
    },

    selectChange(currentRow){
      this.selectArray=currentRow;
    },

    // 修改物流
    amendLogistics(record){

       this.modal13=true;       
    },

    // 保存修改物流
    saveBtnfire(){
      if(this.model14==""){
           this.$Message.error('请输入物流单号');
           return false;
        }
       this.modal13=false;
    },
    // 取消修改物流
    canselBtnfire(){
      this.modal13=false;
    },

    //列表
    GetList(callback){

      let requedata = {
        PageIndex:that.pageIndex,
        PageSize:that.pageSize,
        keywords:that.keywords,
        OrderState:that.ApplyState || '',
        RoleId:that.RoleVal || '',
        OrderType: that.orderType || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime,
        Province: that.areaVal[0] || '',
        City: that.areaVal[1] || '',
        Area: that.areaVal[2] || '',
        ExpressCompanyNo: this.expressType
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.PendingOrderList, requedata, data => {
        that.total = data.result.totalCount || 0
        that.apidata = data.result.resultList || []
        that.loading = false
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

    //搜索
    search_click(){
      return that.recoveryData(that.GetList)
    },
    
    //时间选择
    dateChange(value){
      that.StartTime  = value[0] || ''
      that.EndTime    = value[1] || ''
      //console.log(value);
    },

    //授权状态
    ApplyState_Change(val){
      //console.log(val);
      that.ApplyState = val
    },


    //交易详情_取消
    allDetails_cancel(){
      that.allDetails_visible = false
    },
    //交易详情按钮
    allDetails_btn(row){
      that.orderNo = row.orderNo
      that.allDetails_visible = true
    },

    //订单记录_取消
    orderRecord_cancel(){
      that.orderRecord_visible = false
    },
    //订单记录按钮
    orderRecord_btn(row){
      that.orderNo = row.orderNo
      that.orderRecord_visible = true
    },

    //物流信息_取消
    logisticsInfo_cancel(){
      that.logisticsInfo_visible = false
    },
    //物流信息按钮
    logisticsInfo_btn(row){
      that.orderNo = row.orderNo
      that.logisticsInfo_visible = true
    },

    //订单作废
    orderVoid_ok(){
      that.orderVoid_visible=false
      return that.recoveryData(that.GetList)
    },
    orderVoid_btn(row){
      that.orderNo = row.orderNo;
      that.orderVoid_visible = true
    },
    format (labels, selectedData) {       
        const index = labels.length - 1;
        const data = selectedData[index] || false;
        if (data && data.code) {
            return labels[index] + ' - ' + data.code;
        }
        return labels[index];
    },

    changeFun(value,selectedData){
      selectedData.map(item=>{
         this.areaVal.push(item.label)
      })

    },

    // 确认收货
    confirmReceipt(records){
      that.$request(this.$api.PcOrderComfirmReceipt, {OrderNo:records.orderNo}, data => {
             if (data.isSuccess){
                    this.$Message.success('修改成功!');
                    that.GetList();
                }else{
                    this.$Message.error(data.message);
              }
       })
        
    },
    
  }
};
</script>
