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

  <Modal v-model="isShow" width=460 :title='title' @on-cancel="Modal_cencel" class="agent_modalwarp">
    <Form ref="formInfo" :model="formInfo" :label-width="140" class="Modal_from">
      <FormItem label="是否为团队长">
        <RadioGroup v-model="disabledGroup">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button size="large" @click="Modal_cencel">取消</Button>
      <Button type="primary" :loading="save_loading" size="large" @click="Modal_ok" >确认</Button>
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
    },
    isTeamLeader: {
      type: Boolean,
      default: false
    },
    title:String,
    memberId:Number,
  },
  components: {

  },
  data() {
    return {
      save_loading:false,
      disabledGroup: this.isTeamLeader ? '是':'否',
      teamLeader: false,
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
      that.save_loading = true
      let requedata = {
        MemberId:that.memberId,
        IsTeamLeader:that.disabledGroup==='是'
      };

      return that.$request(this.$api.setTeamLeader, requedata, data => {
        that.save_loading = false
        if(data.message) that.$Message.info(data.message);
        return this.$emit('modal-cancel')
      },()=>{
        that.save_loading = false
      })
    },

    //复制
    linkbtn_click(){
      copyToClipboard(that.linkVal)
    },

    //对话框取消
    Modal_cencel(){
      return this.$emit('modal-cancel')
    },

  },
  watch: {
    visible(value) {
      this.isShow = value;
    },
    isTeamLeader(value){
      this.disabledGroup = value ? '是' : '否';
      console.log(this.disabledGroup, value);
    }
  }
};
function copyToClipboard (text) {
    if(text.indexOf('-') !== -1) {
        let arr = text.split('-');
        text = arr[0] + arr[1];
    }
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
       alert(msg);
      } catch (err) {
        alert('该浏览器不支持点击复制到剪贴板');
      }

      document.body.removeChild(textArea);
}
</script>
