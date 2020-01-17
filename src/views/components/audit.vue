<style lang="less">

</style>
<template>
    <Select v-model="value" placeholder="选择授权等级" style="width:150px" @on-change="change">
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
                 value: '渠道1'
               },{
                 id: 2,
                 value: '渠道1'
               },{
                 id: 3,
                 value: '渠道1'
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
