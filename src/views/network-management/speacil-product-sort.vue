<template>
    <div class="product-sort">

        <div class="network-change-language">
            <div style="font-size:20px">产品分类专业线</div>
            <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span>

        </div>

        <Button type="primary" style="margin:20px;" @click="addNews">新增</Button>

        <!-- 表格 -->

         <Table :columns="columns1" :data="data1" style="max-width:1700px;margin-bottom:30px;"></Table>
        <!--  <div class="page-wraper">
          <Page :total="total" :page-size="pageSize" :current="pageIndex" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange" ></Page>
          </div> -->

         <!-- 分页 -->
<!-- 
       <div style="margin-top: 20px;margin-left: 20px;">
          <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div> -->

         <!-- 新建的弹框 -->

         <Modal
            v-model="modal1"
            :title="productTitle">

            <div style="margin-bottom:10px;">
               <span class="title-box" >序号:</span><Input v-model="value1"  clearable style="width: 200px;margin-left:5px;"></Input>
            </div>

            <span class="title-box">系列名称:</span><Input v-model="value2"  clearable style="width: 200px;margin-left:5px;"></Input>

            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary"  @click="saveBtn">保存</Button>
            </div>

        </Modal>

        <!-- 系列描述的弹框 -->

      <Modal
          v-model="modal3"
          title="系列描述" width="700" style="font-size:18px;">           

          <div class="system-discripe">
                 <div class="input-box">
                   <Input v-model="value1" placeholder="描述文案" clearable style="width:300px;" ></Input>
                 </div>
      
                 <div class="input-box">
                   <Input v-model="value2" placeholder="描述文案" clearable style="width: 300px" ></Input>
                 </div>
      
                 <div class="input-box">
                   <Input v-model="value3" placeholder="描述文案" clearable style="width: 300px" ></Input>
                 </div>
      
         <!--         <div class="input-box">
                    <Input v-model="value4" placeholder="描述文案" clearable style="width: 300px"></Input>
                 </div>  -->   
    
          </div>

          <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary"  @click="saveSerise">保存</Button>
          </div>

      </Modal>

    </div>

</template>

<script>
    export default{
        data(){
            return{
                modal1:false,
                modal3:false,
                value1:'',
                value2:'',
                pageSize:10,
                pageIndex:1,
                total:0,
                lists:{},
                numbers:20,
                value1:'',
                value2:'',
                value3:'',
                value4:'',
                pageSize: 15,
                pageIndex: 1,
                total:0,
                listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                productTitle:'新建系列',
                columns1: [
                    {
                        title: '序号',
                        key: 'displayOrder',
                        align: 'center',
                        width:245,
                    },
                    {
                        title: '产品系列',
                        key: 'name',
                        align: 'center',
                        width:350,
                    },
                    {
                        title: '是否开启',
                        key: 'isDisplay',
                        align: 'center',
                        width:250,
                        render: (h, params) => {
                          return h('div', [
                              h('i-switch', {
                                  props:{
                                      'value': params.row.isDisplay
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
                        title: '当前产品数',
                        key: 'productcount',
                        align: 'center',
                        width:250,
                    },
                    {
                        title: '创建时间',
                        key: 'addTime',
                        align: 'center',
                        width:300,
                    },
                    {
                        title: '操作',
                        key: '',
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
                                this.ediat(column.row)
                              }
                            }
                          }, '编辑'))

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
                                this.addSerse(column.row)
                              }
                            }
                          }, '系列描述编辑'))
                          

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
           this.getList();
        },
        methods:{          

            getList(){
                let palam={
                    IsChanese:this.actionIndex,
                    PageIndex:this.pageIndex,
                    PageSize:this.pageSize
                }

                this.$request(this.$api.PcProductTypeProfession,palam,data=>{
                    this.data1=data.result;
                    
                })

            },
             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.getList();
            },
    

            pageSizeChange(value){
              this.pageSize = value;
              this.getList();
            },
            pageChange(value) {
              this.pageIndex = value;
              this.getList()
            },

            // 编辑
            ediat(record){
                this.modal1=true;
                this.value1=record.displayOrder;
                this.value2=record.name;
                this.lists=record;
                this.productTitle='编辑'
          
            },

            // 新增

            addNews(){
                this.productTitle='新建系列'
                this.modal1=true;
                this.value1='';
                this.value2='';
                this.lists='';
            },

            // 保存
            saveBtn(){
                console.log(this.lists,666)

                if(this.value1==''){
                    this.$Message.error('序号不能为空');
                    return false;
                }

                if(this.value2==''){
                    this.$Message.error('系列名称不能为空');
                    return false;
                }


                let palamers={
                    Id:this.lists.id || 0,
                    Name:this.value2 ,
                    DisPlayOrder:this.value1,
                    EnglishName:this.lists.englishName  || '0',
                    Describe:this.lists.describe || '0' , 
                    IsChanese:this.actionIndex                   
                }

                this.$request(this.$api.PcProductTypeProfessionUpdate,palamers,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                    }else{
                        this.$Message.error(data.message);
                    }
                });
                this.modal1=false;
            },

            // 删除

            deleteProduct(recods){
                console.log(recods)
                let palamers={
                    Id:recods.id,                   
                }

                this.$request(this.$api.PcProductTypeProfessionDelete,palamers,data=>{
                    if(data.isSuccess){
                        this.$Message.success('删除成功');
                         this.getList();
                    }else{
                        this.$Message.error(data.message);
                    }
                });

            },

            // 对否开启
            changeState(recorder){
                let state={
                    Id:recorder.id,
                }
                this.$request(this.$api.PcProductTypeProfessionIsDisplay,state,data=>{
                    if(data.isSuccess){
                        this.$Message.success('修改成功!');
                        this.newList();
                    }else{
                        this.$Message.error(data.message);
                        this.newList();
                    }
                });
            },



            // 分页
            // pageChange(value){
            //     this.pageIndex = value;
            //     this.getList();
            // },

            // 编辑系列描述
            addSerse(record){
              this.value1=record.name;
              this.value2=record.englishName ;
              this.value3=record.describe ;
              this.modal3=true;
              this.typeId=record.id;
              console.log(record,666)
            },

            // 系列描述的修改保存
            saveSerise(){

              let servers={
                  Id:this.typeId,
                  Name: this.value1,
                  EnglishName:this.value2,
                  Describe:this.value3,
                  SeriesDescrip:this.value4
              }

              this.$request(this.$api.PcProductTypeProfessionEditSeriesDes,servers,data=>{
                  if (data.isSuccess){
                        this.$Message.success('修改成功!');
                        this.getList();
                         this.modal3=false;
                  }else{
                        this.$Message.error(data.message);
                  }
              })


            },

        },
    }
</script>

<style lang="less" scoped>
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
  

  h1{ 
    font-size: 20px;  
    font-weight: normal;
  }
  .product-sort{
    overflow-x:hidden;
    overflow-y:auto;
    height:100%;
    background: #fff;
    position:absolute;
    width:100%; 
  }

    .title-box{
        display:inline-block;
        width:80px;
        text-align:right;
    }

    .system-discripe{
         h1{
           font-size: 18px;
           padding: 10px 20px;
           font-weight: normal;
         }
         .input-box{
           margin-bottom:20px;
         }
    }
    
</style>