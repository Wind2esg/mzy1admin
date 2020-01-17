<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}
.highLink_wrap{
  
  .row_box{
    margin-top: 12px;
  }
  .link_btn{
    cursor: pointer;
  }
}

</style>
<template>

  <Modal v-model="isShow" width=420 title='最高级授权链接' @on-cancel="Modal_cencel" class="agent_modalwarp">
    <div class="highLink_wrap">
      <div class="tips">请发送至微信号，仅限商户公众号下未进行代理或管理员授权的用户</div>
      <Row type="flex" justify="center" align="middle" class="row_box">
        <Input v-model="linkVal" disabled>
          <span slot="append" class="link_btn" @click="linkbtn_click">复制</span>
        </Input>
      </Row>
    </div>
    <div slot="footer">
      <Button size="large" @click="Modal_cencel">关闭</Button>
    </div>
  </Modal>

</template>
<script>

let  that
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data() {
    return {
      linkVal:'http://xmzwap.ynbyws2017.com/page/index.html#/auth?fromid=-1',
      result:{},
      editIdList:[],
      info_model:false,
      loading:true,
      total:0,
      pageSize: 10,
      pageIndex: 1,
      keywords:'',
      ApplyStateList:[],
      ApplyState:'',
      RoleList:[],
      RoleId:'',
      apidata:[],
      isShow: this.visible,
      formInfo:{
        phone:'',
        name:''
      }
    }
  },
  created() {
    that = this
    //console.log(this.MemberId);
  },
  methods: {

    GetList(callback){
      let requedata = {};

      return that.$request('memebrRecommandList', requedata, data => {
        that.total = data.length || 0
        that.apidata = data.list || []
        that.loading = false
        return callback && callback(data)
      })
    },

    //恢复数据
    recoveryData(callback){
      that.total = 0
      that.loading = true
      //that.apidata = []
      that.pageIndex = 1
      return callback && callback()
    },
    //表单提交
    Modal_ok() {
      //console.log('Modal_ok');
      //console.log(that.apidata);
    },

    //复制
    linkbtn_click(){
      console.log(that.linkVal);
      copyToClipboard(that.linkVal,(msg)=>{
        return that.$Notice.info({
          title: '提示',
          desc: msg
        });
      })
    },

    //对话框取消
    Modal_cencel(){
      return this.$emit('modal-cancel')
    },

  },
  watch: {
    visible(value) {
      this.isShow = value;
    }
  }
};
function copyToClipboard (text,callback) {
    /*if(text.indexOf('-') !== -1) {
        let arr = text.split('-');
        text = arr[0] + arr[1];
    }*/
    var textArea = document.createElement("textarea");
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
        return callback && callback(msg)
      } catch (err) {
        return callback && callback('该浏览器不支持点击复制到剪贴板')
      }

      document.body.removeChild(textArea);
}
</script>
