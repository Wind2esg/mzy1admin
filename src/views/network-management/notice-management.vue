<template>
    <div class="notice-mange" >
        <div v-show="noticeShow">

            <div class="network-change-language">
                <div style="font-size:20px">公告管理</div>
                <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
                </span>

            </div>

             <Button type="primary" style="margin:20px;" @click="addNews">新增</Button>
    
             <!-- 表格 -->
             <Table :columns="columns1" :data="data1"></Table>
    
             <!-- 分页 -->
             <div style="margin-top: 20px;margin-left: 20px;">
                     <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
             </div>
        </div>

        <div v-show="ediaShow">
            <h1>编辑公告</h1>
    
            <div style="margin:20px">
                 <span style="display:inline-block;width:70px;">排序</span>
                 <Input v-model="value1"  clearable style="width: 350px;margin-left:5px;"></Input>
            </div>

            <div style="margin:20px">
                 <span style="display:inline-block;width:70px;">公告标题</span>
                 <Input v-model="value2"  clearable style="width: 350px;margin-left:5px;"></Input>
            </div>

            <div style="margin:20px">
                 <span style="display:inline-block;width:70px;">创建时间</span>
                 <!-- <Input v-model="value3"  clearable style="width: 350px;margin-left:5px;"></Input> -->
                  <DatePicker type="date"  v-model="value3" style="width: 350px;margin-left:5px;" ></DatePicker>
            </div>

            <!--上传图片-->
            <div style="margin:20px;">公告详情</div>
            <div class="imgbox_up" style="margin: 20px ;width:200px;min-height:100px;border:1px solid #ddd;box-sizing: border-box;">            
                <img :src="upimg" alt="" class="imgbox-img" style="width:197px;">
            </div>
            <div class="upload_btn">
                <Upload 
                    :max-size="2048"
                    :show-upload-list="false"
                    :on-success="upimgSuccess"
                    :on-error="upimgError"
                    :on-format-error="upimgFormatError"
                    :format="['jpg','jpeg','png']"
                    v-model="mainPicUrl"
                    :action="$api.uploadImage">
                  <Button type="info" style="margin: 0 20px 45px;display:block">选择图片</Button>
                </Upload>
            </div>

            <!-- 富文本编辑 -->
           <!--   <text-editor   @on-change="textChange"  :data="textEdia"  style="margin:20px;max-width:1400px;"></text-editor> -->

             <Button  style="margin:20px" @click="cansels">取消</Button>
             <Button type="primary" style="margin:20px 20px 20px 0"  @click="clickSave">保存</Button>

            


        </div>

    </div>


</template>

<script>
// import textEditor from '../../components/quill-editor/quill-editor.vue'

import textEditor from  '../components/quill-editor/quill-editor.vue'

    export default{
        components: {
           textEditor
        },
        data(){
            return{
                 pageSize:10,
                 pageIndex:1,
                 total:0,
                 noticeShow:true,
                 ediaShow:false,
                 value1:'',
                 value2:'',
                 textEdia:'',
                 value3:'',
                 upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                 mainPicUrl:'',
                 newList:{},
                 listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                 columns1: [
                    {
                        title: '排序',
                        key: 'disPlayOrder',
                        align:'center'
                    },
                    {
                        title: '标题',
                        key: 'name',
                        align:'center'
                    },
                    {
                        title: '是否开启',
                        key: 'isDisPlay',
                        align:'center',
                        render:(h,params)=>{
                            return h('div',[
                                h('i-switch',{
                                    props:{
                                        'value': params.row.isDisPlay
                                    },
                                    on:{
                                        'on-change':()=>{
                                            this.isDiaplay(params.row)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'addTime',
                        align:'center'
                    },
                    {
                        title: '操作',
                        key: '',
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
                data1: []
            }
        },
        beforeMount(){
            this.GetNoticeList();
        },
        methods:{
            GetNoticeList(){

                let plama={
                    indexPage:this.pageIndex,
                    Take:this.pageSize,
                    IsChanese:this.actionIndex
                }

                this.$request(this.$api.GetNoticeList,plama,data=>{
                    this.data1=data.value;
                    this.total=data.key;

                })

            },

             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.pageIndex=1;
                this.GetNoticeList();
            },

            // 分页
            pageChange(value){
                this.pageIndex = value;
                this.GetNoticeList();
            },

            // 富文本编辑
            textChange(text){
                this.textEdia=text;
                // console.log(this.textEdia)
            },

            //上传图片
            upimgSuccess(res, file){
                //console.log(res,file,this.imghost);
                if(res.length>0){
                    this.upimg =this.imghost+ res[0];
                    this.mainPicUrl = res[0];
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

            // 保存编辑

            clickSave(){

                let saveList={
                    Id:this.newList.id || 0,
                    Name:this.value2,
                    LinkUrl:this.newList.linkUrl || '1',
                    Content:this.mainPicUrl,
                    DisPlayOrder:this.value1,
                    IsChanese:this.actionIndex
                }


                this.$request(this.$api.updateNotice,saveList,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.GetNoticeList();
                        this.noticeShow=true;
                        this.ediaShow=false;

                    }else{
                        this.noticeShow=false;
                        this.ediaShow=true;
                        this.$Message.error(data.message)
                    }
                });

                
            },

            // 新增
            addNews(){

                this.value1='';
                this.value2='';
                this.value3='';
                this.newList='';
                this.textEdia='';
                this.mainPicUrl=''
                this.noticeShow=false;
                this.ediaShow=true;
                this.upimg ='http://cdn.xiaojiankeji.com/images/other/default-img.png';
                
            },

            // 取消
            cansels(){
                this.noticeShow=true;
                this.ediaShow=false;
            },

            // 编辑
            editList(record){
                this.value1=record.disPlayOrder;
                this.value2=record.name;
                this.value3=record.addTime;
                this.mainPicUrl=record.content;
                this.noticeShow=false;
                this.ediaShow=true;
                this.newList=record;
                this.textEdia=record.content;
                this.upimg =this.imghost+record.content; 
                console.log(this.mainPicUrl,666)
            },

            // 是否上下架
            isDiaplay(record){
                let palam={
                    Id:record.id,
                }

                this.$request(this.$api.GetchangeNoticeState,palam,data=>{
                    if(data.isSuccess){
                        this.$Message.success('修改成功');
                        this.GetNoticeList();
                    }else{
                        this.$Message.error(data.message);
                    }
                })
            },

            // 删除公告
            deleteList(record){
                console.log(record)
                let delet={
                    Id:record.id,
                }

                this.$request(this.$api.DeleteNotice,delet,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.GetNoticeList();
                    }else{
                        this.$Message.error(data.message); 
                    };
                })
            },

        },

    }
</script>

<style lang="less" scoped>
 .notice-mange{
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