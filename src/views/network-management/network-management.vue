<template>
	
	<div class="networkhead">
        <div class="network-change-language">
		  <div style="font-size: 20px">首页信息</div>
          <!-- <div class="change-tab" :class="{'change-tab-action':tabAction}">中文版</div> -->

          <div v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)">
              <div class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}</div>
          </div>

        </div>

        <h2 class="componey-news">公司介绍</h2>
        <text-editor   @on-change="textChange"  :data="textEdia"  style="margin:20px;max-width:1400px;"></text-editor>

		<h2 class="componey-news">新闻动态</h2>

         <!--上传图片-->

         <div class="imgbox_up" style="margin: 20px ;width:300px;min-height:100px;border:1px solid #ddd">            
             <img :src="upimg" alt="" class="imgbox-img" style="width:300px;">
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
               <Button type="info" style="margin: 0 20px 45px;display:block">选择图片</Button>
             </Upload>
         </div>

         <div class="imgbox_up" style="margin: 20px ;width:300px;min-height:100px;border:1px solid #ddd">            
             <img :src="upimg1" alt="" class="imgbox-img" style="width:300px;">
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
               <Button type="info" style="margin: 0 20px 45px;display:block">选择图片</Button>
             </Upload>
         </div>



         <input type="text" name="" placeholder="请输入新闻标题" class="pleaseTitle" v-model="newsTitle" >

         <textarea placeholder="请输入新闻介绍" class="textBox" v-model="newDetails" @on-change="textChange1" ></textarea>

         <div style="margin:20px;font-size:18px;">
           <span>新闻链接</span>
           <Input v-model="valueNew"  clearable style="width: 450px;margin-left:5px;"></Input>
         </div>


         <div class="network-button" @click="saveBtn" style="cursor:pointer;">保存</div>


	</div>
	
</template>

<script type="text/javascript">
    import textEditor from  '../components/quill-editor/quill-editor.vue'	
	export default{
		name:'networkManagement',

        data(){

            return{
                news:'',
                news1:'',
                newsTitle:'',
                newDetails:'',
                mainImg:'',
                bigImg:'',
                upimg:'',
                upimg1:'',
                valueNew:'',
                newsIntroduce:'',
                textEdia:'',
                listsEglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                formInfo:{
                    mainPicUrl:'',
                    mainPicUrl1:''
                },
            }

        },
         beforeMount(){
            this.getDatas();
        },
        components: {
           textEditor
        },
        methods:{
         getDatas(){

                let palmer={
                   IsChanese:this.actionIndex 
                }
                this.$request(this.$api.GetPcIndexInfo,palmer,data=>{
                
                   this.newsTitle=data.result.newsTitle;
                   this.newDetails=data.result.newsIntroduce;
                   this.upimg=this.imghost+data.result.newsPicSmall;
                   this.formInfo.mainPicUrl=data.result.newsPicSmall;
                   this.upimg1=this.imghost+data.result.newsPicBig;
                   this.formInfo.mainPicUrl1=data.result.newsPicBig;
                   this.valueNew=data.result.newsLinkUrl;
                   this.newsIntroduce=data.result.newsIntroduce;
                   this.textEdia=data.result.companyIntroduceAdmin
                })
            },

            // 点击保存
            saveBtn(){

              let headMess={
                NewsPicSmall:this.formInfo.mainPicUrl,
                NewsPicBig:this.formInfo.mainPicUrl1,
                NewsTitle:this.newsTitle,
                NewsIntroduce:this.newDetails,
                NewsLinkUrl:this.valueNew,
                IsChanese:this.actionIndex,
                CompanyIntroduceAdmin:this.textEdia

              }
  
              //return;



              this.$request(this.$api.updatePcIndexInfo,headMess,data=>{
                  if(data.isSuccess){
                      this.$Message.success('修改成功');
                      this.getDatas();
                  }else{
                     this.$Message.error(data.message);
                  }
              })
                
            },

            //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.getDatas();
            },

            //上传图片
            upimgSuccess(res, file){
                //console.log(res,file,this.imghost);
                if(res.length>0){
                    this.upimg =this.imghost+ res[0];
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

            // 上传图片
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

             // 富文本编辑
            textChange(text){
                this.textEdia=text;
                // console.log(this.textEdia)
            },

             // 富文本编辑
            textChange1(text){
                this.newDetails=text;
                // console.log(this.textEdia)
            },


        }
		

	}
</script>

<style  lang="less">
	 @import "./network-management.less";
</style>