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
  .ivu-upload-select{
    display: block;
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


.numbers-box{
   .ordernumber-box{
    position:absolute;
    top:40%;
    left:50%;
    transform:translate(-50%,-50%);
    -webkit-transform:translate(-50%,-50%);
    width:330px;
    height:150px;
    border:1px solid #ccc;
    border-radius:5px;
    background:#fff;
    padding:30px;
     z-index:100;
    .buttons{
      text-align:center;
      margin:20px 30px;
    }

    .sureButton{
      float:right;
    }

  }

  .masking-boxs{
      position:fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background:rgba(0,0,0,0.5);
      z-index:100;
  }

}


</style>
<template>
  <Card class="agent_information intention-apply">
    <div class="manage_box">
      <div class="search">
        <Input v-model="keywords" placeholder="关键字" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
        <select-type class="selectType" :typeVal="ApplyState" :typeList="ApplyStateList" @selectChange="ApplyState_Change"></select-type>
        <Select v-model="RoleVal" class="selectType" placeholder="选择下单等级">
          <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
        </Select>
        <Select v-model="orderType" class="selectType" placeholder="选择订单类型">
          <Option value="0">正常订单</Option>
          <Option value="1">礼包订单</Option>
          <Option value="2">客户正常单</Option>
          <Option value="3">客户礼包单</Option>
        </Select>
        
        <Select v-model="expressType" class="selectType" placeholder="选择快递类型">
          <Option v-for="(item,index) in expressList" :value="item.expressCompanyNo" :key="index">{{ item.expressCompanyName }}</Option>
        </Select>

        <date-apply  placeholder="下单时间" @dateChange="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="search_click">搜索</Button>
          <Button type="success" @click="exportDocument_click" icon="document-text">导出</Button>
          <Button type="info" @click="Batch_Verification" icon="checkmark" v-if="ApplyState==0">批量审单</Button>
          <Dropdown v-if="ApplyState==2" trigger="click" @on-click="moreState_chage">
            <Button type="info">
                更多
                <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem name="导出">导出发货</DropdownItem>
                <DropdownItem name="导入">
                  <Upload 
                    :action="$api.uploadImage"
                    :data = "importData"
                    :show-upload-list="false"
                    :on-success="handleSuccess">
                    <div>导入发货</div>
                  </Upload>
                </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="table-wraper">
        <Table ref="selection" :loading="loading" :columns="columns" :data="apidata" size="small" @on-selection-change="selection_change" :highlight-row="true"  ></Table>
      </div>
      <Page :total="total" @on-change="pageChange" :page-size="pageSize" :current="pageIndex" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>
    </div>
    
    <!-- 修改地址 -->
    <revise-address :visible="reviseAddress_visible" :orderNo="orderNo" @modal-cancel="reviseAddress_cancel" @modal-ok="reviseAddress_ok"></revise-address>

    <!-- 取消订单审核 -->
    <cancel-audit :visible="cancelAudit_visible" :order="orderData" @modal-cancel="cancelAudit_cancel" @modal-ok="cancelAudit_ok"></cancel-audit>

    <!-- 交易详情 -->
    <all-details :visible="allDetails_visible" :orderNo="orderNo" @modal-cancel="allDetails_cancel"></all-details>
    
    <!-- 订单作废 -->
    <order-void :visible="orderVoid_visible" :orderNo="orderNo" @modal-cancel="orderVoid_visible=false" @modal-ok="orderVoid_ok"></order-void>

    <!-- 发货 -->
    <!-- <deliver-goods :visible="goods_visible" :orderNo="orderNo" @modal-cancel="goods_visible=false" @modal-ok="goods_ok"></deliver-goods> -->
    

    <!-- 拆单 -->
    <separate-order :visible="visibleSeparate" :orderNo="orderNo" @cancel="separateCancel"></separate-order>
    
    <!-- 审单 -->
    <edit-pda :visible="visiblePda" :orderList="orderNoList" @cancel="pdaCancel"></edit-pda>



    <!-- 上传文件 -->
    <!-- <Upload 
      :action="importUrl"
      ref="inputFile"
      :on-success="handleSuccess">
        <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload> -->
    <!-- <form name="fileInfo">
      <input type="file" name="inputFile" accept=".xls" ref="inputFile" @change="inputFile_change" style="display:none">
    </form> -->
  </Card>
</template>
<script>
import selectType             from '@/views/components/selectType';
import dateApply              from '@/views/components/dateApply';
import reviseAddress          from './components/ReviseAddress';  //修改地址
import cancelAudit            from './components/cancelAudit';    //取消订单审核
import allDetails             from './components/allDetails';     //交易详情
import orderVoid              from './components/orderVoid';      //订单作废
// import deliverGoods           from './components/deliverGoods';      //订单发货

import separateOrder from './components/separate-order'; //拆单
import editPda from './components/edit-pda';
/*document.getElementById("inputFile").onclick = function(files) {
  console.log(files);
}*/
import util from '@/libs/util.js';
let that;


const styles = {
            display: 'inline-block',
            color: '#2d8cf0',
            textDecoration: 'underline',
            marginRight:'10px',
            cursor: 'pointer'
        };

export default {
  components: {
    selectType,
    dateApply,
    reviseAddress,
    cancelAudit,
    allDetails,
    orderVoid,
    // deliverGoods,
    separateOrder,
    editPda
  },
  mounted(){

  },
  created() {
    that = this;

    if(that.$store.state.user.RoleList.length>0){
      that.RoleList = that.$store.state.user.RoleList
    }else{
      //console.log('getRoleList',that.$store.state.user.RoleList.length);
      that.$request(this.$api.getMemberRoleList, {}, data => {
        that.RoleList  = data.result || [] //代理等级
        that.$store.state.user.RoleList = that.RoleList
      })
    }

    that.importUrl  = this.$api.ExportPendingOrderList;
    util.getEmployeeInfo(that,data => {
      //console.log(data);
      that.importData = {
        BrandId:data.brandId,
        EmployeeId:data.employeeId,
      }
    });

    this.getExpressList();

    return that.GetList();
  },
  data() {
    return {
      importUrl:'',
      importData:{},
      orderNo: '' ,
      orderData: {},
      goods_visible:false,
      orderVoid_visible:false,
      allDetails_visible:false,
      reviseAddress_visible:false,
      cancelAudit_visible:false,
      visibleSeparate: false,
      visiblePda: false,
      modelData:{},    
      orderNoList:[],
      expressList: [],
      expressType: 0,
      MemberId:0,
      loading:true,
      moreState:'',
      ApplyState:'0',
      orderType: '',
      orderNum:'',
      alertBos:false,
      exportNum:'',
      OrderNos:'',
      selectArray:[],
      newOrder:[],
      ApplyStateList:[   //订单状态
        {
          value: '0',
          label: '待发货'
        },{
          value: '3',
          label: '已审单'
        },{
          value: '4',
          label: '申请取消'
        }
      ],
      RoleList:[],
      RoleVal :'',
      keywords: '',
      StartTime:'',
      EndTime:'',
      total: 0,
      pageSize: 15,
      pageIndex: 1,

      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
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
          key: 'orderProduct',
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
        },{
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
          width:320,
          render(h, params, index) {
            let arr = [];

            //params.row.orderState = 2;
            let list = (params.row.orderProductCount+'').split(';');
            let isMaxOne = false;
            list.map(item=>{
              if (+item > 1){
                isMaxOne = true;
              }
            })

            if (params.row.orderState === 0){      
                arr.push(h('span', {
                        style: styles,
                        on: {
                            click: ()=>{
                                that.handleRender(params.row);
                            }
                        }
                    }, '发货'))

                if (isMaxOne){
                  arr.push(h('span', {
                        style: styles,
                        on:{
                            click: ()=>{
                                that.handleSeparate(params.row);
                            }
                        }
                    }, '拆单'))
                }

                arr.push(h('span', {
                        style: styles,
                        on: {
                            click: ()=>{
                                that.reviseAddress_btn(params.row)
                            }
                        }
                    }, '修改收货信息'))

                arr.push(h('span', {
                        style: styles,
                        on: {
                            click: ()=>{
                                that.handlePda(params.row);
                            }
                        }
                    }, '审单'))

            }else if (params.row.orderState == 4){
                arr = [
                    h('span', {
                        style: styles,
                        on:{
                            click: ()=>{
                                that.cancelAudit_btn(params.row);
                            }
                        }
                    }, '审核取消')
                ];
            }else if(params.row.orderState==3){

                   arr.push(h('span', {
                        style: styles,
                        on: {
                            click: ()=>{
                                that.handleRender(params.row);
                            }
                        }
                    }, '发货'))

                   arr.push(h('span', {
                        style: styles,
                        on: {
                            click: ()=>{
                                that.handleRender(params.row);
                            }
                        }
                    }, '确认收货'))
              }    

            arr.push([
                h('span', {
                    style: styles,
                    on:{
                        click: ()=>{
                            that.allDetails_btn(params.row);
                        }
                    }
                }, '查看交易详情')
            ])

            return h('div', {
                style:{
                    textAlign:"center"
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
    handleSuccess(res, file){
      if(res.isSuccess){

        let requedata = {
          DownloadGuid:res.message
        };
        
        let url = that.ajaxUrl + that.getApiUrl('inPortSendOrderExcelResult')
        let initUrl = url
        for(let key in requedata){
          if(requedata[key]) {
            if(url===initUrl) url += '?'+key+'='+requedata[key]
              else url += '&'+key+'='+requedata[key]
          }
        }
        //console.log(url);
        location.href = url
      }else{
        let msg = res.message || '上传出错'
        that.$Message.error(msg);
      }
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
        keywords:that.keywords,
        OrderState:that.ApplyState || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime,
        RoleId:that.RoleVal || '',
        OrderType: that.orderType || '',
        PageIndex:that.pageIndex,
        PageSize:that.pageSize,
        ExpressCompanyNo: this.expressType,
        OrderNoList:this.newOrder || ''
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
      console.log(url);
      location.href = url
    },

    

    //列表
    GetList(){
      let requedata = {
        keywords:that.keywords,
        OrderState:that.ApplyState || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime,
        RoleId:that.RoleVal || '',
        OrderType: that.orderType || '',
        PageIndex:that.pageIndex,
        PageSize:that.pageSize,
        ExpressCompanyNo: this.expressType
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.PendingOrderList, requedata, data => {
        that.total = data.result.totalCount || 0
        that.apidata = data.result.resultList || []
        that.loading = false
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
    },

    //授权状态
    ApplyState_Change(val){
      //console.log(val);
      that.ApplyState = val
    },

    edit_cancel(){
      that.editVisible = false
    },

    handleSeparate(record){
        that.orderNo = record.orderNo
        this.visibleSeparate = true;
    },
    separateCancel(){
        this.visibleSeparate = false;
        this.GetList();
    },

    handlePda(record){
        this.orderNoList = [record.orderNo];
        this.visiblePda = true;
    },
    pdaCancel(){
        this.visiblePda = false;
        this.GetList();
    },

    //批量审单
    Batch_Verification(){
      if(that.orderNoList.length>0) {

        this.visiblePda = true;
        // that.$Spin.show()

        // let requedata = {
        //   OrderNoList:that.orderNoList
        // };
        // return that.$request('memberOrderCheck', requedata, data => {
        //   that.$Spin.hide()
        //   if(data.isSuccess){
        //     that.orderNoList = [];
        //     if(data.message) that.$Message.success(data.message);
        //     return that.recoveryData(that.GetList)
        //   }else if(data.message) that.$Message.error(data.message);
        // },()=>{
        //   that.$Spin.hide()
        // })
      }else{
        return that.$Notice.warning({
          title: '提示',
          desc: '请选择订单'
        });
      }
      
    },
    //订单选择
    selection_change(selection){
      this.selectArray=selection;
      if(selection.length>0){        
        that.orderNoList = selection.map((el, ix) => {
          return el.orderNo;
        })     
    
      }
    },

    //修改地址_确认
    reviseAddress_ok(){
      //console.log('确认');
      that.reviseAddress_visible = false
      return that.recoveryData(that.GetList)
      that.$Message.success('保存成功');
    },
    //修改地址_取消
    reviseAddress_cancel(){
      that.reviseAddress_visible = false
    },

    //修改地址按钮
    reviseAddress_btn(row){
      that.orderNo = row.orderNo
      that.reviseAddress_visible = true
    },

    //取消订单审核
    cancelAudit_cancel(){
      that.cancelAudit_visible = false
    },
    //取消订单_确认
    cancelAudit_ok(){
      //console.log('确认');
      that.cancelAudit_visible = false
      return that.recoveryData(that.GetList)
    },
    //修改地址按钮
    cancelAudit_btn(row){
      that.orderData = row; //'XMZ18151755008621611'
      that.cancelAudit_visible = true
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

    //订单作废
    orderVoid_ok(){
      that.orderVoid_visible = false
      return that.recoveryData(that.GetList)
    },
    orderVoid_btn(row){
      that.orderNo = row.orderNo
      that.orderVoid_visible = true
    },

    //发货
    goods_ok(){
      that.goods_visible = false
      return that.recoveryData(that.GetList)
    },
    goods_btn(row){
      that.orderNo = row.orderNo
      that.goods_visible = true
    },

    inputFile_change(event,files){
      console.log(event.target.files);
    },
    moreState_chage(name){
      if(name==='导出'){
        let url = this.$api.ExportPendingOrderList;
        location.href = url
      }else if(name==='导入'){
        console.log('导入');
        //that.$refs.inputFile.click();

      }
    },

   

      //手动发货
       handleRender (states) {
                that.exportNum='';
                this.$Modal.confirm({
                    onOk: () => {
                      that.OrderNos= states.orderNo;
                        let param={
                             OrderNo:that.OrderNos,
                             ExpressNo:that.exportNum,
                        }
                         that.$request(this.$api.PcOrderDelivery,param, data => {
                             if (data.isSuccess){
                                 that.$Message.success('发货成功!');
                                 that.GetList();
                              }else{
                                  this.$Message.error(data.message);
                              }
                        });                     
                    },
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.value,
                                autofocus: true,
                                placeholder: '请输入快递单号'
                            },
                            on: {
                                input: (val) => {
                                    that.exportNum = val;

                                }
                            }
                        })
                    }
                })
            }


  }
};
</script>
