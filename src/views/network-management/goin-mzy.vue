<template>
    <div class="certifical-page">        

        <div class="network-change-language">
            <div style="font-size:20px">走进蔓之研</div>

            <span v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span>

        </div>

        <div class="titles">公司简介</div>
        <text-editor   @on-change="textChange"  :data="textEdia"  style="margin:20px;max-width:1400px;"></text-editor>

        <div class="titles">品牌简介</div>
        <text-editor   @on-change="textChange1"  :data="textEdia1"  style="margin:20px;max-width:1400px;"></text-editor>

        <div class="titles">品牌理念</div>
        <text-editor   @on-change="textChange2"  :data="textEdia2"  style="margin:20px;max-width:1400px;"></text-editor>

        <div class="titles">联系我们</div>

        <div class="information" style="margin:20px;">
            <span style="display:inline-block;width:70px;font-size:16px;">公司名:</span>
            <Input v-model="value2"  clearable style="width: 400px;margin-left:5px"></Input>
        </div>

        <div class="information" style="margin:20px;">
            <span style="display:inline-block;width:70px;vertical-align:top;font-size:16px;" >公司电话:</span>
            <Input v-model="value3"  clearable style="width: 400px;margin-left:5px" ></Input>
            <Input v-model="value5"  clearable style="width: 400px;margin-left:5px" ></Input>
        </div>

        <div class="information" style="margin:20px;">
            <span style="display:inline-block;width:70px; vertical-align:top;font-size:16px;" >公司地址:</span>
             <textarea  v-model="value4" style="width:400px;height:100px;outline:none;resize:none;margin-left:5px;padding:5px" value="dataList.companyAddRess"></textarea>
        </div>

        <div class="titles">品牌历程</div>

        <!--上传图片-->

        <div class="imgbox_up" style="margin:20px 20px 20px 50px;width:300px;">
            <div style="margin-bottom:15px;font-size:15px">背景图</div>
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

        <div class="imgbox_up" style="margin:20px 20px 20px 50px;width:300px;">
            <div style="margin-bottom:15px;font-size:15px">详情图</div>
            <img :src="upimg2" alt="" class="imgbox-img" style="width:300px;border:1px solid #ccc">
        </div>
        <div class="upload_btn">
            <Upload 
                :max-size="2048"
                :show-upload-list="false"
                :on-success="upimgSuccess2"
                :on-error="upimgError2"
                :on-format-error="upimgFormatError2"
                :format="['jpg','jpeg','png']"
                v-model="formInfo.mainPicUrl2"
                :action="$api.uploadImage">
              <Button type="info" style="margin: 0 0 20px 50px;display:block">选择图片</Button>
            </Upload>
        </div>

        <div class="titles">微店</div>

         <!--上传图片-->

        <div class="imgbox_up" style="margin:20px 20px 20px 50px;width:300px;">
            <div style="margin-bottom:15px;font-size:15px">微店二维码</div>
            <img :src="upimg1" alt="" class="imgbox-img" style="width:300px;border:1px solid #ccc">
          </div>
          <div class="upload_btn">
            <Upload 
                :max-size="2048"
                :show-upload-list="false"
                :on-success="upimgSuccess1"
                :on-error="upimgError1"
                :on-format-error="upimgFormatError1"
                :format="['jpg','jpeg','png']"
                v-model="formInfo.mainPicUrl1"
                :action="$api.uploadImage">
              <Button type="info" style="margin: 0 0 20px 50px;display:block">选择图片</Button>
            </Upload>
        </div>

        <div class="information" style="margin:20px;">
            <span style="display:inline-block;width:70px;vertical-align:top;font-size:16px;">公司电话:</span>
            <Input v-model="value3"  clearable style="width: 400px;margin-left:5px" ></Input>
            <Input v-model="value5"  clearable style="width: 400px;margin-left:5px" ></Input>
        </div>

        <div class="information" style="margin:20px;">
            <span style="display:inline-block;width:70px; vertical-align:top;font-size:16px;">公司地址:</span>
             <textarea  v-model="value4" style="width:400px;height:100px;outline:none;resize:none;margin-left:5px;padding:5px"></textarea>
        </div>

         <Button type="primary" style="font-size:16px;margin:20px 150px;" @click="saveSet">保存</Button>


    </div>
