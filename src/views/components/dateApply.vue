<style lang="less">

</style>
<template>
    <DatePicker :value="value" format="yyyy-MM-dd" type="daterange" :placeholder="placeholder" style="width: 200px;vertical-align: top;" @on-change="change"></DatePicker>
</template>
<script>
    export default {
        components: {
        },
        props:{
            placeholder: String,
        },
        data () {
            return {
               value: ['', '']
            };
        },
        computed: {
        },
        methods: {
            change(value){
                this.$emit('dateChange', value);
            }
        },
        mounted () {
        },
        created () {
            //console.log(this.$store.state.channelList)
        }
    };
</script>
