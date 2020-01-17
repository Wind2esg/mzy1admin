<template>
    <div class="magazine-page">
  
        <div class="network-change-language">
            <div style="font-size:20px">杂志页面</div>
            <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span>

        </div>

        <Button type="primary" style="margin:20px;" @click="clickAdd">新增</Button>

        <!-- 表格 -->
        <Table :columns="columns1" :data="data1" style="max-width:1600px"></Table>

        <!-- 分页 -->
        <div style="margin-top: 20px;margin-left: 20px;">
            <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div>

        <!-- 编辑杂志的弹框 -->
        <Modal
          v-model="modal3"
          :title="titleName" width="700" style="font-size:18px;">           

          <div style="margin:20px">
               <span style="display:inline-block;width:90px">序号</span>
               <Input v-model="value1"  clearable style="width: 200px"></Input>
          </div>

          <div style="margin:20px">
               <span style="display:inline-block;width:90px">标题名称</span>
               <Input v-model="value2"  clearable style="width: 200px"></Input>
          </div>

        <!--上传图片-->

        <div class="imgbox_up" style="margin: 20px ;width:300px;">
          <div style="margin-bottom:15px;display:inline-block;width:90px">新闻配图</div>
          <img :src="upimg" alt="" class="imgbox-img" style="width:300px;border:1px solid #ccc">
        </div>

        <div class="upload_btn">
          <Upload 
              :max-size="2048"
              :show-upload-list="false"
              :on-success="upimgSuccess"
              :on-error="upimgError"
              :on-format-error="upimgFormatError"
              :format="['jpg','jpeg','png']"
              v-model="formInfo.mainPicUrl"
              :action="$api.uploadImage">
            <Button type="info" style="margin-left:20px;display:block">选择图片</Button>
          </Upload>
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
                titleName:'添加杂志',
                value1:'',
                value2:'',
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                newList:{},
                listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                formInfo:{
                    mainPicUrl:'',
                },
                columns1: [
                    {
                        title: '排序',
                        key: 'disPlayOrder',
                        align:'center',
                        width:245,
                    },
                    {
                        title: '标题',
                        key: 'name',
                        align:'center',
                        width:250,
                    },
                    {
                        title: '杂志页面',
                        key: 'address',
                        align:'center',
                        width:250,
                        render: (h, params)=>{
                        return h('div', [
                            h('img',{
                                attrs: {
                                    src: this.imghost + params.row.picUrl
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
                        width:250
                    },
                    {
                        title: '操作',
                        key: 'address',
                        align:'center',
                        fixed:'right',
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
                                   this.ediaList(column.row)
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
            this.getList();
        },
        methods:{
            getList(){
            // 获取杂志列表
            let pama={
                indexPage:this.pageIndex,
                Take:this.pageSize,
                IsChanese:this.actionIndex
            }

            this.$request(this.$api.GetMagazineList,pama,data=>{
                this.total=data.key;
                this.data1=data.value;
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
            ediaList(record){
                this.titleName='编辑杂志';
                this.newList=record;
                this.modal3=true;
                this.value1=record.disPlayOrder;
                this.value2=record.name;
                this.upimg= this.imghost+record.picUrl;
                this.formInfo.mainPicUrl=record.picUrl;

            },

            // 新增
            clickAdd(){
                this.titleName='添加杂志';
                this.newList="";
                this.modal3=true;
                this.value1="";
                this.value2="";
                this.upimg="http://cdn.xiaojiankeji.com/images/other/default-img.png";
            },

            // 保存编辑和修改
            saveSerise(){

                if(this.value1==''){
                    this.$Message.error('序号不能为空');
                    return false;
                }

                if(this.value2==''){
                    this.$Message.error('标题名称不能为空');
                    return false;
                }

                if(this.upimg=="http://cdn.xiaojiankeji.com/images/other/default-img.png"){
                    this.$Message.error('请上传图片');
                    return false;
                }

                let saveList={
                    Id:this.newList.id || 0,
                    Name:this.value2,
                    PicUrl:this.formInfo.mainPicUrl,
                    DisPlayOrder:this.value1,
                    IsChanese:this.actionIndex
                }

                this.$request(this.$api.updateMagazine,saveList,data=>{
                    this.getList();
                    console.log(data)
                })
                this.modal3=false;

            },

            //上传图片
            upimgSuccess(res, file){
                //console.log(res,file,this.imghost);
                if(res.length>0){
                    this.upimg = this.imghost + res[0];
                    this.formInfo.mainPicUrl = res[0];
                    this.$emit('child-say',this.upimg);
                }
                
            },
            upimgError (file) {
                this.$Notice.warning({
                    title: '上传',
                    desc: file.name + '文件上传失败'
                });


            },
            upimgFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
                });
            },

            // 杂志删除
            deleteList(record){
                let dele={
                    Id:record.id,
                }

                this.$request(this.$api.DeleteMagazine,dele,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                    }else{
                        this.$Message.error(data.message)
                    }
                })
            },

            // 杂志上下架
            changeState(state){
                let sate={
                    Id:state.id
                }

                this.$request(this.$api.changeMagazineState,sate,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message)
                    }else{
                        this.$Message.error(data.message)
                    }
                })
            },


        },

    }
</script>

<style lang="less" scoped>

 .magazine-page{
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