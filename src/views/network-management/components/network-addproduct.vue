<style lang="less">
.Modal_from_product {
  
  .fromInput {
    width: 250px;
  }
  .imgbox_up{
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px solid #e1e2e3;
    overflow: hidden;
    float: left;
    cursor: pointer;
  }
  .imgbox-img{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    display: block;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .price_title{
    color: #656565;
    font-weight: bold;
    font-size: 14px;
  }
}

.product_warper{
    height: 100%;
    overflow: auto;
}


</style>
<template>
<div class="product_warper">  


  <Card  v-show="isShow">
    <p slot="title">产品基本信息</p>


    <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="160" class="Modal_from Modal_from_product">


      <FormItem label="产品序号">
        <Input v-model="formInfo.sort" class="fromInput"></Input>
      </FormItem>

      <FormItem label="产品名称" prop="productName">
        <Input v-model="formInfo.productName" class="fromInput"></Input>
      </FormItem>

      <FormItem label="英文名" prop="productEnglishName">
        <Input v-model="formInfo.productEnglishName" class="fromInput"></Input>
      </FormItem>

      <FormItem prop="retailPrice" label="商品规格"> 
        <Input v-model="formInfo.rules" class="fromInput"></Input>
      </FormItem>

      <FormItem prop="productType" label="所属系列">
        <Select  v-model="formInfo.productType" class="fromInput">
            <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{ item.name}}</Option> 
        </Select>
      </FormItem>

      <FormItem prop="direction" label="产品描述"> 
        <Input v-model="formInfo.direction" class="fromInput"></Input>
      </FormItem>


      <FormItem label="商品主图">
        <div class="imgbox_up" style="margin-right: 20px;" @click="upimg_visible=true">
          <img :src="upimg" alt="" class="imgbox-img">
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
          <div>尺寸:1000X360px</div>
        </div>
      </FormItem>

      <FormItem label="背景图">
        <div class="imgbox_up" style="margin-right: 20px;" @click="upimg_visible1=true">
          <img :src="upimg1" alt="" class="imgbox-img">
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
            <Button type="info" >图片选择</Button>
          </Upload>
          <div>尺寸:1720x960px</div>
        </div>
      </FormItem>

      <FormItem label="PNG详情图">
        
        <div class="imgbox_up" style="margin-right: 20px;" @click="detailsImg_visible=true">
          <img :src="detailsImg" alt="" class="imgbox-img">
        </div>
        <div class="upload_btn">
          <Upload 
              :max-size="2048"
              :show-upload-list="false"
              :on-success="detailsImgSuccess"
              :on-error="detailsImgError"
              :on-format-error="detailsImgFormatError"
              :format="['jpg','jpeg','png']"
              v-model="formInfo.detailsImg"
              :action="$api.uploadImage">
            <Button type="info" >图片选择</Button>
          </Upload>
          <div>尺寸:1000x4500px</div>
        </div>
      </FormItem>

      <FormItem label="手机端PNG详情图">
        
        <div class="imgbox_up" style="margin-right: 20px;" @click="wapPngImg_visible=true">
          <img v-if="formInfo.wapPng!==''" :src="imghost+formInfo.wapPng" alt="" class="imgbox-img">
          <img v-else src="http://cdn.xiaojiankeji.com/images/other/default-img.png" alt="" class="imgbox-img">
        </div>
        <div class="upload_btn">
          <Upload 
              :max-size="2048"
              :show-upload-list="false"
              :on-success="wapPngSuccess"
              :on-error="wapPngError"
              :on-format-error="wapPngFormatError"
              :format="['jpg','jpeg','png']"
              v-model="formInfo.wapPng"
              :action="$api.uploadImage">
            <Button type="info" >图片选择</Button>
          </Upload>
          <div>宽：750 高：不限</div>
        </div>
      </FormItem>

      <FormItem>
        <Button style="margin-right: 10px;" @click="Modal_cencel">返回</Button>
        <Button :loading="save_loading"  type="primary" @click="Modal_ok">保存</Button>

      </FormItem>
    </Form>
  </Card>

    <Modal title="预览" v-model="upimg_visible">
      <img :src="upimg" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="upimg_visible=false">关闭</Button>
      </div>
    </Modal>

    <Modal title="预览" v-model="upimg_visible1">
      <img :src="upimg1" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="upimg_visible1=false">关闭</Button>
      </div>
    </Modal>


    <Modal title="预览" v-model="detailsImg_visible">
      <img :src="detailsImg" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="detailsImg_visible=false">关闭</Button>
      </div>
    </Modal>

    <Modal title="预览" v-model="wapPngImg_visible">
      <img v-if="formInfo.wapPng!==''" :src="imghost+formInfo.wapPng" alt="" style="width: 100%">
      <img v-else src="http://cdn.xiaojiankeji.com/images/other/default-img.png" alt="" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="detailsImg_visible=false">关闭</Button>
      </div>
    </Modal>
</div>

