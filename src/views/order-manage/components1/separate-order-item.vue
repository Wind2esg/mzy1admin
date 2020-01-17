<style>
</style>

<template>
    <Card style="margin-bottom:10px;">
        <div slot="title" style="font-weight:bold;color: royalblue;position:relative">
            {{data.name}} 
            <span style="padding-left:20px;font-weight:300;font-size:12px">产品数量:{{data.count}}</span>

            <div style="position:absolute;right:0;bottom:-5px">
                <Button type="dashed" icon="plus-round" size="small" @click="addProduct">增加</Button>
            </div>
        </div>
        

        <Form ref="form" :model="form" :rules="rule" inline>
            <div v-for="item in list">
                <FormItem prop="number" label="拆单产品数量">
                    <InputNumber :min="1" v-model="item.number"></InputNumber>
                </FormItem>
                <FormItem prop="rule" label="产品规格">
                    <Select v-model="item.rule" style="width:200px">
                        <Option v-for="item in ruleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <div style="display:inline-block;margin-top: 33px;color:#f84444;cursor:pointer" @click="deleteItem(item)">删除</div>
                </FormItem>
            </div>
        </Form>

    </Card>
</template>

<script>

export default {
    components: {
    },
    props: {
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data () {
        return {
            list: [
                {
                    id:1,
                    number: 1,
                    rule: 1
                },
                {
                    id:2,
                    number: 1,
                    rule: 1
                },
            ],
            ruleList: [{
                label: "产品1",
                value: 1
            },{
                label: "产品2",
                value: 2
            }],
            form:{
                
            },
            rule:{
                
            }
        }
    },
    methods: {
        addProduct(){

            let count = 0;
            this.list.map(item=>{
                count += item.number;
            })

            if (count >= this.data.count){
                return this.$Message.error("该产品最多拆成"+this.data.count+"个单");
            }

            this.list.push({
                id: this.guid(),
                number: 1,
                rule: 1
            })
        },
        deleteItem(record){
            this.list = this.list.filter(item=>{
                return item.id != record.id
            })
        },
        guid(){
            return new Date().getTime();
        }
    },
    watch:{
        visible (value){
            this.isShow = value;
        }
    }
};
</script>
