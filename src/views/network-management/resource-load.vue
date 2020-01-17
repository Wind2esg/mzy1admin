<template>
    <div class="resource-load">

        <div class="network-change-language">
              <div style="font-size:20px">资源下载</div>
              <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
              </span>

        </div>

        <!-- 表格 -->

        <Table :columns="columns1" :data="data1" :loading="loadings"></Table>

        <!-- 编辑的弹框 -->

        <Modal
          v-model="modal3"
          width="700" style="font-size:18px;">

          <div class="resose-box">
            <Input v-model="listName" placeholder="一级说明(不填则不显示)" clearable style="width: 300px;margin-bottom:20px"></Input>
            <Input v-model="lisTitle" placeholder="二级说明(不填则不显示)" clearable style="width: 300px;margin-bottom:20px"></Input>

            <!--上传图片-->

             <div class="imgbox_up" style="margin: 20px ;width:300px;" >
               <img :src="upimg" alt="" class="imgbox-img" style="width:300px;border:1px solid #ccc" >
             </div>

             <div class="upload_btn">
               <Upload 
                   :max-size="2048"
                   :show-upload-list="false"
                   :on-success="upimgSuccess"
                   :on-error="upimgError"
                   :on-format-error="upimgFormatError"
                   :format="['jpg','jpeg','png']"
                   v-model="formInfo.mainPicUrl "
                   :action="$api.uploadImage">
                 <Button type="info" style="margin-left:20px;display:block">选择图片</Button>
               </Upload>
              </div>

              <div style="margin-top:20px">
                  <span style="margin-right:10px;">下载地址</span><Input v-model="listLinkUrl" clearable style="width: 300px"></Input>
              </div>

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
                modal3:false,
                value1:'',
                value2:'',
                value3:'',
                listName:'',
                lisTitle:'',
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                linkUrl:'',
                listLinkUrl:'',
                imgLists:[],
                loadings:true,
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
                        align:'center'
                    },
                    {
                        title: '一级标题',
                        key: 'name',
                        align:'center'
                    },
                    {
                        title: '二级标题',
                        key: 'title',
                        align:'center'
                    },
                    {
                        title: '图片链接',
                        key: 'pic',
                        align:'center',
                        render:(h,params)=>{
                          return h('div',[
                               h('img',{
                                  attrs:{
                                    src:this.imghost + params.row.pic
                                  },
                                  style:{
                                    width:'150px'
                                  }
                               })
                            ])
                        }
                    },
                    {
                        title: '下载地址',
                        key: 'linkUrl',
                        align:'center'
                    },
                    {
                        title: '操作',
                        align:'center',
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

            // 获取列表信息
            getList(){
                this.$request(this.$api.GetPcResourcesDownLoadList,{IsChanese:this.actionIndex},data=>{
                    this.data1=data;
                    this.loadings=false;
                    console.log(this.data1)
                })

            },

             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.getList();
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

            // 编辑
            ediat(record){
              console.log(record)
              this.listName=record.name;
              this.lisTitle=record.title;
              this.upimg=this.imghost+record.pic;
              this.listLinkUrl=record.linkUrl;
              this.newList=record;
              this.modal3=true;
            },

            // 编辑保存
            saveSerise(list){
                console.log(this.formInfo.mainPicUrl)
                let pala={
                    Id: this.newList.id,
                    Name:this.listName,
                    Title: this.lisTitle,
                    Pic:this.formInfo.mainPicUrl ||this.newList.pic ,
                    LinkUrl:this.listLinkUrl,
                    DisPlayOrder:this.newList.disPlayOrder,
                    IsChanese:this.actionIndex
                }

                this.$request(this.$api.UpdatePcResourcesDownLoad,pala,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                        this.modal3=false;
                    }else{
                        this.$Message.error(data.message)
                    }
                })
            },

        }

    }
</script>

<style lang="less" scoped>

 .resource-load{
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
        font-weight: normal;
    }    
  }

  .resose-box{
     width:600px;
     padding:20px;
     margin-bottom:30px;
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