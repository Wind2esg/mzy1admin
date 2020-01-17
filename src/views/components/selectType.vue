<style lang="less">
</style>
<template>
  <Select v-model="model1" clearable  @on-change="change" :placeholder="placeholder">
    <Option v-for="(item,index) in typeList" :value="item.value" :key="index">{{ item.label }}</Option>
  </Select>
</template>
<script>
export default {
  props:{
    typeList:Array,
    typeVal:String,
    placeholder: {
      type: String,
      default: '选择订单状态'
    },
  },
  components: {
        
    },
  data() {
    return {
      model1: this.typeVal,
    };
  },
  created() {
    //console.log(this.typeList,this.typeVal);
  },
  computed: {
    
  },
  methods: {
    change(value) {
      this.$emit('selectChange', value);
    }
  },
};
</script>
