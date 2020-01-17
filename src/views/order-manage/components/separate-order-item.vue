<style>
</style>

<template>
    <Card style="margin-bottom:10px;">
        <div slot="title" style="font-weight:bold;color: royalblue;position:relative">
            订单{{index+1}}
            <!-- <div style="position:absolute;right:0;bottom:-5px">
                <Button v-if="data.productCount>1" type="error" size="small" @click="deleteItem">删除订单</Button>
            </div> -->
        </div>
        

        <!--<Form ref="form" :model="form" :rules="rule" inline>
             <div v-if="data.productCount>1"> -->
                <!-- <div v-for="item in data">
                    <FormItem prop="name" label="产品名称">
                        <div>{{item.productName}}</div>
                    </FormItem>
                    <FormItem prop="name" label="产品总数">
                        <div>{{item.productCount}}</div>
                    </FormItem>
                    <FormItem prop="number" label="拆单产品数量">
                        <InputNumber :min="1" v-model="item.number" @on-change="changeNumber"></InputNumber>
                    </FormItem>
                    <FormItem prop="rule" label="产品规格">
                        <span>{{item.productSpecValue}}</span>
                    </FormItem>
                </div> -->
           <!--  </div>
            <div v-else style="font-size:12px;color:#666;">数量不足，不可拆单</div> -->
            <Table :columns="columns" :data="dataList.data" size="small"></Table>
       <!--  </Form> -->


    </Card>
</template>

<script>

export default {
    components: {
    },
    props: {
        index: Number,
        orderData: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data () {
        return {
            dataList: this.orderData,
            columns: [{
                    title: '产品名称',
                    key: 'productName',
                    align: 'center'
                },{
                    title: '产品数量',
                    key: 'productCount',
                    align: 'center'
                },{
                    title: '拆单产品数量',
                    key: '',
                    align: 'center',
                    render: (h, params)=>{
                        return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.number
                                    },
                                    style: {
                                        width: '85px'
                                    },
                                    on: {
                                        'on-change': (value)=>{
                                            this.changeNumber(params.row, value);
                                        }
                                    }
                                })
                            ])
                    }
                },{
                    title: '规格',
                    key: 'productSpecValue',
                    align: 'center'
                }
            ]
        }
    },
    created(){

        // if (this.data.productCount > 1){
        //     this.$emit('change', {data: this.data, list: this.list});
        // }
        
    },
    methods: {
        changeNumber(record, value){
            this.dataList.data.map(item=>{
                if (item.uid == record.uid){
                    item.number = value;
                }
                return item;
            })

            this.$emit('change', this.dataList);
        },
        deleteItem(){
            this.$emit('delete', this.dataList);
        },
        guid(){
            return new Date().getTime();
        }
    },
    watch:{
        // orderData (value){
        //     this.orderData = value;
        // },
        orderData(value){
            this.dataList = value;
        },
        // index(value){
        //     this.index = index;
        // }
    }
};
</script>
