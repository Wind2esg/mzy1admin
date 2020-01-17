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
                    title: '配送区域',
                    key: 'area',
                    render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        color: 'green'
                                    }
                                }, '全国统一运费')
                            ]);
                        }
                },
                {
                    title: '运费（元）',
                    key: 'price'
                }
            ],
            data: [{
                price: 100
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
