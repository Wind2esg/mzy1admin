<template>
    <Card>
        <p slot="title">{{data.expressCompanyNo + '. ' + data.expressCompanyName}}</p>
        <Table :columns="columns" :data="data.expressDetailInfo" border></Table>
    </Card>
</template>

<script>
export default {
    props:{
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data () {
        return {
            columns: [
                {
                    title: '配送区域',
                    key: 'area',
                    render: (h, params) => {

                        const arr = params.row.areas.map(item=>{
                            return h('Tag', {
                                    props: {
                                        color: 'green'
                                    }
                                }, item)
                        })

                        return h('div', arr);
                    }
                },
                {
                    title: '首重（克）',
                    key: 'firstHeavy'
                },
                {
                    title: '首费（元）',
                    key: 'firstPrice'
                },
                {
                    title: '续重（克）',
                    key: 'followHeavy'
                },
                {
                    title: '续重（元）',
                    key: 'followPrice'
                },
                {
                    title: '指定条件包邮（选填）',
                    key: 'freeHevy',
                    render: (h, params)=>{
                        if (params.row.weight){
                            return h('div', '重量'+params.row.weight+'克（含）以内包邮');
                        }else{
                            return h('div', '无')
                        }
                    }
                }
            ]
        }
    },
    methods: {
        
    },
    mounted () {
        
    }
}
</script>

<style lang="less">
    
</style>
