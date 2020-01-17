<style lang="less">

</style>
<template>
    <Select v-model="value" placeholder="选择渠道来源" style="width:150px" @on-change="change">
        <Option value="" :key="-1">请选择</Option>
        <Option v-for="item in list" :value="item.id" :key="item.id">{{ item.value }}</Option>
    </Select>
</template>
<script>
    export default {
        components: {
        },
        data () {
            return {
               value: '',
               list: [{
                 id: 1,
                 value: '商户申请'
               },{
                 id: 2,
                 value: '公众号申请'
               },{
                 id: 3,
                 value: '网站申请'
               }]
            };
        },
        computed: {
        },
        methods: {
            change(value){
                this.$emit('on-change', value);
            }
        },
        mounted () {
        },
        created () {
            console.log(this.$store.state.channelList)
        }
    };
</script>
