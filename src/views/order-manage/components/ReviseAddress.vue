<style lang="less">

.modal_warp{
  .fromInput {
    width: 300px;
  }
  .Selectbox {
    width: 300px;
    /* vertical-align: middle; */
  }
}
</style>
<template>
  <div class="model_page">
    <Modal v-model="isModalShow" width=580 title='修改收货信息' @on-cancel="Modal_cencel" class="modal_warp">
      <div class="staff_from">
        <Form ref="formInfo" :model="formInfo" :rules="rule" :label-width="100">
          <FormItem label="收货人" prop="Name">
            <Input v-model="formInfo.Name" placeholder="收货人" class="fromInput"></Input>
          </FormItem>
          <FormItem label="收货人手机" prop="Phone">
            <Input v-model="formInfo.Phone" placeholder="手机号" class="fromInput"></Input>
          </FormItem>
          <FormItem label="收货地址" prop="AreaVal">
            <Cascader :data="AreaData" v-model="formInfo.AreaVal" class="fromInput"></Cascader>
          </FormItem>
          <FormItem  prop="address">
            <Input v-model="formInfo.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="详细地址" class="fromInput"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="Modal_cencel">取消</Button>
        <Button type="primary" :loading="save_loading" size="large" @click="Modal_ok" >确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import AreaData               from '@/libs/AreaData1.json';

let that
export default {
  props: {
    orderNo: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
  },
  created(){
    that = this;
  },
  data() {

    const phoneCheck = (rule, value, callback)=>{
      //let reg = 
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (!(/^1\d{10}$/.test(value))) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    }

    return {
      save_loading:false,
      AreaData:AreaData,
      isModalShow:false,
      isEdit:false,
      OrderNo:'',
      formInfo: {
        AreaVal:[],
        Name: '',
        Phone: "",
        address:'',
      },
      rule: {
        Name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        Phone: [{
          required: true,
          validator:  phoneCheck,
          trigger: 'blur'
        }],
        AreaVal:[{
          type: 'array',
          required: true,
          message: '请选择收货地址',
          trigger: 'change'
        }],
        address:[{
          required: true,
          message: '请填写详细地址',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    //表单提交
    Modal_ok() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          that.save_loading = true
          let formInfo = that.formInfo,AreaVal = that.formInfo.AreaVal
          let requedata = {
            OrderNo:that.orderNo,
            ReceiveName:formInfo.Name,
            ReceivePhone:formInfo.Phone,
            ReceiveProvince:AreaVal[0],
            ReceiveCity:AreaVal[1],
            ReceiveArea:AreaVal[2],
            ReceiveAddress:formInfo.address
          };
          //requedata = {}
          return that.$request(this.$api.EditOrderReceiveInfo, requedata, data => {
            that.save_loading = true
            if(data.isSuccess){
              that.$Message.success('编辑成功!');
              that.$emit('modal-ok')
            }else if(data.message) that.$Message.error(data.message);
              else that.$Message.error('提交失败');
          })
        } else {
          this.$Message.error('提交失败');
        }
      })
    },

    //对话框取消
    Modal_cencel(){
      this.$refs.formInfo.resetFields();
      return this.$emit('modal-cancel')
    }
  },
  watch: {
    visible(value){
      this.isModalShow = value
      if(value){
        that.save_loading = false
        let requedata = {
          OrderNo:that.orderNo
        };
        return that.$request(this.$api.GetOrderReceiveInfo, requedata, data => {
          //console.log(data);
          that.formInfo.Name    = data.result.receiveName || ''
          that.formInfo.Phone   = data.result.receivePhone || ''
          that.formInfo.address = data.result.receiveAddress || ''
          if(data.result.receiveProvince && data.result.receiveCity && data.result.receiveArea) that.formInfo.AreaVal = [data.result.receiveProvince,data.result.receiveCity,data.result.receiveArea]
          else that.formInfo.AreaVal = []
        })
      }
    }
  }
};
</script>