</template>

<script>
    import textEditor from  '../components/quill-editor/quill-editor.vue'
    export default{
        components: {
           textEditor
        },
        data(){
            return{
                textEdia:'',
                textEdia1:'',
                textEdia2:'',
                value2:'',
                value3:'',
                value4:'',
                value5:'',
                liststs:'',
                upimg:'',
                upimg2:'',
                listsEglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                // imghost:'http://img.xsmore.com/mzy',
                formInfo:{
                    mainPicUrl:'',
                    mainPicUrl1:'',
                    mainPicUrl2:'',
                },
                upimg1:'',
                dataList:'',
                

            }
        },
        beforeMount(){
            this.getList();
        },
        methods:{

            // 获取走进蔓之研的列表
            getList(){
                this.$request(this.$api.GetJoinManZhiYanInfo,{IsChanese:this.actionIndex},data=>{

                    this.dataList=data.value[0]; 
                    this.value2=this.dataList.companyName;
                    this.value3=this.dataList.companyTel;
                    this.value4=this.dataList.companyAddRess ;
                    this.value5=this.dataList.companyPhone;
                    this.upimg=this.dataList.zjBrandCourse;
                    this.upimg1=this.dataList.shopQrCode;
                    this.upimg2=this.dataList.zjBrandCourseDetail;
                    this.textEdia=this.dataList.companyIntroduce;
                    this.textEdia1=this.dataList.zjBrandEasyIntroductionLink;
                    this.textEdia2=this.dataList.zjBrandDreamValues;                  
                });
            },
             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.getList();
            },

            // 富文本编辑
            textChange(text){
                this.textEdia=text;
                // console.log(this.textEdia)
            },

            textChange1(text){
                this.textEdia1=text;
                // console.log(this.textEdia)
            },
            textChange2(text){
                this.textEdia2=text;
                // console.log(this.textEdia)
            },

            //上传图片
             upimgSuccess(res, file){
                 //console.log(res,file,this.imghost);
                 if(res.length>0){
                     this.upimg =this.imghost+res[0];
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

             //上传图片
             upimgSuccess1(res, file){
                 //console.log(res,file,this.imghost);
                 if(res.length>0){
                     this.upimg1 =this.imghost+res[0];
                     this.formInfo.mainPicUrl1 = res[0];
                 }
                 
             },
             upimgError1 (file) {
                 this.$Notice.warning({
                     title: '上传',
                     desc: file.name + '文件上传失败'
                 });


             },
             upimgFormatError1 (file) {
                 this.$Notice.warning({
                     title: '文件格式不正确',
                     desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
                 });
             },

             //上传图片
             upimgSuccess2(res, file){
                 //console.log(res,file,this.imghost);
                 if(res.length>0){
                     this.upimg2 =this.imghost+res[0];
                     this.formInfo.mainPicUrl2 = res[0];
                 }
                 
             },
             upimgError2 (file) {
                 this.$Notice.warning({
                     title: '上传',
                     desc: file.name + '文件上传失败'
                 });


             },
             upimgFormatError2 (file) {
                 this.$Notice.warning({
                     title: '文件格式不正确',
                     desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
                 });
             },

             // 保存
             saveSet(){
                 let palamer={
                    CompanyIntroduce:this.textEdia,
                    ZJBrandDreamValues:this.textEdia2,
                    ZJBrandEasyIntroductionLink:this.textEdia1,
                    CompanyName:this.value2,
                    CompanyTel:this.value3,
                    CompanyPhone:this.value5,
                    CompanyAddRess:this.value4,
                    ZJBrandCourse:this.upimg,
                    ShopQrCode:this.upimg1 ,
                    ZJBrandCourseDetail:this.upimg2,
                    IsChanese:this.actionIndex,
                    IsChanese:this.actionIndex
                 }
               

                 this.$request(this.$api.updateZouJinManZhiYanInfo,palamer,data=>{
                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                    }else{
                        this.$Message.error(data.message);
                    }
                 })
                 
             },


        },
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

    .titles{
        font-size: 20px;
        padding: 20px 20px 0 ;
        border-top:1px solid #ccc;
    }    
  }
</style>