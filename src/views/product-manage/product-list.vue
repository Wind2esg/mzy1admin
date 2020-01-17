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
.product_list{
  height: 100%;
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
    overflow: auto;
  }
  .page-wraper{
    flex: 0 0 auto;
  }
}
</style>
<template>
<div class="product_list">
  <Card class="agent_information intention-apply" v-if="!productManage_visible">
    <div class="manage_box">
      <div class="search">
        <Input v-model="keywords" placeholder="名称" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
        <Select v-model="RoleVal" class="selectType" placeholder="选择上架状态" @on-change="state_change">
          <Option v-for="(item,index) in RoleList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="search_click">搜索</Button>
          <Button type="info" @click="productManage_btn({})" icon="plus">新增</Button>
        </div>
      </div>
      <div class="table-wraper" style="max-width:1450px">
        <Table ref="selection" :loading="loading" :columns="columns" :data="apidata" size="small"></Table>
      </div>
      <div class="page-wraper">
        <Page :total="total" :page-size="pageSize" :current="pageIndex" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange" ></Page>
      </div>
    </div>
    
    <!-- 库存管理 -->
    <stock-manage :visible="stockManage_visible" :memberId="memberId" :stockType="stockManage_Type" @modal-cancel="stockManage_cancel" @modal-ok="stockManage_ok"></stock-manage>
    
  </Card>
  
  <!-- 编辑产品 -->
  <product-manage :visible="productManage_visible" :memberId="memberId"  @modal-cancel="productManage_cancel" @modal-ok="productManage_ok"></product-manage>
</div>
</template>
<script>

import stockManage         from './components/stock_manage';        //库存管理
import productManage       from './components/product_manage';      //产品管理

let that;
export default {
  components: {
    stockManage,
    productManage
  },
  created() {
    that = this;
    return that.GetList();
  },
  data() {
    return {
      memberId:0,
      isEdit:false,
      productManage_visible:false,
      stockManage_visible:false,
      stockManage_Type:0,
      loading:true,
      shelfArr:['下架','上架'],   //上下架图标
      shelfCur:0,    //上下架状态
      RoleList:[
        {value: 0,label:'全部'},
        {value: 1,label:'已上架'},
        {value: 2,label:'未上架'}
      ],
      RoleVal :1,
      keywords: '',
      total: 0,
      pageSize: 15,
      pageIndex: 1,
      columns: [
        {
          title: '排序',
          key: 'sort',
          align: 'center',
          width: 80,
          sortable: true
        },
        {
          title: '名称',
          key: 'productName',
          width: 180,
          align: 'center',
        },
        {
          title: '产品类型',
          key: 'typeValue',
          width: 100,
          align: 'center',
        },
        {
          title: '是否推荐',
          key: 'isRecommendValue',
          align: 'center',
          width: 160,
          render: (h, params) => {
              return h('div', [
                      h('i-switch', {
                          props:{
                              'value': params.row.isRecommendValue=='是'
                          },
                          on:{
                              'on-change':()=>{
                                  this.changeState(params.row);
                              }
                          }
                      })
                  ])
          }
        },
        {
          title: '零售价',
          key: 'retailPrice',
          width: 100,
          align: 'center',
        },
        {
          title: '库存',
          key: 'stock',
          width: 160,
          align: 'center',
        },
        {
          title: '销售状态',
          key: 'displayStatus',
          align: 'center',
          width: 120,
        },
        {
          title: '添加时间',
          key: 'addTime',
          width:180,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          "fixed": "right",
          width:350,
          render(row, column, index) {
            let arr = [];

            arr.push(row('Button', {
              props: {
                type: 'primary',
              },
              style: {
                marginRight: '5px',
                marginLeft: '5px',
              },
              on: {
                click() {
                  return that.productManage_btn(column.row)
                }
              }
            }, '编辑'))

            arr.push(row('Button', {
              props: {
                type: 'info',
              },
              style: {
                marginRight: '5px',
                marginLeft: '5px',
              },
              on: {
                click() {
                  return that.changeState_btn(column.row)
                }
              }
            }, column.row.isDisplay?'下架':'上架'))

            arr.push(row('Button', {
              props: {
                type: 'primary'
              },
              style: {
                marginRight: '5px',
                marginLeft: '5px',
              },
              on: {
                click() {
                  return that.stockManage_btn(column.row,1)
                }
              }
            }, '增加库存'))

            arr.push(row('Button', {
              props: {
                type: 'primary'
              },
              style: {
                marginRight: '5px',
                marginLeft: '5px',
              },
              on: {
                click() {
                  return that.stockManage_btn(column.row,-1)
                }
              }
            }, '减少库存'))

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
    pageChange(value) {
      this.pageIndex = value;
      that.loading = true
      return that.GetList()
    },
    pageSizeChange(value){
        this.pageSize = value;
        this.GetList();
    },

    //列表
    GetList(callback){
      let requedata = {
        indexPage:that.pageIndex,
        Take:that.pageSize,
        keywords:that.keywords,
        State:that.RoleVal || 0,
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.getProductList, requedata, data => {
        that.total = data.key || 0
        that.apidata = data.value || []
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

    //上下架产品
    changeState_btn(row){
      let requedata = {Id:row.id};

      return that.$request(this.$api.changeProductState, requedata, data => {
        if(data.isSuccess){
          if(data.message) that.$Message.success(data.message);
          return that.recoveryData(that.GetList)
        }else if(data.message) that.$Message.error(data.message);
      })
    },

    state_change(value){
      //console.log(value);
    },

    //新增产品
    add_click(){

    },
    changeState(record){

        const params = {
            ProductId: record.id
        }

        this.$request(this.$api.SetProductRecommendState, params, data=>{
            if (!data.isSuccess){
                this.$Message.error(data.message);
            }
            setTimeout(this.getData, 200)
        })

    },

    //库存管理_取消
    stockManage_cancel(){
      that.stockManage_visible = false
    },
    //库存管理_确认
    stockManage_ok(){
      that.stockManage_visible = false
      that.$Message.success('更新成功');
      return that.recoveryData(that.GetList)
    },
    //库存管理按钮
    stockManage_btn(row,changeType){
      that.stockManage_Type = changeType
      that.memberId = row.id
      that.stockManage_visible = true
    },

    // 编辑产品
    productManage_ok(){
      console.log('编辑产品成功');
      that.productManage_visible = false
      that.$Message.success('保存成功');
      return that.recoveryData(that.GetList)
    },
    productManage_cancel(){
      that.productManage_visible = false
    },
    productManage_btn(row){
      that.memberId = row.id || 0
      that.isEdit = (row.id) ? true : false
      that.productManage_visible = true
    },
    
  }
};
</script>
