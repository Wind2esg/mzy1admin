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
    overflow: auto;
}

</style>
<template>
<div class="product_warper">

  <Card>

      <Form ref="formInfo" class="Modal_from Modal_from_product">


      <FormItem>
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
            <Button type="info" >选择图片</Button>
          </Upload>
        </div>
      </FormItem>

  
      <FormItem >

        
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
            <Button type="info" >选择图片</Button>
          </Upload>
        </div>
      </FormItem>

    </Form>

    </Card>
    <Modal title="预览" v-model="upimg_visible">
      <img :src="mainImg" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="upimg_visible=false">关闭</Button>
      </div>
    </Modal>
    <Modal title="预览" v-model="detailsImg_visible">
      <img :src="detailsImg" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="detailsImg_visible=false">关闭</Button>
      </div>
    </Modal>
</div>

</template>
<script>
import canEditTable from '../../product-manage/components/canEditTable.vue';
import util         from '@/libs/util.js';


let  that
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        memberId:Number,
        mainImg: {
            type: String,
            default: ''
        },
        bigImg: {
            type: String,
            default: ''
        }
    },
    components: {
        canEditTable
    },
    data() {


        return {
           
            upimg_visible:false,
            detailsImg_visible: false,
            upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
            detailsImg: 'http://cdn.xiaojiankeji.com/images/other/default-img.png',
            formInfo:{
                mainPicUrl:'',
                detailsImg: [],
            },

            isShow:true,
        }
    },
    created() {
        that = this;
        this.m();
    },
    methods: {

      m(){
        
      },


        //上传图片
        upimgSuccess(res, file){
            //console.log(res,file,this.imghost);
            if(res.length>0){
                this.upimg = this.imghost + res[0];
                that.formInfo.mainPicUrl = res[0];
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

        //上传图片
        detailsImgSuccess(res, file){
            //console.log(res,file,this.imghost);
            if(res.length>0){
                this.detailsImg = this.imghost + res[0];
                that.formInfo.detailsImg[0] = res[0];
                this.$emit('child-say1',this.detailsImg);
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


    
 
  },

};
</script>
