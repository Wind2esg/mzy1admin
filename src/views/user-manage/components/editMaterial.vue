<style lang="less">
.Modal_from {
  .Selectbox {
    width: 200px;
  }
  &.agent_Modal_from {
    .fromInput {
      width: 250px;
    }
  }
}

.Modal_upimg_warp {
  overflow: hidden;
  text-align: center;
  .agent_upimg_item {
    width: 50%;
    margin: 0 auto 20px;
  }
  .up_imgbox {
    margin: 0 30px 30px;
    overflow: hidden;
  }
  .imgbox-img {
    width: 100%;
    display: block;
  }
  .ResetUpimg {
    margin: 20px auto 0;
  }
  .Modal_upimg_title {
    font-weight: bold;
    margin-bottom: 14px;
    font-size: 14px;
  }
}
</style>
<template>
  <Modal v-model="isShow" width=640 title='代理资料' :mask-closable="false" @on-cancel="cancel_fn">
    <div class="Modal_upimg_warp" v-if="formInfo.roleName !== '一级'">
      <div class="Modal_upimg_title">身份证截图</div>
      <!-- <Upload type="drag" :show-upload-list="false" :on-success="upimgSuccess" :on-error="upimgError" :on-format-error="upimgFormatError" :max-size="2048" :format="['jpg','jpeg','png']" v-if="!formInfo.cardPicUrl" :action="$api.uploadImage" class="agent_upimg_item">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>上传身份证截图</p>
        </div>
      </Upload> -->
      <div class="up_imgbox" v-if="formInfo.cardPicUrl">
        <img :src="imghost + formInfo.cardPicUrl" alt="" class="imgbox-img">
        <!-- <Button type="primary" class="ResetUpimg" @click="ResetUpimg_click">重置</Button> -->
      </div>
    </div>
    <!-- <div class="Modal_upimg_warp" v-if="formInfo.authPayPic">
      <div class="Modal_upimg_title">打款截图</div>
      <div class="up_imgbox">
        <img :src="imghost + formInfo.authPayPic" alt="" class="imgbox-img">
      </div>
    </div> -->
    <Form ref="formInfo" :model="formInfo" :rules="rule" :label-width="120" class="Modal_from agent_Modal_from">
      <FormItem label="姓名：" prop="name">
        <span>{{formInfo.name}}</span>
        <!-- <Input type="text" v-model="formInfo.name" placeholder="请输入姓名" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="手机号：" prop="phone">
        <span>{{formInfo.phone}}</span>
        <!-- <Input type="text" v-model="formInfo.phone" placeholder="请输入手机号" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="微信昵称：" >
        <span>{{formInfo.nickName}}</span>
        <!-- <Input type="text" v-model="formInfo.nickName" placeholder="请输入微信昵称" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="身份证：" v-if="formInfo.roleName !== '一级'">
        <span>{{formInfo.cardID}}</span>
        <!-- <Input type="text" v-model="formInfo.cardID" placeholder="请输入身份证" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="是否是团队长：" v-if="formInfo.roleName=='城市合伙人' || formInfo.roleName=='董事'">
        <span class="">{{isTeamLeader ? '是' : '否'}}</span>
      </FormItem>
      <FormItem label="推荐人：" v-if="formInfo.recommandName">
        <span class="">{{formInfo.recommandName}}</span>
      </FormItem>
      <FormItem label="推荐人手机：" v-if="formInfo.recommandPhone">
        <span class="">{{formInfo.recommandPhone}}</span>
      </FormItem>
      <FormItem label="授权等级：">
        <span class="">{{formInfo.roleName}}</span>
        <!-- <Input type="text" v-model="formInfo.roleName" placeholder="请输入身份证" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="余额云仓：">
        <span class="">{{formInfo.stock}}</span>
      </FormItem>
      <!-- <FormItem label="团队名称："  v-if="formInfo.regionName">
        <Input v-if="isNeedEditTeamName" type="text" v-model="formInfo.regionName" placeholder="请输入团队名称" class="fromInput"></Input>
        <span v-else class="">{{formInfo.regionName}}</span>
      </FormItem> -->
      <FormItem label="所在省：">
        <span class="">{{formInfo.province}}</span>
        <!-- <Input type="text" v-model="formInfo.province" placeholder="请输入所在省" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="所在市：">
        <span class="">{{formInfo.city}}</span>
        <!-- <Input type="text" v-model="formInfo.city" placeholder="请输入所在市" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="所在区：">
        <span class="">{{formInfo.area}}</span>
        <!-- <Input type="text" v-model="formInfo.area" placeholder="请输入所在区" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="详细地址：">
        <span class="">{{formInfo.address}}</span>
        <!-- <Input type="textarea" v-model="formInfo.address" :rows="4" placeholder="请输入详细地址" class="fromInput"></Input> -->
      </FormItem>
      <FormItem label="推荐人：" v-if="formInfo.recommandId>0">
        <span class="">{{formInfo.recommandName}}</span>
      </FormItem>
      <FormItem label="推荐人手机号：" v-if="formInfo.recommandId>0">
        <span class="">{{formInfo.recommandPhone}}</span>
      </FormItem>
      <FormItem label="介绍人：" v-if="formInfo.introduceId>0">
        <span class="">{{formInfo.introduceName}}</span>
      </FormItem>
      <FormItem label="介绍人手机号：" v-if="formInfo.introduceId>0">
        <span class="">{{formInfo.introducePhone}}</span>
      </FormItem>
      <!-- <FormItem label="是否为官方：">
        <span class="">{{formInfo.isOfficialShow}}</span>
      </FormItem>
      <FormItem label="区域保护：">
        <span class="">{{formInfo.protectArea}}</span>
      </FormItem> -->
      <!-- <FormItem label="我的openId：" >
        <Input type="text" v-model="formInfo.openId" placeholder="请输入OpenId" class="fromInput"></Input>
      </FormItem> -->
    </Form>
    <div slot="footer">
      <!-- <Button :loading="save_loading" type="primary" size="large" @click="ok_fn">确定</Button>
      <Button size="large" @click="cancel_fn">关闭</Button> -->
    </div>
  </Modal>
