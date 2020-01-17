<template>
        <div class="certifical-page">
            <div class="network-change-language">
                <div style="font-size:20px">二级分组</div>

             <!--    <span v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
                </span> -->

            </div>

            <Button type="primary" style="margin:20px;" @click="addList">新增</Button>

            <!-- 表格 -->

            <Table :columns="columns1" :data="data1" style="max-width:1505px" ></Table>

            <!-- 分页 -->
            <div style="margin-top: 20px;margin-left: 20px;">
               <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
            </div>

            <!-- 分组的弹框 -->

            <Modal
                v-model="modal3"
                :title="sorts" width="700" style="font-size:18px;"> 

                <div style="margin:20px">
                    <span style="display:inline-block;width:80px">序号</span>
                    <Input v-model="value12"  clearable style="width: 200px"></Input>
                </div>   

                <div style="margin:20px">
                    <span style="display:inline-block;width:80px">分组名称</span>
                    <Input v-model="value13"  clearable style="width: 200px"></Input>
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
                pageIndex:1,
                pageSize:10,
                total:0,
                modal3:false,
                sorts:'新建分组',
                value12:"",
                value13:'',
                newList:{},
                parentId:'',
                listsEglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                columns1: [
                    {
                        title: '序号',
                        key: 'disPlayOrder',
                        align:'center',
                        width:200
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align:'center',
                        width:200
                    },
                    {
                        title: '所属一级',
                        key: 'superName',
                        align:'center',
                        width:200
                    },
                    {
                        title: '数量',
                        key: 'lowerNum',
                        align:'center',
                        width:200
                    },
                    {
                        title: '开启状态',
                        key: 'isDisPlay',
                        align:'center',
                        width:200,
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
                        align:'center',
                        width:250
                    },
                    {
                        title: '操作',
                        key: '',
                        align:'center',
                        fixed:'right',
                        width:250,
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
                                this.manageTwo(column.row)
                              }
                            }
                          }, '管理'))
                          

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
            this.actionIndex=this.$route.query.actionIndex;
            this.getList();
        },

        methods:{
           
            // 获取一级分组数据
            getList(){
                this.parentId=this.$route.query.Id;
                

                let pala={
                    ParentId:this.parentId,
                    PageIndex:this.pageIndex,
                    PageSize:this.pageSize,
                    IsChanese:this.actionIndex
                }
              
                this.$request(this.$api.GetPcCardTwoType,pala,data=>{
                    this.total=data.result.totalCount;
                    this.data1=data.result.resultList;
                    
                })
            },
             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.pageIndex=1;
                this.getList();
            },

            // 分页
            pageChange(value){
                this.pageIndex = value;
                this.getList();
            },

            // 编辑
            ediat(record){                
                this.value12=record.disPlayOrder;
                this.value13=record.name;
                this.newList=record;
                this.modal3=true;
                console.log(record)
            },

            // 新增
            addList(){
                this.value12='';
                this.value13="";
                this.newList="";
                this.modal3=true;

            },

            // 是否开启
            changeState(record){
                console.log(record)

                let pala={
                    Id:record.id,
                }

                this.$request(this.$api.changePcCardTypeState,pala,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                    }else{
                        this.$Message.error(data.message)
                    }
                })


            },

            // 管理
            manageTwo(record){
                this.$router.push({
                    name:'classification-qualif',
                    query:{
                        superId:record.id,
                        actionIndex:this.actionIndex
                    }
                })
            },

            // 保存修改和编辑的
            saveSerise(){

                if(this.value12==''){
                    this.$Message.error('序号不能为空');
                    return false;
                }

                if(this.value13==''){
                    this.$Message.error('分组名称不能为空');
                    return false;
                }

                let serise={
                    Id:this.newList.id || 0,
                    Name:this.value13,
                    DisPlayOrder:this.value12,
                    ParentId:this.parentId,
                    IsChanese:this.actionIndex

                }

                this.$request(this.$api.updatePcCardTwoType,serise,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                        this.modal3=false;
                    }else{
                        this.$Message.error(data.message)
                    }
                })



            },

            // 删除
            deleteProduct(record){
                let deletes={
                    Id:record.id
                }
                this.$request(this.$api.DeletePcCardType,deletes,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                         this.getList();
                    }else{
                        this.$Message.error(data.message);
                    }
                });
            },

        },

    }
</script>

<style lang="less" scoped>
 .certifical-page{
    overflow-x:hidden;
    overflow-y:auto;
    height: 100%;
    background: #fff;


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
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
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
  }
</style>