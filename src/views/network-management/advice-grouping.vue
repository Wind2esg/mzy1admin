<template>
    <div class="advice-grouping">

        <div class="network-change-language">
            <div style="font-size:20px">广告片分组</div>
            <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span>

        </div>

         <Button type="primary" style="margin:20px;" @click="addNew">新增</Button>
         <!-- 表格 -->
         <Table :columns="columns1" :data="data1" style="max-width:1600px;"></Table>

         <!-- 分页 -->

        <div style="margin-top: 20px;margin-left: 20px;">
          <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div>

        <!-- 编辑和新增的弹框 -->

        <Modal
            v-model="modal2"
            title="新建分组">

            <div style="margin-bottom:20px;">
                <span class="sort-sort">序号:</span>
                <Input v-model="value12"  clearable style="width: 200px"></Input>
            </div>

             <div  style="margin-bottom:20px;">
                <span class="sort-sort">分组名称:</span>
                <Input v-model="value13"  clearable style="width: 200px"></Input>
            </div>
            
            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary"  @click="saveBtn">保存</Button>
            </div>
        </Modal>


    </div>
</template>


<script>
    export default{

        data(){
            return{
                pageIndex:1,
                pageSize:10,
                total:0,
                modal2:false,
                value12:'',
                value13:'',
                newList:{},
                listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                columns1: [
                    {
                        title: '序号',
                        key: 'disPlayOrder',
                        align: 'center',
                        width:245,
                    },
                    {
                        title: '分组名',
                        key: 'name',
                        align: 'center',
                        width:300,
                    },{
                        title: '数量',
                        key: 'adcount',
                        align: 'center',
                        width:250,
                    },
                    {
                        title: '是否开启',
                        key: 'isDisPlay',
                        align: 'center',
                        width:250,
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
                        align: 'center',
                        width:250,
                    },
                    {
                        title: '操作',
                        key: 'address',
                        align: 'center',
                        width:300,
                        fixed:'right',
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
                                this.editNew(column.row)
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
                                        this.deleteProduct(column.row);
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
                data1: []
            }
        },

        beforeMount(){
            this.GetAdTypeList();
        },

        methods:{

            // 获取广告片类型列表
            GetAdTypeList(){
                let para={
                    indexPage:this.pageIndex,
                    Take:this.pageSize,
                    IsChanese:this.actionIndex
                }

                this.$request(this.$api.GetAdTypeList, para, data=>{
                    this.total=data.key;
                    this.data1=data;                  
                })
            },
             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.pageIndex=1;
                this.GetAdTypeList();
            },

            // 分页
            pageChange(value){
                this.PageIndex = value;
                this.GetAdTypeList();
            },

            // 产品的删除
            deleteProduct(record){
                console.log(record)
                let delet={
                    Id:record.id,
                }
                this.$request(this.$api.DeletePcAdType,delet,data=>{
                    if(data.isSuccess){
                        this.$Message.success('删除成功');
                         this.GetAdTypeList();
                    }else{
                        this.$Message.error(data.message);
                    }
                });


            },

            // 编辑
            editNew(records){
                this.modal2=true;
                this.newList=records;
                this.value12=records.disPlayOrder;
                this.value13=records.name;
            },

            // 新建修改的保存
            saveBtn(){

                if(this.value12==''){
                    this.$Message.error('序号不能为空');
                    return false;
                };

                if(this.value13==''){
                    this.$Message.error('分组名称不能为空');
                    return false;
                };

                let groups={
                    id:this.newList.id || 0,
                    Name:this.value13,
                    DisPlayOrder:this.value12,
                    IsChanese:this.actionIndex
                }

                this.$request(this.$api.updateAdType,groups,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                         this.GetAdTypeList();
                    }else{
                        this.$Message.error(data.message);
                    }
                });

                this.modal2=false;


            },

            // 新增
            addNew(){
                this.modal2=true;
                this.value12='';
                this.value13='';
                this.newList='';
            },

            // 改变上下架状态
            changeState(records){

                let sate={
                    Id:records.id,
                }

                this.$request(this.$api.changPcAdTypeState,sate,data=>{
                    if(data.isSuccess){
                        this.$Message.success('修改成功');
                    }else{
                        this.$Message.error(data.Message);
                    }
                });

            }
        },

    }
</script>

<style lang="less" scoped>
 .advice-grouping{
    overflow-x:hidden;
    overflow-y:auto;
    height: 100%;
    background: #fff;


    h1{
        width: 100%;
        background: #f0f0f0;
        padding: 10px 0 20px;
        font-size: 20px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
        font-weight: normal;
    }    
  }

  .sort-sort{
     display:inline-block;
     width:70px;
  }

  .network-change-language{   
      width: 100%;
      background: #f0f0f0;
      padding: 10px 0 20px;   
      border-bottom: 1px solid #ccc;
      margin-bottom: 5px;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      font-size: 17px;
      line-height: 30px;
      cursor: pointer;
      .change-tab{
        margin-left: 45px;
      }
      .change-tab-action{
        color:blue;
      }
}
</style>