</template>
<script>

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        typeList: {
            type: Array,
            default: ()=>{
              return []
            }
        },
        actionIndex:{
          type:Number
        },
        data: {
          type: Object,
          default: ()=>{
            return {
              
            }
          }
        }
    },
    components: {
     
    },
    data() {


        const changePriceCheck = (rule, value, callback)=>{
            if (!(/^(-?\d+)(\.\d{1})?$/.test(value))) {
                callback(new Error('请输入一位小数'));
            } else if(value<=0){
                callback(new Error('请输入零售价'));
            }else {
                callback();
            }
        }

        return {
            save_loading:false,
            isEdit:false,
            upimg_visible:false,
            upimg_visible1:false,
            detailsImg_visible: false,
            wapPngImg_visible: false,

            upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
            upimg1:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
            detailsImg: 'http://cdn.xiaojiankeji.com/images/other/default-img.png',
            formInfo:{
                sort:0,
                productName:'',
                productEnglishName: '',
                rules: '',
                productType: '',
                direction: '',
                mainPicUrl:'',
                mainPicUrl1:'',
                detailsImg: '',
                wapPng: ''
            },
            ruleInfo:{

                productName: [{
                    required: true,
                    message: '产品名称不能为空',
                    trigger: 'blur'
                }]
            },
            isShow: this.visible,
      
            allSpecData:[],

        }
    },
    created() {
        // that = this;
       
    },

    methods: {

      
        //表单提交
        Modal_ok() {

            this.$refs['formInfo'].validate((valid) => {
                console.log(this.formInfo)
                if (valid) {
                    this.saveData();
                } else {
                    this.$Message.error('提交失败');
                }
            })
        },

        saveData(){
         
            const params = {
              Id: this.data.id || 0,
              Name: this.formInfo.productName,
              SpecValue: this.formInfo.rules,
              ProductTypeId: this.formInfo.productType,
              MainUrl: this.formInfo.mainPicUrl,
              BackGroundUrl: this.formInfo.mainPicUrl1,
              PngDetailUrl: this.formInfo.detailsImg,
              DisPlayOrder: this.formInfo.sort,
              EnglishName: this.formInfo.productEnglishName,
              Describe: this.formInfo.direction,
              PngDetailUrlForPhone: this.formInfo.wapPng,
              IsChanese:this.actionIndex
            }

            this.$request(this.$api.pcUpdateProudct, params, data => {
                if (data.isSuccess){
                  this.$Message.success("编辑成功")
                  this.$emit('reload');
                  this.$emit('cancel');
                }else{
                  this.$Message.error(data.message)
                }
            })

        },

        //对话框取消
        Modal_cencel(){
            console.log(this.data,1234565)
            this.$refs.formInfo.resetFields();
            return this.$emit('cancel');
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

        //上传图片
        upimgSuccess1(res, file){
            //console.log(res,file,this.imghost);
            if(res.length>0){
                this.upimg1 = this.imghost + res[0]
                this.formInfo.mainPicUrl1 = res[0]
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
        detailsImgSuccess(res, file){
            //console.log(res,file,this.imghost);
            if(res.length>0){
                this.detailsImg = this.imghost + res[0]
                this.formInfo.detailsImg = res[0]
            }
        },
        detailsImgError (file) {
            this.$Notice.warning({
                title: '上传',
                desc: file.name + '文件上传失败'
            });
        },
        detailsImgFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
            });
        },
        wapPngSuccess(data){
          this.formInfo.wapPng = data[0] || ''
        },
        wapPngError(file){
          this.$Notice.warning({
                title: '上传',
                desc: file.name + '文件上传失败'
            });
        },
        wapPngFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
            });
        },




    
    
  },
  watch: {
    visible(value) {
      this.isShow = value
      /*if(that.memberId){
        that.specColumns[0].editable = false
      }*/
      
      if(value){
        console.log(this.data,99)
        this.formInfo = {
            sort: this.data.disPlayOrder || 0,
            productName:this.data.name || '',
            productEnglishName: this.data.englishName || '',
            rules: this.data.specValue || '',
            productType: this.data.typeId || '',
            direction: this.data.describe || '',
            mainPicUrl: this.data.mainUrl || '',
            mainPicUrl1: this.data.backGroundUrl || '',
            detailsImg: this.data.pngDetailUrl || '',
            wapPng: this.data.pngDetailUrlForPhone || ''
        };

        if(this.formInfo.mainPicUrl) {
            this.upimg = this.imghost + this.formInfo.mainPicUrl;
        }else {
            this.upimg = 'http://cdn.xiaojiankeji.com/images/other/default-img.png';
        }

        if(this.formInfo.mainPicUrl1) {
            this.upimg1 = this.imghost + this.formInfo.mainPicUrl1;
        }else {
            this.upimg1 = 'http://cdn.xiaojiankeji.com/images/other/default-img.png';
        }

        if(this.formInfo.detailsImg) {
            this.detailsImg = this.imghost + this.formInfo.detailsImg;
        }else {
            this.detailsImg = 'http://cdn.xiaojiankeji.com/images/other/default-img.png';
        }


        
        
      }
    }
  }
};
</script>
