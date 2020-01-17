<style lang="less">
.Modal_from {

  .Selectbox {
    width: 200px;
  }
  &.agent_Modal_from{
    .fromInput {
      width: 250px;
    }
  }
}
.Modal_upimg_warp{
  overflow: hidden;
  text-align: center;
  .agent_upimg_item{
    width: 50%;
    margin: 0 auto 20px;
  }
  .up_imgbox{
    margin: 0 30px 30px;
    overflow: hidden;
  }
  .imgbox-img{
    width: 100%;
    display: block;
  }
  .ResetUpimg{
    margin: 20px auto 0;
  }
}
.agent_modalwarp{
  .imgInfo_warp{
    padding-bottom: 30px;
    .imgInfo_list{
      width: 34%;
      cursor: pointer;
      text-align: center;
      overflow: hidden;
      margin: 0 20px;
      .title{
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
    .imgbox-img{
      width: 100%;
      display: block;
    } 
  }
  .Modal_Info{
    padding: 0 30px 30px;
    font-size: 15px;
    .Modal_Info_row{
      border-bottom:1px dashed #eee;
      padding: 12px 0;
      .Info_label{
        font-weight: bold;
        text-align: right
      }
      .Info_cont{
        padding-left: 24px;
      }
    }
  }
}

</style>
<template>
<div class="agent_warper">
  <Modal v-model="isShow" width=800 title='代理信息' @on-cancel="cancel_fn" class="agent_modalwarp">
    <Row type="flex" justify="center" align="middle" class="imgInfo_warp">
      <div class="imgInfo_list" v-if="fromInfo.cardPicUrl" @click="img_click(fromInfo.cardPicUrl)">
        <div class="title">身份证截图</div>
        <div class="imgbox">
          <img :src="imghost+fromInfo.cardPicUrl" alt="" class="imgbox-img">
        </div>
      </div>
      <div class="imgInfo_list" v-if="fromInfo.payPicUrl" @click="img_click(fromInfo.payPicUrl)">
        <div class="title">升级打款截图</div>
        <div class="imgbox">
          <img :src="imghost+fromInfo.payPicUrl" alt="" class="imgbox-img">
        </div>
      </div>
    </Row>
    
    <!-- 展示信息 -->
    <div class="Modal_Info" style="font-size:12px;">
      <Row class="Modal_Info_row" type="flex" justify="center" align="middle">
        <Col span="8">
          <Row class="" >
            <Col span="10" class="Info_label">姓名</Col>
            <Col span="14" class="Info_cont">{{fromInfo.name}}</Col>
          </Row>
        </Col>
        <Col span="8">
          <Row class="" >
            <Col span="10" class="Info_label">电话</Col>
            <Col span="14" class="Info_cont">{{fromInfo.phone}}</Col>
          </Row>
        </Col>
        <Col span="8">
          <Row class="" >
            <Col span="10" class="Info_label">微信昵称</Col>
            <Col span="14" class="Info_cont">{{fromInfo.nickName}}</Col>
          </Row>
        </Col>
      </Row>
      <Row class="Modal_Info_row" type="flex" justify="center" align="middle">
        <Col span="8">
          <Row class="" >
            <Col span="10" class="Info_label">授权等级</Col>
            <Col span="14" class="Info_cont">{{fromInfo.roleName}}</Col>
          </Row>
        </Col>
        <Col span="8">
          <Row class="" >
            <Col span="10" class="Info_label">申请地区</Col>
            <Col span="14" class="Info_cont">{{fromInfo.province}}-{{fromInfo.city}}-{{fromInfo.area}}</Col>
          </Row>
        </Col>
        <Col span="8">
          <Row class="" >
            <Col span="10" class="Info_label">详细地址</Col>
            <Col span="14" class="Info_cont">{{fromInfo.address}}</Col>
          </Row>
        </Col>
      </Row>
      <Row class="Modal_Info_row" type="flex" justify="center" align="middle">
        <Col span="8">
          <Row class="">
            <Col span="10" class="Info_label">身份证</Col>
            <Col span="14" class="Info_cont">{{fromInfo.cardId}}</Col>
          </Row>
        </Col>
        <Col span="8">
          <Row class="">
            <Col span="10" class="Info_label">授权打款方式</Col>
            <Col span="14" class="Info_cont">{{fromInfo.authPayType}}</Col>
          </Row>
        </Col>
        <Col span="8">
          <Row class="" >
            <Col span="10" class="Info_label">授权门槛金额</Col>
            <Col span="14" class="Info_cont">{{fromInfo.authRechargeBalance}}</Col>
          </Row>
        </Col>
      </Row>
      
    </div>
    <div slot="footer">
        <Button type="primary" size="large" @click="agent_through" >审核通过</Button>
        <Button type="primary" size="large" @click="agent_veto" >审核否决</Button>
        <Button size="large" @click="cancel_fn">关闭</Button>
    </div>
    
  </Modal>
  <Modal
      v-model="BigPic_model"
      width=720
      title="查看大图">
      <img :src="BigPic_url" alt="" style="width:100%">
      <div slot="footer">
        <Button size="large" @click="BigPic_cancel">关闭</Button>
      </div>
  </Modal>

  <Modal
      v-model="veto_model"
      width=460
      @on-cancel="veto_cancel"
      title="否决原因">
      <Form ref="formVeto" :model="formVeto" :rules="ruleVeto">
        <FormItem prop="RefuseReason">
          <Input type="textarea" v-model="formVeto.RefuseReason" :rows="3" placeholder="请输入否决原因" class="fromInput"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="veto_cancel">关闭</Button>
        <Button type="primary" size="large" @click="veto_ok" >确认</Button>
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
    MemberId:Number
  },
  components: {

  },
  data() {
    return {
      formVeto:{RefuseReason:''},
      ruleVeto:{
        RefuseReason: [{
          required: true,
          message: '原因不能为空',
          trigger: 'blur'
        }]
      },
      BigPic_model:false,
      BigPic_url:'',
      veto_model:false,
      isedit: false,
      isShow: this.visible,
      fromInfo: {},
    }
  },
  created() {
    //console.log(this.MemberId);
  },
  methods: {
    veto_cancel(){
      this.$refs.formVeto.resetFields();
      this.veto_model = false
    },
    handleSuccess() {

      },
      cancel_fn() {
        this.$emit('edit-cancel')
      },
      //否决
      agent_veto(){
        this.veto_model = true
      },
      //通过
      agent_through(){  
        this.$emit('edit-through',this.MemberId)
      },
      //否决确定
      veto_ok(){
        this.$refs['formVeto'].validate((valid) =>{
          if(valid) {
            this.veto_model = false
            this.$emit('edit-veto',this.MemberId,this.formVeto.RefuseReason)
          }
        })
      },

      //上传图片
      upimgSuccess(res, file){
        //console.log(res,file,this.imghost);
        if(res.length>0){
          this.formInfo.cardPicUrl = this.imghost + res[0]
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

      //重置图片
      ResetUpimg_click(){
        this.formInfo.cardPicUrl = ''
      },

      img_click(url){
        this.BigPic_model = true
        this.BigPic_url = this.imghost+url
      },
      BigPic_cancel(){
        this.BigPic_model = false
      }
  },
  watch: {
    visible(value) {
      this.isShow = value;
      if(value){
        let that = this
        return that.$request(this.$api.getCheckMemberUpInfoDetails, {MemberId:that.MemberId}, data => {
          that.fromInfo = data.result;
          if(data.message) that.$Message.info(data.message);
        })
      }
    }
  }
};
</script>
