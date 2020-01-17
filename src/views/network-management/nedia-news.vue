<template>
    <div class="media-news">

        <div class="network-change-language">
            <div style="font-size:20px">媒体新闻</div>
            <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span>

        </div>

        <Button type="primary" style="margin:20px;" @click="newAdd">新增</Button>

        <!-- 表格 -->

         <Table :columns="columns1" :data="data1" style="max-width:1700px;"></Table>

         <!-- 分页 -->

        <div style="margin-top: 20px;margin-left: 20px;">
          <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div>


        <!-- 新增修改新闻的弹框 -->

        <Modal
            v-model="modal1"
            :title="ediatitle" width="900">   

            <div style="margin:20px;">
                <span style="display:inline-block;width:100px">新闻标题</span>
                <Input v-model="valueTitle"  clearable style="width: 450px;margin-left:5px;"></Input>
            </div>

            <div style="margin:20px;">
                <span style="display:inline-block;width:100px">新闻时间</span>
                 <DatePicker type="date"  v-model="valueTime" placeholder="请选择新闻时间" style="width: 450px;margin-left:5px" @on-change="changeData"></DatePicker>
                <!-- <Input v-model="valueTime"  clearable style="width: 200px;margin-left:5px;"></Input> -->
            </div>  

            <div style="margin:20px;">
                <span style="display:inline-block;width:100px">新闻来源网站</span>
                <Input v-model="sourseNet"  clearable style="width: 450px;margin-left:5px;"></Input>
            </div>


             <!--上传图片-->

                  <div class="imgbox_up" style="margin: 20px ;width:300px;">
                    <div style="margin-bottom:15px;display:inline-block;width:100px">新闻配图</div>
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


                  <!-- 新闻描述 -->

                  <div class="news-discrib">
                      <span style="display:inline-block;width:100px" >新闻描述</span>
                      <textarea v-model="newDes"></textarea>
                  </div>

                  <!-- 新闻链接 -->

                <div style="margin:20px;">
                    <span style="display:inline-block;width:100px">新闻链接</span>
                    <Input v-model="newLink"  clearable style="width: 500px;margin-left:5px;"></Input>
                 </div>


            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary"  @click="saveBtn">保存</Button>
            </div>

        </Modal>

        <Switch v-model="switch1" @on-change="change"></Switch>

    </div>

</template>

