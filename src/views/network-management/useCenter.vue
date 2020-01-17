<template>
    <div class="applay-manage">
       
        <div class="network-change-language">
              <div style="font-size:20px">试用中心</div>
<!-- 
              <span v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
              </span> -->

        </div>

         <Input v-model="keyWords" placeholder="姓名、电话" clearable style="width: 200px;margin:20px 0 20px 20px;"></Input>

         <Select v-model="model1" style="width:200px;margin:20px 20px 20px 20px">
            <Option v-for="item in cityList" :value="item.label" :key="item.label">{{ item.value }}</Option>
        </Select>

        <Button type="primary" @click="founds">搜索</Button>

         <!-- 表格 -->
        <Table :columns="columns1" :data="data1"></Table>

         <!-- 分页 -->
        <div style="margin-top: 20px;margin-left: 20px;">
            <Page :total="total" :page-size="pageSize" @on-change="pageChange" :current="pageIndex"></Page>
        </div>

    </div>
</template>

<script>
    export default{
        data(){
            return{
              keyWords:'',
              pageIndex:1,
              pageSize:10,
              total:0,
              listsEglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
              actionIndex:1,
              cityList: [
                    {
                        value: '未处理',
                        label: '0'
                    },
                    {
                        value: '已处理',
                        label: '1'
                    },
                    {
                        value: '全部',
                        label: ''
                    }
                ],
                model1: '',

                 columns1: [
                    // {
                    //     title: '序号',
                    //     key: 'id',
                    //     align:'center',
                    //     width:100,
                    // },
                    {
                        title: '姓名',
                        key: 'name',
                        align:'center',
                        width:150,
                    },
                    {
                        title: '手机号',
                        key: 'phone',
                        align:'center',
                        width:150,
                    },
                    {
                        title: '省份',
                        key: 'province',
                        align:'center',
                        width:145,
                    },
                    {
                        title: '城市',
                        key: 'city',
                        align:'center',
                        width:150,

                    },
                    {
                        title: '详细地址',
                        key: 'address',
                        align:'center',
                        width:300,
                    },
                    {
                        title: '状态',
                        key: 'isDealName',
                        align:'center',
                        width:300,
                    },
                    {
                        title: '申请时间',
                        key: 'addTime',
                        align:'center',
                        width:250,
                    },
                    {
                        title: '操作',
                        key: '',
                        align:'center',
                        width:250,
                        fixed:'right',
                        render:(row, column)=>{
                          let arr = [];

                          if(column.row.isDeal == false){

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
                                   this.markList(column.row)
                                 }
                               }
                             }, '标记为已处理'))

                          }

                          arr.push(row('Poptip', {
                                props: {
                                    confirm: 'confirm',
                                    title: '删除后不可恢复，确定删除？',
                                    placement: 'top-end',
                                    transfer: true
                                },
                                on:{
                                    'on-ok':()=>{                       
                                        this.deleteList(column.row);
                                    }
                                }
                            },[row('Button', {
                                props: {
                                    type: 'error',
                                }
                            }, '删除')]))


                          return row('div', {
                            style: {
                              textAlign: "cent=er"
                            }
                          }, arr);
                        }

                    }
                ],
                data1: []
            }
        },
         beforeMount(){
            this.GetJoinUsList();
        },
        methods:{

            // 获取申请列表
            GetJoinUsList(){

                let lists={
                    PageIndex:this.pageIndex,
                    PageSize:this.pageSize,
                    KeyWord:this.keyWords,
                    IsDeal:this.model1
                }

                this.$request(this.$api.TrialCenterList,lists,data=>{
                    this.total=data.totalCount;
                    this.data1=data.resultList;
                });

            },

             //tab的切换
            // tabsChange(list){
            //     this.actionIndex=list.id;
            //     this.GetJoinUsList();
            // },

            // 分页
            pageChange(value){
                this.pageIndex = value;
                this.GetJoinUsList();
            },


            // 删除
            deleteList(record){
               let delet={
                  Id:record.id,
               }

               this.$request(this.$api.TrialCenterListDel,delet,data=>{
                     if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.GetJoinUsList();
                     }else{
                        this.$Message.error(data.message);
                     }
               });
            },

            // 标记为处理
            markList(record){
                let mark={
                    Id:record.id
                }

                this.$request(this.$api.TrialCenterListMark,mark,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.GetJoinUsList();
                    }else{
                        this.$Message.error(data.message);
                    }
                })
            },

            // 搜索
            founds(){
              this.pageIndex=1;
              this.GetJoinUsList();
            }   
        },
    }
</script>

<style lang="less" scoped>
  .applay-manage{
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
    }    
  }
</style>