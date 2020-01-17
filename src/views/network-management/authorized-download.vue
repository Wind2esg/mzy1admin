<template>
    <div class="networkhead">
        
        <div class="network-change-language">
            <div style="font-size:20px">授权下载</div>
        <!--     <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span> -->

        </div>

        <div class="input-infpormation">
            <Input v-model="value" placeholder="请输入序号" clearable style="width: 300px;margin-bottom:20px;"></Input><br/>
            <Input v-model="value1" placeholder="请输入微信号" clearable style="width: 300px;margin-bottom:20px;"></Input><br/>
            <Input v-model="value2" placeholder="请输入身份证后四位" clearable style="width: 300px;margin-bottom:20px;" :maxlength="length"></Input><br/>
            <Input v-model="value3" placeholder="请输入图片名称" clearable style="width: 300px;margin-bottom:20px;"></Input>

            <!-- 上传图片 -->
                
            <div class="imgbox_up"  >
               <img :src="upimg" alt="" class="imgbox-img">
            </div>
            <div class="upload_btn" style="margin-top:20px;">
               <Upload 
                   :max-size="2048"
                   :show-upload-list="false"
                   :on-success="upimgSuccess"
                   :on-error="upimgError"
                   :on-format-error="upimgFormatError"
                   :format="['jpg','jpeg','png']"
                   v-model="formInfo.mainPicUrl"
                   :action="$api.uploadImage">
                 <Button type="info" >上传</Button>
                </Upload>
                
            </div>


            <Button type="primary" class="submite-box" @click="submite">提交</Button>            

        </div>

        <!-- 表格 -->
        <Table :columns="columns1" :data="data1" width="900"></Table>

        <!-- 分页 -->
        <div style="margin-top: 20px;margin-left: 20px;">
            <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div>



    </div>

</template>

<script>
    export default{

        data(){
            return{
                value:'',
                value1:'',
                value2:'',
                value3:'',
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                total:0,
                pageIndex:1,
                pageSize:10,
                length:4,
                formInfo:{
                    sort:0,
                    productName:'',
                    productEnglishName: '',
                    rules: '',
                    productType: '',
                    direction: '',
                    mainPicUrl:'',
                    wapPng: ''
                },
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
                    },
                    {
                        title: '微信号',
                        key: 'weiXin',
                        align: 'center',
                    },
                    {
                        title: '身份证号',
                        key: 'cardId',
                        align: 'center',
                    },
                    {
                        title: '授权证书',
                        key: 'picUrl',
                        align: 'center',
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
                        title: '操作',
                        key: 'address',
                        align: 'center',
                        render:(row, column)=>{
                                let arr = [];                   

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
                data1: []
            }
        },
        beforeMount(){
          this.getList();
        },
        methods:{
          // 获取列表
          getList(){
              let  list={
                indexPage:this.pageIndex,
                Take:this.pageSize,
                IsChanese:this.actionIndex
              } 

              this.$request(this.$api.AuthDownloadList,list,data=>{
                  this.total=data.key;
                  this.data1=data.value;
              })
          },
          // 分页
            pageChange(value){
                this.pageIndex = value;
                this.getList();
            },

             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.pageIndex=1;
                this.getList();
            },

            // 提交保存
            submite(){

              if(this.value==''){
                this.$Message.error('请输入序号');
                return false;
              }

              if(this.value1==''){
                this.$Message.error('请输入微信号');
                return false;
              }
              if(this.value2==''){
                this.$Message.error('请输入身份证后四位');
                return false;
              }
              if(this.value3==''){
                this.$Message.error('请输入图片名称');
                return false;
              }
              if(this.upimg=='http://cdn.xiaojiankeji.com/images/other/default-img.png'){
                this.$Message.error('请上传图片');
                return false;
              }
              let downLoad={
                   WeiXin:this.value1,
                   CardId:this.value2,
                   PicUrl:this.formInfo.mainPicUrl,
                   PicName:this.value3,
                   DisPlayOrder:this.value,
                   IsChanese:this.actionIndex

              }
              this.$request(this.$api.AddAuthDownload,downLoad,data=>{
                   if(data.isSuccess){
                       this.$Message.success(data.message);
                       this.getList()
                   }else{
                       this.$Message.error(data.message)
                   }
              });

              this.value='';
              this.value1='';
              this.value2='';
              this.value3='';
              this.upimg='http://cdn.xiaojiankeji.com/images/other/default-img.png';

            },

            // 删除
            deleteData(record){
                let dele={
                  Id:record.id
                }

                this.$request(this.$api.DeleteAuthDownload,dele,data=>{
                   if(data.isSuccess){
                       this.$Message.success(data.message);
                       this.getList()
                   }else{
                       this.$Message.error(data.message)
                   }
              })


            },

             //上传图片
             upimgSuccess(res, file){
                 //console.log(res,file,this.imghost);
                 if(res.length>0){
                     this.upimg = this.imghost + res[0]
                     this.formInfo.mainPicUrl = res[0]
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


        },

    }
</script>


<style lang="less" scoped>

.networkhead{
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
    .input-infpormation{
        width:600px;
        border:1px solid #ccc;
        border-radius:5px;
        margin:30px 20px;
        padding:15px;
        position:relative;
    }

    .imgbox_up{
        .imgbox-img{
            width:250px;  
            border:1px solid #ccc;         
        }

    }

    .submite-box{
        position:absolute;
        bottom:15px;
        left:100px;
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
}
    
</style>