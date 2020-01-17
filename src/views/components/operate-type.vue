<style lang="less">

</style>
<template>
    <Select v-model="value" placeholder="选择操作类型" style="width:150px" @on-change="change">
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
               list: this.$store.state.app.operateType
            };
        },
        computed: {
            // list(){
            //     return this.$store.state.app.operateType;
            // }
        },
        methods: {
            change(value){
                this.$emit('on-change', value);
            }
        },
        mounted () {
        },
        created () {
        }
    };
</script>
