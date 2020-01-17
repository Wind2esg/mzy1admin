<template>
    <div class="certifical-page">
        <h1>资质分类</h1>

        <Button type="primary" style="margin:20px;max-width:1400px;" @click="edit({})">新增</Button>

        <!-- 表格 -->
        <Table :columns="columns1" :data="data1"></Table>

        <!-- 分页 -->
        <div style="margin-top: 20px;margin-left: 20px;">
           <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div>


        <!-- 新增和修改资质认证的弹框 -->
        <Modal
          v-model="modal3"
          title="新建资质" width="700" style="font-size:18px;">

          <div style="margin-bottom:20px;">
              <span class="names-title">序号:</span>
              <Input v-model="value1"  clearable style="width: 300px"></Input>
          </div> 

          <div>
              <span class="names-title">资质名称:</span>
              <Input v-model="value2"  clearable style="width: 300px"></Input>
          </div>            


          <div slot="footer" style="text-align:center;">
                <Button  size="large"  type="primary"  @click="saveSerise">保存</Button>
          </div>

          <!-- 添加图片 -->
         <!--  <div style="margin-left:20px;">
                <slider-item v-for="(item, index) in editData.imgUrlList" @change="itemChange" :key="item.uid" @remove="removeItem" :showDelete="index!=0" :data="item"></slider-item>
          </div>

          <div style="padding-left:30px;padding-top:20px;" v-if="!editData.imgUrlList||(editData.imgUrlList&&editData.imgUrlList.length<8)"><Button type="dashed" icon="plus" @click="addData">添加</Button></div> -->

      </Modal>


    </div>
</template>

<script>
    
    export default{
        data(){
            return{
                modal3:false,
                value1:'',
                value2:'',
                editData: {},
                superId:'',
                pageSize:10,
                total:1,
                pageIndex:1,
                columns1: [
                    {
                        title: '序号',
                        key: 'disPlayOrder',
                        align:'center',
                        width:200
                    },
                    {
                        title: '资质名称',
                        key: 'name',
                        align:'center',
                        width:250
                    },
                    {
                        title: '二级名称',
                        key: 'parentName',
                        align:'center',
                        width:250
                    },
                    {
                        title: '所属一级',
                        key: 'parentParentName',
                        align:'center',
                        width:250
                    },
                    {
                        title: '开启状态',
                        key: 'isDisPlay',
                        align:'center',
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
                        align:'center',
                        width:245
                    },
                    {
                        title: '操作',
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
                              console.log(params.row,666)            
                                    // this.$request(this.$api.TurnPicGet, {Id:params.row.id}, data=>{
                                    //      console.log(data)
                                    //     if (data.isSuccess){
                                    //         console.log(data)
                                    //         this.edit(data.result);
                                    //     }
                                    // })
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
                                        // this.deleteProduct(column.row);
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
            this.getListThree();
        },

        methods:{
            // 获取列表数据
            getListThree(){
                this.superId=this.$route.query.superId;
                let lists={
                    indexPage:this.pageIndex,
                    Take:this.pageSize,
                    ParentId:this.superId
                }
                if(this.superId){
                    this.$request(this.$api.GetPcCardThreeType,lists,data=>{
                        this.total=data.key;
                        this.data1=data.value;
                        console.log(data,2233)

                    })
                }
                

            },

        
            // 编辑
            ediat(record){
                console.log(record)
                this.value1=record.disPlayOrder;
                this.value2=record.name;
                this.modal3=true;  
                 let picture={
                    indexPage:this.pageIndex,
                    Take:this.pageSize,
                    ParentId:this.superId
                }

                this.$request(this.$api.GetPcCardList,picture,data=>{
                    console.log(data,456)
                });
            },

            // 新增和修改的保存
            saveSerise(){
                
            },

            // 分页
            pageChange(value){
                this.pageIndex = value;
                this.getListThree();
            },

            // 添加图片
           //  addData(){

           //  if (this.editData.imgUrlList.length >= 8){
           //      this.$Message.error('幻灯片最多添加8个');
           //      return;
           //  }

           //  const data = {
           //      uid: this.guid(),
           //      id: 0,
           //      carouselImgId: 0,
           //      imgUrl: '',
           //      linkUrl: ''
           //  }

           //  this.editData.imgUrlList.push(data);

           // },

           // edit(record){
           //  console.log(record)
           //  if (record.id){
           //      this.editData = record;
           //      this.editData.imgUrlList = this.editData.imgUrlList.map(item=>{
           //          let obj = {};
           //          for (var u in item){
           //              obj[u] = item[u];
           //          }
           //          obj.uid = this.guid();
                    
           //          return obj;
           //      })
           //      console.log(this.editData);

           //      this.editData.type = this.editData.type+'';
           //  }else{
           //      this.editData = {
           //          title: '',
           //          type: '',
           //          imgUrlList: []
           //      }
           //  }
            
           //  this.editVisible = true;
           // },
        }
    }
</script>

<style lang="less" scoped>
 .certifical-page{
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
    .names-title{
        display:inline-block;
        width:60px;
    }
</style>