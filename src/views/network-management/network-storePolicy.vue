<template>
    <section>
        <div class="network-storePolicy">

            <div class="network-change-language">
                <div style="font-size:20px">媒体新闻</div>
                <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'   change-tab-action':actionIndex==list.id}">{{list.value}}
                </span>

            </div>

            <div class="imgbox_up" style="margin: 20px ;width:300px;">
              <div style="margin-bottom:15px;display:inline-block;width:90px;font-size:17px;">顶部图片</div>
              <img :src="dataList.topPicUrl? imghost+dataList.topPicUrl:upimg" alt="" class="imgbox-img" style="width:300px;border:1px solid #ccc">
            </div>

            <div class="upload_btn">
                <Upload 
                    :max-size="2048"
                    :show-upload-list="false"
                    :on-success="upimgSuccess"
                    :on-error="upimgError"
                    :on-format-error="upimgFormatError"
                    :format="['jpg','jpeg','png']"
                    v-model="dataList.topPicUrl "
                    :action="$api.uploadImage">
                  <Button type="info" style="margin-left:20px;display:block">选择图片</Button>
                </Upload>
            </div>


         <!--    <Input  v-model="dataList.brandIntroduce" clearable class="titles" style="margin-top:20px;" />
            <text-editor   @on-change="textChange"  :data="dataList.brandIntroduceDetail"  style="margin:20px;max-width:1400px;"></text-editor> -->

            <Input  v-model="dataList.joinRequire " clearable class="titles" style="margin-top:20px;" />
            <text-editor   @on-change="textChange1"  :data="dataList.joinRequireDetail "  style="margin:20px;max-width:1400px;"></text-editor>

            <Input  v-model="dataList.marketPosition" clearable class="titles"  />
            <text-editor   @on-change="textChange2"  :data="dataList.marketPositionDetail "  style="margin:20px;max-width:1400px;"></text-editor>

            <Input  v-model="dataList.costExplain" clearable class="titles"  />
            <text-editor   @on-change="textChange3"  :data="dataList.costExplainDetail"  style="margin:20px;max-width:1400px;"></text-editor>

            <Input  v-model="dataList.joinStep " clearable class="titles"  />
            <text-editor   @on-change="textChange4"  :data="dataList.joinStepDetail "  style="margin:20px;max-width:1400px;"></text-editor>

            <Input  v-model="dataList.orderGoogsRequire " clearable  class="titles" />
            <text-editor   @on-change="textChange5"  :data="dataList.orderGoogsRequireDetail "  style="margin:20px;max-width:1400px;"></text-editor>

            <Input  v-model="dataList.joinSupport" clearable  class="titles" />
            <text-editor   @on-change="textChange6"  :data="dataList.joinSupportDetail"  style="margin:20px;max-width:1400px;"></text-editor>

            <Input  v-model="dataList.visionPic" clearable  class="titles" />

            <!-- 上传图片 -->
            <div v-for="(item,index1) in dataList.visionPicList" :key="index1" style="margin-bottom:35px;" v-if="dataList.visionPicList">
                <div class="adressers">
                    <span style="height:32px;line-height:32px;display:inlink-block">地址{{index1+1}}</span>
                    <Input  v-model="item.name" clearable class="titles" />
                </div>
                <div class="picture-box">
                    <div v-for="(list,index) in item.picUrl" :key="index" style="margin:0 0 0 20px;" @click="changeImg(item,index)" >
                        <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-success="handleSuccess" 
                            :action="$api.uploadImage"
                            style="display: inline-block;width:100px;">
                            <div style="width: 100px;height:100px;line-height: 110px;text-align:center;border:1px dashed #ddd; cursor:pointer; overflow:hidden">
                                <img v-if="list.length" :src="imghost+list" style="width:100%"/>
                                <Icon v-else type="plus" size="26" style="color:#999"></Icon>
                            </div>
                        </Upload>

                        <span style="vertical-align:40px;margin:0 10px;" v-if="showDelete">
                            <Icon @click.native="removeItem(item,index)" type="minus-circled" style="color:#f84444;cursor:pointer" size="26"></Icon>
                        </span>
                    </div>

                </div>

                <div style="padding-left:30px;padding-top:20px;"> <Button type="dashed" icon="plus" @click="addData(item)">添加</Button></div>
            </div>

            <Button type="primary" style="margin:30px 20px;" @click="addMores">添加更多</Button>

            <!-- 加盟咨询 -->
            <div class="imgbox_up" style="margin: 20px ;width:300px;">
              <Input  v-model="dataList.joinConsult" clearable style="margin-bottom:20px;" />

              <div class="m-phones">
                    <div style="margin-bottom:10px;">加盟电话:</div>
                    <Input  v-model="dataList.joinPhone" clearable style="margin-bottom:20px;" />
              </div>

              <div class="m-phones">
                    <div style="margin-bottom:10px;">电子邮箱:</div>
                    <Input  v-model="dataList.joinEmail" clearable style="margin-bottom:20px;" />
              </div>


              <div class="m-phones">
                    <div style="margin-bottom:10px;">微信二维码:</div>
                    <img :src="dataList.weixinCode? imghost+dataList.weixinCode:upimg1" alt="" class="imgbox-img" style="width:300px;border:1px solid #ccc">
              </div>
            </div>

            <div class="upload_btn">
                <Upload 
                    :max-size="2048"
                    :show-upload-list="false"
                    :on-success="upimgSuccess1"
                    :on-error="upimgError1"
                    :on-format-error="upimgFormatError1"
                    :format="['jpg','jpeg','png']"
                    v-model="dataList.weixinCode"
                    :action="$api.uploadImage">
                  <Button type="info" style="margin-left:20px;display:block">选择图片</Button>
                </Upload>
            </div>

            <Button type="primary" style="margin:30px 20px;" @click="saveDatas">保存</Button>


        </div>
        
    </section>