</template>
<script>
import utils from '@/libs/util';

let that;
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    MemberId: Number,
    isTeamLeader: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data() {

    const phoneCheck = (rule, value, callback) => {
      //let reg = 
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (!(/^1\d{10}$/.test(value))) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    }

    const cardIDCheck = (rule, value, callback) => {
      //let reg = 
      if (value === '') {
        callback(new Error('身份证号不能为空'));
      } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
        callback(new Error('身份证号填写有误'));
      } else {
        callback();
      }
    }
    return {
      isedit: false,
      isShow: this.visible,
      save_loading: false,
      roleList: [],
      isNeedEditTeamName: '',
      initInfo: {
        name: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        cardID: '',
        cardPicUrl: '',
        authPayPic: '',
        nickName: '',
        roleId: '',
        roleName: '',
        stock: '',
        recommandId: 0,
        recommandName: '',
        recommandPhone: '',
        introduceId: 0,
        introduceName: '',
        introducePhone: '',
        isOfficialShow: '',
        protectArea: '',
        openId: '',
        regionName: ''
      },
      formInfo: {},
      rule: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          validator: phoneCheck,
          trigger: 'blur'
        }],
        cardId: [{
          required: true,
          validator: cardIDCheck,
          trigger: 'change'
        }],
        province: [{
          required: true,
          message: '请输入所在省',
          trigger: 'change'
        }],
        city: [{
          required: true,
          message: '请输入所在市',
          trigger: 'change'
        }],
        area: [{
          required: true,
          message: '请输入所在区',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'change'
        }]
      },
    }
  },
  created() {
    //console.log(this.MemberId);
    that = this;

    return utils.getRoleList(that, data => {
      that.roleList = data
    })
  },
  methods: {
    handleSuccess() {

      },
      ok_fn() {
        let that = this

        this.$refs['formInfo'].validate((valid) => {
          if (valid) {
            console.log('提交成功');
            that.save_loading = true

            let requedata = {},
              formInfo = that.formInfo;
            for (let key in formInfo) {
              if (formInfo[key]) {
                let key1 = key.substring(0, 1).toUpperCase() + key.substring(1);
                requedata[key1] = formInfo[key]
              }
            }
            requedata.MemberId = that.MemberId
              //console.log(requedata);

            return that.$request(this.$api.EditMemberBaseInfo, requedata, data => {
                that.save_loading = false;
                if (data.isSuccess) {
                  that.$emit('edit-ok');
                } else if (data.message) that.$Message.error(data.message);
                else that.$Message.error('提交失败');
              })
              //this.$emit('okAdd', this.form.name)
          } else {
            that.$Message.error('提交失败');
          }
        })

      },
      cancel_fn() {
        this.$refs.formInfo.resetFields();
        this.$emit('edit-cancel')
      },

      //上传图片
      upimgSuccess(res, file) {
        //console.log(res,file,this.imghost);
        if (res.length > 0) {
          this.formInfo.cardPicUrl = res[0];
          console.log(this.formInfo.cardPicUrl);
        }
      },
      upimgError(file) {
        this.$Notice.warning({
          title: '上传',
          desc: file.name + '文件上传失败'
        });
      },
      upimgFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
        });
      },

      //重置图片
      ResetUpimg_click() {
        this.formInfo.cardPicUrl = ''
      },

      getRoleList() {
        this.roleList.map(item => {
          if (item.roleName == this.formInfo.roleName && item.id == 1) {
            this.isNeedEditTeamName = true;
          }
        })
      },
      init() {
        let that = this

        //console.log(utils);
        that.formInfo = utils._cloneObj(that.initInfo)
        return that.$request(this.$api.getMemberBaseInfo, {
          MemberId: that.MemberId
        }, data => {
          for (let key in that.formInfo) {
            if (typeof(data.result[key])!=='undefined') that.formInfo[key] = data.result[key]
            else if (key === 'cardPicUrl') {
              that.formInfo[key] = ''
            }
          }
          //console.log(that.formInfo)
          this.getRoleList();
        })
      }
  },
  watch: {
    visible(value) {
      this.isShow = value;
      if (value) {
        //this.$refs.formInfo.resetFields();
        return this.init()
      }
    }
  }
};
</script>
