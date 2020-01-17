<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}


</style>
<template>
<Modal v-model="isShow" width=560 title='权限管理' @on-cancel="Modal_cencel" class="staff_modalwarp">
    <div class="treebox">
      <Tree :data="apidata" show-checkbox style="margin-left: 26px;"></Tree>
    </div>
    <div slot="footer">
      <Button size="large" @click="Modal_cencel">取消</Button>
      <Button :loading="save_loading" type="primary" size="large" @click="Modal_ok" >确定</Button>
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
    memberId:Number
  },
  components: {

  },
  data() {
    return {
      save_loading:false,
      apidata:[],
      isShow: this.visible,
    }
  },
  created() {
    that = this
    //console.log(this.MemberId);
  },
  methods: {
    GetList(callback){
      let AuthList = []
      let requedata = {
        Id:that.memberId
      };
      //console.log(that.apidata);
      that.apidata.map((el, ix) => {
        if(el.checked || el.indeterminate) AuthList.push(el.id)
        el.children.map((el2, ix2) => {
          if(el2.checked) {
            //console.log(el2.id,el2.title);
            AuthList.push(el2.id)
          }
        })
      })
      
      requedata.AuthList = AuthList
      //console.log(JSON.stringify(requedata));
      //console.log(requedata);
      return that.$request(this.$api.updateAuthList, requedata, data => {
        return callback && callback(data)
      }, null, null, true)
    },
    //表单提交
    Modal_ok() {
      //console.log('Modal_ok');
      //console.log(that.apidata);
      that.save_loading = true
      return that.GetList(data => {
        //console.log(data);
        that.save_loading = false
        if(data.isSuccess){
          that.$emit('modal-ok')
        }else if(data.message) that.$Message.error(data.message);
          else that.$Message.error('提交失败');
      })
    },

    //对话框取消
    Modal_cencel(){
      return this.$emit('modal-cancel')
    }
  },
  watch: {
    visible(value) {
      this.isShow = value;
      if(value){

        let requedata = {Id:that.memberId};
        return that.$request(this.$api.getPositionMenuList, requedata, data => {
         
           if(data.isSuccess){
            that.apidata = data.menuList || []
            }else if(data.message) that.$Message.error(data.message);
        })
      }
    }
  }
};
</script>
