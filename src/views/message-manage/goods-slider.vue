<template>
    <div class="goods-slider">
        <h1>商品轮播图</h1>

        <Button type="primary" style="margin:20px;" @click="addNew">新增</Button>
         <!-- 列表 -->
        <Table :columns="columns1" :data="data1" style="max-width:1403px;"></Table>

        <!-- 分页 -->
        <div style="margin-top: 20px;margin-left: 20px;">
           <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>
        </div>

        <!-- 编辑的弹框 -->
        <Modal
            v-model="modal1"
            :title="ediatitle" width="800" style="font-size:20px;">

            <div style="margin:20px;">
                <span style="display:inline-block;width:80px;font-size:16px;">序号:</span>
                <Input v-model="valueSort"  clearable style="width: 400px;margin-left:5px;font-size:16px;"></Input>
            </div>   

            <div style="margin:20px;">
                <span style="display:inline-block;width:80px;font-size:16px;">对应商品:</span>

                <Select v-model="goodsId" style="width:405px;" >
                    <Option :value="item.id" :key="item.id" v-for="item in list">{{item.productName}}</Option>
                </Select>

            </div>           


             <!--上传图片-->

                <div class="imgbox_up" style="margin: 20px ;width:250px;">
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
                    <Button  size="large"  type="primary"  @click="canselBtn">取消</Button>
                    <Button  size="large"  type="primary"  @click="saveBtn">保存</Button>
            </div>

        </Modal>

    </div>

   
</template>

<script>
    export default{
        data(){
            return{
                modal1:false,
                ediatitle:'编辑首页商品宣传图',
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                valueSort:'',
                list:[],
                goodsId:"",
                formInfo:{
                    mainPicUrl:'',
                },
                columns1: [
                    {
                        title: '序号',
                        key: 'sort',
                        align: 'center',
                        width:200,
                    },
                    {
                        title: '对应商品',
                        key: 'productName',
                        align: 'center',
                        width:400,
                    },
                    {
                        title: '宣传图',
                        key: 'imgUrl',
                        align: 'center',
                        width:200,
                        render: (h, params)=>{
                        return h('div', [
                            h('img',{
                                attrs: {
                                    src: this.imghost +params.row.imgUrl
                                },
                                style:{
                                    width: '130px'
                                },
                            })
                        ])
                      }
                    },
                    {
                        title: '添加时间',
                        key: 'addTime',
                        align: 'center',
                        width:300,
                    },
                    {
                        title: '操作',
                        key: '',
                        align: 'center',
                        width:300,
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
                                this.ediat(column.row)
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
                data1: [],
                pageIndex:1,
                pageSize:10,
                total:0,
                newLists:'',
                sortNumbers:'',
            }
        },
        beforeMount(){
            this.getList();
        },
        methods:{

            getList(){

                // 获取列表信息

                let palam={
                    PageIndex:this.pageIndex,
                    PageSize:this.pageSize
                }
    
                 this.$request(this.$api.newList,palam,data=>{
                    this.data1=data.result.resultList;
                    this.total=data.result.totalCount;
                    this.sortNumbers=this.data1.length;                        
                });

                 // 获取对应商品的列表
                this.$request(this.$api.getProductIdAndNameList, {}, data=>{
                     this.list = data || [];
                })

            },
            pageChange(){
                this.pageIndex = value;
                this.getList();
            },

            // 编辑列表
            ediat(record){
                this.ediatitle='编辑首页商品宣传图';
                this.newList=record;
                this.valueSort=record.sort;
                this.goodsId=record.productId || '';
                this.formInfo.mainPicUrl=record.imgUrl;
                this.upimg=this.imghost+record.imgUrl;
                this.modal1=true;
            },

            // 新增
            addNew(){
                this.newList="";
                this.ediatitle='新增首页商品宣传图';
                this.valueSort=this.sortNumbers+1;
                this.goodsId='';
                this.upimg="http://cdn.xiaojiankeji.com/images/other/default-img.png"
                this.modal1=true;

            },

            // 取消
            canselBtn(){
                this.modal1=false;
            },
            // 保存
            saveBtn(){                
                if(this.valueSort==''){
                    this.$Message.error('序号不能为空');
                    return false;
                };

                if( this.upimg =='http://cdn.xiaojiankeji.com/images/other/default-img.png'){
                    this.$Message.error('请上传图片');
                    return false;
                }

                let imgId;
                if(this.newList){
                    imgId=this.newList.id
                }else{
                    imgId=""
                };

                let palmer={
                    ImgId:imgId,
                    Sort:this.valueSort,
                    RelationProductId:this.goodsId,
                    ImgUrl:this.formInfo.mainPicUrl
                }

                this.$request(this.$api.newEdit,palmer, data=>{
                    if(data.isSuccess){
                        this.$Message.success('编辑成功');
                        this.getList();
                        this.modal1=false;
                    }else{
                        this.$Message.error(data.message);
                    }
                })               


            },

            // 删除产品
            deleteProduct(recor){
                let dele={
                    ImgId:recor.id
                }

                this.$request(this.$api.newDelete,dele, data=>{
                    if(data.isSuccess){
                        this.$Message.success('删除成功');
                        this.getList();
                    }else{
                        this.$Message.error(data.message);
                    }
                })   

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
    .goods-slider{
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
</style>