</template>

<script>
    import textEditor from  '../components/quill-editor/quill-editor.vue';
    export default{
        components: {
           textEditor,
        },

        data(){
            return{
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
                upimg1:'http://cdn.xiaojiankeji.com/images/other/default-img.png',             
                listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                dataList:{} ,
                showDelete:true           

            }
        },
        beforeMount(){
            this.getDatas();
        },
        methods:{

            //获取数据
            getDatas(){
                let palam={
                    IsChanese:this.actionIndex
                }
                this.$request(this.$api.PcStorePolicyModel,palam,data=>{

                    if(data.isSuccess){
                       this.dataList=data.result;
                       this.dataList.visionPicList.map(items=>{                         
                          items.uids=this.guid();
                          return items
                       })
                    }

                })
            },

             //tab的切换
            tabsChange(list){
                this.actionIndex=list.id;
                this.dataList.isChanese=list.id;
                this.getDatas();
            },
            //上传图片
            upimgSuccess(res, file){
                //console.log(res,file,this.imghost);
                if(res.length>0){
                    this.upimg = this.imghost + res[0];
                    this.dataList.topPicUrl  = res[0];
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
            // 富文本编辑
            textChange(text){
                this.dataList.brandIntroduceDetail=text;
            },

            // 富文本编辑
            textChange1(text){
                this.dataList.joinRequireDetail=text;
            },

            // 富文本编辑
            textChange2(text){
                this.dataList.marketPositionDetail=text;
            },

            // 富文本编辑
            textChange3(text){
                this.dataList.costExplainDetail=text;
            },

            // 富文本编辑
            textChange4(text){
                this.dataList.JoinStepDetail=text;
            },

            // 富文本编辑
            textChange5(text){
                this.dataList.orderGoogsRequireDetail=text;
            },

            // 富文本编辑
            textChange6(text){
                this.dataList.joinSupportDetail=text;
            },
            handleSuccess(data){
                this.dataList.visionPicList.map(item=>{
                    if(item.uids == this.pics.uids){
                         this.$set(item.picUrl,this.showsImg,data[0])
                    }

                });
            },

            changeImg(item,index){
                this.pics=item;
                this.showsImg=index;
            },
            removeItem(item,index){
                item.picUrl.splice(index,1)
            },

            addData(item){ 
                const data = '';
                item.picUrl.push(data);

            },

            addMores(){
                let pushData={
                    name:'',
                    uids:this.guid(),
                    picUrl:[''],
                }
                this.dataList.visionPicList.push(pushData); 

            },


            guid(){
                var a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};
                return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()
            },

            saveDatas(){

                let  palma={
                    IsChanese:this.actionIndex,
                    PcStorePolicyUpdateList:this.dataList
                }
                

                this.$request(this.$api.PcStorePolicyUpdate,palma,data=>{
                   
                    if(data.isSuccess){
                        this.$Message.success(data.message || '保存成功');
                        this.getDatas();
                    }else{
                        this.$Message.error(data.message || '保存失败')
                    }
                },null, ()=>{}, true)



            },

            upimgSuccess1(res, file){
                //console.log(res,file,this.imghost);
                if(res.length>0){
                    this.upimg1 = this.imghost + res[0];
                    this.dataList.weixinCode  = res[0];
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


        },

        watch:{
            //深监听
            editData: {
                handler: function () {
                    console.log(this.editData,999997)
                },
                deep: true
            }
         }    


    }
</script>

<style lang="less" scoped>
    .network-storePolicy{
        overflow-x: hidden;
        overflow-y: auto;
        height: 98%;
        background: #fff;
        position: absolute;
        width:99%;
        .titles{
            font-size: 17px;
            margin:0 20px 0;
            width:200px;
        }

        .picture-box{
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-flex-wrap: wrap;
            -webkit-box-lines: multiple;
            -moz-flex-wrap: wrap;
            flex-wrap: wrap
        }
        .adressers{
            font-size:16px;
            margin:20px;
        }

        .m-phones{
            font-size:15px;
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