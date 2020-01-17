<template>
        <div class="certifical-page">
            <div class="network-change-language">
                <div style="font-size:20px">加盟须知</div>

                <span v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
                </span>

            </div>

            <Button type="primary" style="margin:20px;" @click="addList">新增</Button>

            <!-- 表格 -->

            <Table :columns="columns1" :data="data1" style="max-width:1305px" ></Table>

            <!-- 分页 -->
            <div style="margin-top: 20px;margin-left: 20px;">
               <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
            </div>

            <!-- 分组的弹框 -->

            <Modal
                v-model="modal3"
                :title="sorts" width="700" style="font-size:18px;"> 

                <div style="margin:20px">
                    <span style="display:inline-block;width:80px">排序</span>
                    <Input v-model="value12"  clearable style="width: 200px"></Input>
                </div>   

                <div style="margin:20px">
                    <span style="display:inline-block;width:80px">名称</span>
                    <Input v-model="value13"  clearable style="width: 200px"></Input>
                </div> 

                <div class="pictures-omgs">
                    <div style="margin:20px">配图</div>
                    <div>
                       <div class="imgbox_up" style="margin-right: 20px;" @click="upimg_visible=true">
                         <img :src="upimg" alt="" class="imgbox-img" style="width:200px;border:1px solid #ddd;margin:20px 40px;">
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
                           <Button type="info" >图片选择</Button>
                         </Upload>
                        
                       </div>
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
                pageIndex:1,
                pageSize:10,
                total:0,
                modal3:false,
                sorts:'新建分组',
                value12:"",
                value13:'',
                newList:{},
                upimg_visible:false,
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                listsEglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                formInfo:{mainPicUrl:''},
                columns1: [
                    {
                        title: '排序',
                        key: 'sort',
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
                        title: '配图',
                        key: 'picUrl',
                        align:'center',
                        width:200,
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
                        key: 'isDisplay',
                        align:'center',
                        width:200,
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
                                this.manages(column.row)
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
            this.getList();

        },

        methods:{
            // 获取一级分组数据
            getList(){
                let pala={
                    indexPage:this.pageIndex,
                    Take:this.pageSize,
                    IsChanese:this.actionIndex
                }
                this.$request(this.$api.PcJoiningInstructions,pala,data=>{
                    console.log(data,666)
                    this.total=data.key;
                    this.data1=data.value;
                })
            },

             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.getList();
            },

            // 分页
            pageChange(value){
                this.pageIndex = value;
                this.getList();
            },

            // 编辑
            ediat(record){                
                this.value12=record.sort;
                this.value13=record.name;
                this.newList=record;
                this.modal3=true;
                this.formInfo.mainPicUrl=record.picUrl
                console.log(record)
            },

            // 新增
            addList(){
                this.value12='';
                this.value13="";
                this.newList="";
                this.formInfo.mainPicUrl='';
                this.modal3=true;

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

            // 是否开启
            changeState(record){
                console.log(record)

                let pala={
                    Id:record.id,
                }

                this.$request(this.$api.PcJoiningInstructionsIsDisplay,pala,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                    }else{
                        this.$Message.error(data.message)
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
                    Sort:this.value12,
                    IsChanese:this.actionIndex,
                    PicUrl:this.formInfo.mainPicUrl
                }

                this.$request(this.$api.PcJoiningInstructionsUpdate,serise,data=>{
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
                this.$request(this.$api.PcJoiningInstructionsDel,deletes,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                    }else{
                        this.$Message.error(data.message);
                    }
                });
            },

            //管理
            manages(record){
                this.$router.push({
                     name:'GroupManagements',
                     query:{
                        Id:record.id,

                     }
                })
            },

        },

        watch:{

            modal3(){
                if(this.formInfo.mainPicUrl) {
                    this.upimg = this.imghost + this.formInfo.mainPicUrl;
                }else {
                    this.upimg = 'http://cdn.xiaojiankeji.com/images/other/default-img.png';
                }
            }

        }

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

  .pictures-omgs{
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }
</style>