<template>
    <div class="advice-list">
        <div v-show="editaShow">
  
          <div class="network-change-language">
            <div style="font-size:20px">广告片列表</div>
            <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span>

          </div>

            <Button type="primary" style="margin:20px" @click="addNews">新增</Button>

            <!-- 表格 -->
            <Table :loading="loading" :columns="columns" :data="data" size="small" style="max-width:1603px;"></Table>

            <div style="margin-top: 20px;margin-left: 20px;">
                 <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
            </div>
        </div>


         <!-- 新增编辑的弹框 -->
         <div v-show="alertBox">
             <h1>{{productTitle}}</h1>

            <div style="margin:20px 20px 20px 50px">
                <span style="display:inline-block;width:70px;">序号</span> 
                <Input v-model="value2"  clearable style="width: 350px;margin-left:5px;"></Input>
            </div>

            <div style="margin:20px 20px 20px 50px">
                <span style="display:inline-block;width:70px;">广告标题</span> 
                <Input v-model="value3"  clearable style="width: 350px;margin-left:5px;"></Input>
            </div>

            <div style="margin:20px 20px 20px 50px">
                <span style="display:inline-block;width:70px;">分组名</span> 
                <Select v-model="model1" style="width:200px">
                    <Option v-for="(item,index) in cityList" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
            </div>



            <!--上传图片-->

            <div class="imgbox_up" style="margin:20px 20px 20px 50px;width:300px;">
                <div style="margin-bottom:15px;">新闻配图</div>
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
                  <Button type="info" style="margin: 0 0 20px 50px;display:block">选择图片</Button>
                </Upload>
            </div>

            <!-- 广告描述 -->

            <div style="margin:20px 20px 20px 50px">
                <span style="display:inline-block;width:70px;vertical-align: top;">广告描述</span> 
                <textarea v-model="value5" class="textareas"></textarea>
            </div>

            <div style="margin:20px 20px 20px 50px">
                <span style="display:inline-block;width:70px;">视频连接</span> 
                <Input v-model="value6"  clearable style="width: 450px;margin-left:5px;"></Input>
            </div>

            <Button type="primary" @click="backBtn" style="margin:10px 20px 20px 50px;">返回</Button>
            <Button type="primary" @click="saveBtn" style="margin:10px 20px 20px 0;">保存</Button>

        </div>



    </div>
</template>

<script>
    export default{
        data(){
            return{
                loading:true,
                pageSize:10,
                pageIndex:1,
                total:0,
                modal1:true,
                productTitle:'新增广告',
                value2:'',
                value3:'',
                value5:'',
                value6:'',
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                editaShow:true,
                alertBox:false,
                sixList:{},
                listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                formInfo:{
                    mainPicUrl:'',
                },
                columns: [
                    {
                        title: '序号',
                        key: 'disPlayOrder',
                        align:'center',
                        width:200
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align:'center',
                        width:250
                    },
                    {
                        title: '分组名',
                        key: 'adTypeVal',
                        align:'center',
                        width:250
                    },
                    {
                        title: '广告图',
                        key: 'picUrl',
                        align:'center',
                        width:250,
                        render:(h,params)=>{
                          return h('div',[
                               h('img',{
                                  attrs:{
                                    src:this.imghost + params.row.picUrl
                                  },
                                  style:{
                                    width:'150px'
                                  }
                               })
                            ])
                        }
                    },
                    {
                        title: '是否开启',
                        key: 'isDisPlay',
                        align:'center' ,
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
                        width:200
                    },
                    {
                        title: '操作',
                        key: '',
                        align:'center',
                        fixed:'right',
                        width:200,
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
                                this.editList(column.row)
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
                              textAlign: "center"
                            }
                          }, arr);
                        }
                    }
                ],
                data:[],

                cityList: [],
                model1: ''
            }
        },
        beforeMount(){
            this.getProduct();
            this.getStyle();
        },
        methods:{

            getProduct(){

                let products={
                    indexPage:this.pageIndex,
                    Take:this.pageSize,
                    IsChanese:this.actionIndex
                }

                this.$request(this.$api.GetAdList,products,data=>{
                    this.total=data.key;
                    this.data=data.value;
                    this.loading=false;
                });

            },
             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.getProduct();
                this.getStyle();
            },

            // 获取产品类型列表
            getStyle(){
                let styleList={
                    indexPage:this.pageIndex,
                    Take:this.pageSize,
                    IsChanese:this.actionIndex
                }
                this.$request(this.$api.GetAdTypeList,styleList,data=>{
                    this.cityList=data;
                })

            },

            // 分页
            pageChange(value){
                this.pageIndex = value;
                this.getProduct();
            },


            //上传图片
             upimgSuccess(res, file){
                 //console.log(res,file,this.imghost);
                 if(res.length>0){
                     this.upimg = this.imghost + res[0];
                     this.formInfo.mainPicUrl = res[0];
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

             // 保存
             saveBtn(){
                if(this.value3 == ''){
                    this.$Message.error('标题不能为空');
                    return false;
                }

                if(this.upimg == 'http://cdn.xiaojiankeji.com/images/other/default-img.png'){
                    this.$Message.error('产品配图没有上传');
                    return false;
                }

                let newsList={                    
                    Id:this.sixList.id || 0,
                    Title:this.value3,                    
                    PicUrl:this.formInfo.mainPicUrl,
                    Describe:this.value5,
                    LinkUrl:this.value6  ,
                    AdTypeId:this.model1,
                    DisPlayOrder:this.value2,
                    IsChanese: this.actionIndex === 1
                }
               

                this.$request(this.$api.updateAd,newsList,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getProduct();
                    }else{
                        this.$Message.error(data.message);
                    }
            
                })

                this.editaShow=true;
                this.alertBox=false;


             },

             // 返回
            backBtn(){
               this.editaShow=true;
               this.alertBox=false;

            },

            // 新增
            addNews(){
                this.editaShow=false;
                this.alertBox=true;
                this.sixList="";
                this.value2='';
                this.value3='';
                this.value5='';
                this.formInfo.mainPicUrl='';
                this.upimg='http://cdn.xiaojiankeji.com/images/other/default-img.png';
                this.value6='';
                this.model1='';
            },

            // 删除
            deleteList(record){
                let lists={
                    Id:record.id,
                }
                this.$request(this.$api.DeletePcAd,lists,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getProduct();
                    }else{
                        this.$Message.error(data.message);
                    }
            
                })
            },

            // 编辑
            editList(recod){
                this.sixList=recod;
                this.value2=recod.disPlayOrder;
                this.value3=recod.title;
                this.formInfo.mainPicUrl=recod.picUrl;
                this.upimg=this.imghost+recod.picUrl;
                this.value6=recod.linkUrl;
                this.value5=recod.describe;
                this.editaShow=false;
                this.alertBox=true;
                this.model1=parseInt(recod.adType) ;
            },

            // 是否开启
            changeState(recods){
               let state={
                  Id:recods.id,
               }
               this.$request(this.$api.changPcAdState,state,data=>{
                    if(data.isSuccess){
                        this.$Message.success('改变成功');
                        this.getProduct();
                    }else{
                        this.$Message.error(data.message);
                    }
            
                })

            },

        },

    }
</script>

<style lang="less" scoped>
  .advice-list{
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

  .textareas{
      width:450px;
      height:350px;
      resize:none;
      outline:none;
      margin-left:5px;
      padding:5px;
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