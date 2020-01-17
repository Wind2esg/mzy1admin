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

  .tabble-big-box{
    flex: 1 1 auto;
    overflow: auto;
  }
  .page-wraper{
    flex: 0 0 auto;
  }
}

  .network-change-language{       
        width: 100%;
        background: #f0f0f0;
        padding: 20px 0 20px;       
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
        font-size: 17px;
        line-height: 30px;
        cursor: pointer;
        margin-bottom:20px;
        .change-tab{
            margin-left:30px;
            margin-right: 15px;
        }
        .change-tab-action{
            color:blue;
        }

        h1{ 
            font-size: 20px;    
            font-weight: normal;
        }
    }


</style>
<template>
<div class="product_list">
  <Card class="agent_information intention-apply" v-if="!visible">

    <div class="manage_box">

      <div class="network-change-language">

        <span v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
        </span>

      </div>

      <div class="search">
        <Input v-model="keywords" placeholder="产品名称" style="width: 200px;margin-right:10px;margin-bottom:10px;"></Input>

        <Select v-model="type" class="selectType" placeholder="所属系列" style="width:160px;" clearable>
          <Option value="" :key="-1">请选择</Option>
          <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{ item.name}}</Option> 
        </Select>

        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="getListSearch">搜索</Button>
          <Button type="info" @click="addProduct({})" icon="plus">新增</Button>
        </div>

      </div>

        <!-- 系列描述 -->
      <div class="tabble-big-box">
          <div class="table-wraper" style="max-width:1500px">
            <Table ref="selection" :loading="loading" :columns="columns" :data="data" size="small"></Table>
          </div>          
        
      </div>

     

      <div class="page-wraper">
        <Page :total="total" :page-size="pageSize" :current="pageIndex" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange" ></Page>
      </div>

    </div>

    
  </Card>
  
  <!-- 编辑产品 -->
  <product-manage :visible="visible" :typeList="typeList"  :actionIndex="actionIndex" :data="editData" @reload="getList" @cancel="cancelVisible"></product-manage>

</div>
</template>
<script>

    // import stockManage from '../product-manage/components/stock_manage.vue';
    import productManage from './components/network-addproduct.vue';

let pageIndex = 1;

export default {
    components: {
            // stockManage,
        productManage
    },
    created() {
    },
    beforeMount(){
        this.getType();
        this.getList();
    },
    data() {
        return {
            keywords: '',
            type: '',
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            typeList: [],
            loading: false,
            visible: false,
            editData: {},
            typeId:'',
            numbers:20,
            listsEglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
            actionIndex:1,
            columns: [
                {
                  title: '排序',
                  key: 'disPlayOrder',
                  align: 'center',
                  width: 145,
                  sortable: true
                },
                {
                  title: '产品名称',
                  key: 'name',
                  width: 200,
                  align: 'center',
                },
                {
                  title: '所属系列',
                  key: 'typeName',
                  width: 200,
                  align: 'center',
                },
                {
                    title: '产品主图',
                    key: 'productPicture',
                    align: 'center',
                    width: 200,
                    render: (h, params)=>{
                        return h('div', [
                            h('img',{
                                attrs: {
                                    src: this.imghost + params.row.mainUrl
                                },
                                style:{
                                    width: '100px'
                                }
                            })
                        ])
                    }
                },
                {
                  title: '是否开启',
                  key: 'isDisPlay',
                  align: 'center',
                  width: 150,
                  render: (h, params) => {
                      return h('div', [
                              h('i-switch', {
                                  props:{
                                      'value': params.row.isDisPlay
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
                  title: '创建时间',
                  key: 'addTime',
                  width:250,
                  align: 'center'
                },
                {
                  title: '操作',
                  key: 'action',
                  align: 'center',
                  "fixed": "right",
                  width:350,
                  render:(row, column)=>{
                    let arr = [];

                    arr.push(row('Button', {
                      props: {
                        type: 'primary',
                      },
                      style: {
                        marginRight: '15px',
                        marginLeft: '5px',
                      },
                      on: {
                        click: ()=>{                
                          this.addProduct(column.row)
                        }
                      }
                    }, '编辑'))
                    

                    arr.push(row('Poptip', {
                          props: {
                              confirm: 'confirm',
                              title: '删除后不可恢复，确定删除？',
                              placement: 'top-end',
                              transfer: true
                          },
                          on:{
                              'on-ok':()=>{                       
                                  this.deleteData(column.row);
                              }
                          }
                      },[row('Button', {
                          props: {
                              type: 'error',
                          }
                      }, '删除')]))


                    return row('div', {
                      style: {
                        textAlign: "center"
                      }
                    }, arr);
                  }
                }
            ],
            data: []
        }
    },
    methods: {
        pageChange(value) {
            this.pageIndex = value;
            pageIndex = value;
            this.getList()
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getList();
        },

        getType(){
            this.$request(this.$api.productType, {IsChanese:this.actionIndex}, data => {
                 this.typeList=data.result || [];
            })
        },
         //tab的切换
        tabsChange(list){
            this.actionIndex=list.id;
            this.pageIndex=1;
            this.getList();
            this.getType();
        },
    
        getList(bol){

            const params = {
                indexPage: this.pageIndex,
                Take: this.pageSize,
                Keywords: this.keywords,
                TypeId: this.type,
                IsChanese:this.actionIndex
            }

            if (!bol){
                this.loading = true;
            }
            

            this.$request(this.$api.networkList, params, data => {
                 this.data = data.value;
                 this.total = data.key;
                 this.loading = false;
            })
        },
        getListSearch(){
          this.pageIndex=1;
          this.getList();
        },
        changeState(record){
            const params = {
                Id: record.id,
                // Name: record.name,
                // SpecValue: record.specValue,
                // ProductTypeId: record.typeId,
                // MainUrl: record.mainUrl,
                // BackGroundUrl: record.backGroundUrl,
                // PngDetailUrl: record.pngDetailUrl,
                // DisPlayOrder: record.disPlayOrder,
                // EnglishName: record.englishName,
                // Describe: record.describe,
                // IsDisPlay: !record.isDisPlay,
                // IsChanese:this.actionIndex
            }

            this.$request(this.$api.changeProudctState, params, data => {
                if(data.isSuccess){
                  this.$Message.success("编辑成功")
                }else{
                  this.$Message.success(data.message || "编辑成功")
                }
                 setTimeout(()=>{
                    this.getList(true);
                 }, 200)
            })

        },
        addProduct(record){
            this.editData = record;
            this.visible = true;
        },
        deleteData(record){
            console.log(record);
            this.$request(this.$api.pcDeleteProudct, {Id: record.id}, data => {
                if (data.isSuccess){
                    this.$Message.success('删除成功!');
                    this.getList();
                }else{
                    this.$Message.error(data.message);
                }
            })
        },
        cancelVisible(){
            this.visible = false;
        },


    
    }
};
</script>