<script>
    export default{
        data(){
            return{
                pageSize:10,
                PageIndex:1,
                total:0,
                numbers:0,
                modal1:false,
                valueTitle:'',
                valueTime:'',
                newList1:'',
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                newUpimg:'',
                isRecommands:0,
                isPushs:0,
                switch1: false,
                ediatitle:'编辑新闻',
                newDes:'',
                newLink:'',
                sourseNet:'',
                formInfo:{
                    mainPicUrl:'',
                },
                listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                columns1: [
                    // {
                    //     title: '排序',
                    //     key: 'disPlayOrder',
                    //     align: 'center',
                    //     width:200,
                    // },
                    {
                        title: '标题',
                        key: 'name',
                        align: 'center',
                        width:350,
                    },{
                        title: '标题配图',
                        key: 'picUrl',
                        align: 'center',
                        width:250,
                        render: (h, params)=>{
                        return h('div', [
                            h('img',{
                                attrs: {
                                    src: this.imghost +params.row.picUrl
                                },
                                style:{
                                    width: '130px'
                                },
                            })
                        ])
                      }
                    },
                    {
                        title: '是否主推',
                        key: 'isPush',
                        align: 'center',
                        width:195,
                        render: (h, params) => {
                          return h('div', [
                              h('i-switch', {
                                  props:{
                                      'value': params.row.isPush
                                  },
                                  on:{
                                      'on-change':()=>{
                                          this.changeState(params.row);
                                      }
                                  }
                              })
                          ])
                        }
                    },{
                        title: '是否显示在首页',
                        key: 'isRecommand',
                        align: 'center',
                        width:200,
                        render: (h, params) => {
                          return h('div', [
                              h('i-switch', {
                                  props:{
                                      'value': params.row.isRecommand
                                  },
                                  on:{
                                      'on-change':()=>{
                                          this.showHead(params.row);
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
                        width:250,
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
                                        this.deleteNews(column.row);
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
           this.newList();
        },
        methods:{
            newList(){

                let pala={
                    indexPage:this.PageIndex,
                    Take:this.pageSize,
                    IsChanese:this.actionIndex
                }

                this.$request(this.$api.GetNewsList,pala,data=>{
                    this.total=data.key;
                    this.data1=data.value;
                })

            },
             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.PageIndex=1;
                this.newList();
            },
            // 分页
            pageChange(value){
                this.PageIndex =value;
                this.newList();
                console.log(this.PageIndex)
            },

            // 改变主推状态
            changeState(record){               
                let states={
                    Id:record.id,
                }

                this.$request(this.$api.changeNewsPush,states,data=>{
                     if(data.isSuccess){
                        this.$Message.success('修改成功!');
                        this.newList();
                    }else{
                        this.$Message.error(data.message);
                        this.newList();
                    }
                })

            },

            // 改变是否显示在首页         

            showHead(reco){
                let showHeads={
                    Id:reco.id,
                    IsChanese:this.actionIndex
                }
                
                this.$request(this.$api.changeNewsRecommand,showHeads,data=>{
                     if(data.isSuccess){
                        this.$Message.success('修改成功!');

                        this.newList();
                    }else{
                        this.$Message.error(data.message);
                        this.newList();
                    }
                })

            },

             change (status) {
                this.$Message.info('开关状态：' + status);
            },

            // 删除
            deleteNews(recordList){
                console.log(recordList);
                let newLists={
                    Id:recordList.id
                };

                this.$request(this.$api.DeleteNews,newLists,data=>{                  

                    if(data.isSuccess){
                        this.$Message.success('删除成功!');
                        this.newList();
                    }else{
                        this.$Message.error(data.message);
                    }
                });

            },

            // 编辑新闻
            editNew(list){
               this.ediatitle="编辑新闻";
               this.valueTitle=list.name;
               this.valueTime=list.addTime;
               this.newDes=list.newsTitle;
               this.upimg='http://img.xsmore.com/mzy'+list.picUrl
               this.newLink=list.linkUrl;
               this.modal1=true;
               this.newList1=list;
               this.sourseNet=list.fromNetWork;

            },

            // 编辑新闻的保存
            saveBtn(){

                if(this.valueTitle==''){
                    this.$Message.error('请输入新闻标题');
                    return false;
                };

                if(this.valueTime==''){
                    this.$Message.error('请输入新闻时间');
                    return false;
                };

                if(this.sourseNet==''){
                    this.$Message.error('请输入新闻来源网站');
                    return false;
                };
                if(this.upimg=='http://cdn.xiaojiankeji.com/images/other/default-img.png'){
                    this.$Message.error('请上传新闻图片');
                    return false;
                 }

                if(this.newDes==''){
                    this.$Message.error('请输入新闻描述');
                    return false;
                }

                if(this.newLink==''){
                    this.$Message.error('请输入新闻链接');
                    return false;
                }


                this.newUpimg= this.upimg.replace("http://img.xsmore.com/mzy","");

                 if(this.newList1.isRecommand==true){
                    this.isRecommands=1;
                 }else{
                    this.isRecommands=0;
                 }


                if(this.newList1.isPush==true){
                    this.isPushs=1;
                 }else{
                    this.isPushs=0;
                 }


                 let edit={
                     Id:this.newList1.id || 0,
                     Name:this.valueTitle,
                     FromNetWork:this.sourseNet,
                     IsRecommand:this.isRecommands || 0 ,
                     PicUrl:this.newUpimg,
                     LinkUrl:this.newLink ,
                     IsPush:this.isPushs || '0',
                     NewsTitle:this.newDes ,
                     DisPlayOrder:this.newList1.disPlayOrder,
                     AddTime: this.valueTime,
                     IsChanese:this.actionIndex
                }

               this.$request(this.$api.updateNews,edit,data=>{ 
                 if(data.isSuccess){
                    this.$Message.success('编辑成功!');
                        this.newList();
                    }else{
                        this.$Message.error(data.message);
                    }
               });

                this.modal1=false;

            },

        // 新增新闻
        newAdd(){
            this.ediatitle="新增新闻"
            this.valueTitle='';
            this.valueTime='';
            this.newLink='';
            this.newDes='';
            this.upimg='http://cdn.xiaojiankeji.com/images/other/default-img.png';
            this.modal1=true;
            this.newList1='';
            this.sourseNet='';
        },

        // 改变时间
        changeData(value){
            this.valueTime=value;
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


       

        },
    }
</script>

<style lang="less" scoped>

  .media-news{
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

    .title-box{
        display:inline-block;
        width:80px;
        text-align:right;
    }

    .news-discrib{
        margin:45px  20px 15px;
        textarea{
            width:400px;
            height:200px;
            resize:none;
            outline:none;
            margin-left:10px;
            padding:10px;
        }
        span{
            vertical-align:188px;
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