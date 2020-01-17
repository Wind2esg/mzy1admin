<template>
    <Card>
        <p slot="title">5.测试（未使用）</p>
        <Table :columns="columns" :data="data" border></Table>
    </Card>
</template>

<script>
export default {
    data () {
        return {
            columns: [
                {
                    title: '配送方式',
                    width: '15%',
                    key: 'type'
                },
                {
                    title: '配送区域',
                    key: 'area',
                    render: (h, params) => {

                        const arr = params.row.area.map(item=>{
                            return h('Tag', {
                                    props: {
                                        color: 'green'
                                    }
                                }, item.value)
                        })

                        return h('div', arr);
                    }
                },
                {
                    title: '运费（元）',
                    key: 'price1',
                    width: '15%'
                },
                {
                    title: '指定条件包邮（选填）',
                    width: '30%',
                    key: 'weight',
                    render: (h, params)=>{
                        if (params.row.weight){
                            return h('div', '重量'+params.row.weight+'克（含）以内包邮');
                        }else{
                            return h('div', '无')
                        }
                    }
                }
            ],
            data: [{
                type: '快递',
                area: [{
                    id: 1,
                    value: '江苏省'
                },{
                    id: 2,
                    value: '浙江省'
                },{
                    id: 2,
                    value: '浙江省'
                },{
                    id: 2,
                    value: '浙江省'
                },{
                    id: 2,
                    value: '浙江省'
                }],
                price1: 1,
                weight: 2,
            },{
                type: '快递1',
                area: [{
                    id: 1,
                    value: '全国默认运费'
                }],
                price1: 1,
                price2: 2,
                price3: 3,
                price4: 4,
                weight: 0,
            }]
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
