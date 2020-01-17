<style lang="less">

</style>
<template>
    <Select v-model="value" placeholder="选择下单等级" style="width:150px;vertical-align:top" @on-change="change">
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
            };
        },
        computed: {
            list(){
                return this.$store.state.app.userLevel;
            }
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
