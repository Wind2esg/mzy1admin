<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}
.protectArea_wrap{
  
  .fromInput{
    width:250px;
  }
}

</style>
<template>

  <Modal v-model="isShow" width=460 :title='title' @on-cancel="Modal_cencel" class="agent_modalwarp">
    <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="120" class="protectArea_wrap">
      <FormItem label="设置区域保护地区" prop="areaVal">
        <Cascader :data="AreaData" v-model="formInfo.areaVal" class="fromInput"></Cascader>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button size="large" @click="Modal_cencel">取消</Button>
      <Button type="primary" :loading="save_loading" size="large" @click="Modal_ok" >确认</Button>
    </div>
  </Modal>

</template>
<script>
import AreaData               from './../data/AreaData1.json';


//console.log(AreaData);

let  that
export default {
  props: {
    visible: {
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
      AreaData:AreaData,
      disabledGroup:'是',
      apidata:[],
      isShow: this.visible,
      formInfo:{
        areaVal:[],
        phone:'',
        name:''
      },
      ruleInfo:{
        areaVal:[{
          type: 'array',
          required: true,
          message: '请选择收货地址',
          trigger: 'change'
        }],
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
    //表单提交
    Modal_ok() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          that.save_loading = true
          let areaVal = that.formInfo.areaVal
          let requedata = {
            MemberId:that.memberId,
            Province:areaVal[0],
            City:areaVal[1]
          };
          //requedata = {}
          return that.$request('setMemberProtectArea', requedata, data => {
            that.save_loading = false
            if(data.isSuccess){
              let msg = data.message || '修改成功'
              that.$Message.success(msg);
              that.$emit('modal-ok')
            }else if(data.message) that.$Message.error(data.message);
              else that.$Message.error('提交失败');
          })
        } else {
          this.$Message.error('提交失败');
        }
      })
    },

    //复制
    linkbtn_click(){
      copyToClipboard(that.linkVal)
    },

    //对话框取消
    Modal_cencel(){
      this.$refs.formInfo.resetFields();
      return this.$emit('modal-cancel')
    },

  },
  watch: {
    visible(value) {
      this.isShow = value;
      if(value){
        that.formInfo = {
          areaVal:[],
          phone:'',
          name:''
        }
      }
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
