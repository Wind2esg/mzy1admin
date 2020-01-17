<style lang="less">
.spearate-order .ivu-modal-body{
    background: #f5f5f5;
}
</style>

<template>
   <Modal
        class-name="spearate-order"
        v-model="isShow"
        title="拆单"
        @on-cancel="cancel">
        
        <Button type="info" icon="plus-round" @click="addOrder" style="margin-bottom:10px;">新增订单</Button>

        <order-item :key="item.id" v-for="(item, index) in orderList" @change="itemChange" @delete="deleteItem" :orderData="item" :index="index" style="margin-bottom:10px;"></order-item>

        <div slot="footer">
            <Button type="primary" :loading="modal_loading" @click="ok">确定</Button>
        </div>
        
    </Modal>
</template>

<script>

import orderItem from './separate-order-item';

export default {
    components: {
        orderItem
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        orderNo: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            isShow: this.visible,
            list: [],
            modal_loading: false,
            orderList: []
        }
    },
    created(){
        
    },
    methods: {
        getData(){
            const params = {
                OrderNo: this.orderNo
            }

            this.orderList = [];

            this.$request(this.$api.SplitProductInfo, params, data=>{
                this.list = (data.result || []);

                this.orderList.push({
                    uid: this.guid(),
                    data: this.list.map(item=>{
                        let obj = Object.assign({}, item);
                        obj.number = 1;
                        obj.uid = this.guid();
                        return obj;
                    })
                });
                this.orderList.push({
                    uid: this.guid(),
                    data: this.list.map(item=>{
                        let obj = Object.assign({}, item);
                        obj.number = 1;
                        obj.uid = this.guid();
                        return obj;
                    })
                });

            })

        },
        addOrder(){
            this.orderList.push({
                uid: this.guid(),
                data: this.list.map(item=>{
                    let obj = Object.assign({}, item);
                    obj.number = 1;
                    obj.uid = this.guid();
                    return obj;
                })
            })

            console.log(this.orderList)
        },
        deleteItem(record){
            this.orderList.filter(item=>{
                return item.uid !== record.uid;
            })
        },
        itemChange(record){

            this.orderList = this.orderList.map(item=>{
                if (item.uid == record.uid){
                    item = record;
                }
                return item;
            })

            //console.log(this.orderList, record)

        },
        ok(){
            // console.log(this.orderList);
            // let errorData = {};

            // for (var i=0; i<this.list.length; i++){
            //     if (this.list[i].list){
            //         let count = 0;
            //         this.list[i].list.map(record=>{
            //             count += record.number;
            //         })

            //         if (count !== this.list[i].productCount){
            //             errorData = this.list[i];
            //             break;
            //         }
            //     }
            // }

            // this.orderList.map(item=>{
            //     let item.
            // })

            // if (errorData.productName){
            //     this.$Message.error('产品：'+errorData.productName+',拆单个数与产品总数不一致！');
            //     return;
            // }

            this.saveData();


            //this.$emit('cancel');
            
        },



        saveData(){
            const params = {
                OrderNo: this.orderNo,
                SplitResult: this.orderList.map(item=>{
                    return item.data.map(record=>{
                        return {
                            ProductId: record.productId,
                            SpecId: record.specId,
                            ProductCount: record.number
                        }
                    })
                })
            }

            console.log(JSON.stringify(params))
          

            this.$request(this.$api.PendingOrderSplit, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功!');
                    this.$emit('cancel');
                }else{
                    this.$Message.error(data.message);
                }
            }, null, ()=>{}, true)

        },
        cancel(){
            this.$emit('cancel')
        },
        guid(){
            var a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};
            return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()
        }
    },
    watch:{
        visible (value){
            this.isShow = value;
            this.getData();
        }
    }
};
</script>
