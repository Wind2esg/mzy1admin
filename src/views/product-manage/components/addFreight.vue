<style lang="less">
    .add-freight{
        
    }
    .add-freight .ivu-card-bordered{
        border-color: #84d87f;
    }
</style>

<template>
    <Card class="add-freight">
        <p slot="title">运费编辑 <span style="padding-left: 30px;font-size:12px;font-weight:400">除指定配送区域，其它区域采用<span style="color:#f84444">全国默认配送</span></span></p>
        <Form ref="form" :model="form" :rules="rule" :label-width="100">
  
            <!-- <FormItem label="运费模板名称" prop="modelName">
                <Input v-model="form.modelName" placeholder="" style="width:300px;"></Input>
            </FormItem>
            <FormItem label="运费政策" prop="text">
                <RadioGroup v-model="form.freightType">
                    <Radio label="1">
                        <span>无条件包邮</span>
                    </Radio>
                    <Radio label="2">
                        <span>自定义运费</span>
                    </Radio>
                </RadioGroup>
            </FormItem> -->
            
            <!-- <div v-if="form.freightType == 2">
                <FormItem label="计价方式" prop="text">
                    <RadioGroup v-model="form.valuationType">
                        <Radio label="1">
                            <span>按商品重量</span>
                        </Radio>
                        <Radio label="2">
                            <span>仅根据区域</span>
                        </Radio>
                    </RadioGroup>
                </FormItem> -->
                <Card style="margin:20px 38px" :key="item.expressCompanyNo" v-for="item in companyList">
                    <div slot="title">{{item.expressCompanyNo+'. '+item.expressCompanyName}}</div>
                    <freight-weightpostage @reloadData="reloadData" :list="item"></freight-weightpostage>
                </Card>
            <!-- </div> -->

            <div style="text-align:right;padding: 30px 40px 0 0;">
                <Button type="ghost" style="margin-right:10px" @click="cancel">取消</Button>
                <Button type="primary" @click="save">保存</Button>
            </div>

        </Form>
    </Card>
</template>

<script>

import freightWeightpostage from './freight-weight-postage-edit';
import freightAreapostage from './freight-area-postage-edit';

export default {
    components: {
        freightWeightpostage,
        freightAreapostage
    },
    props:{
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        companyList: {
            type: Array,
            default: ()=>{
                return []
            }
        }
    },
    data () {
        return {
            companyName: '',
            form:{
                modelName: '',
                freightType: '2',
                valuationType: '1'
            },
            rule:{
                modelName: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        //console.log(this.companyList);

    },
    methods: {
        handleTabsAdd(){

        },
        reloadData(record){
           
            this.companyList.map(item=>{
                if (item.expressCompanyNo === record.expressCompanyNo){
                    item.expressDetailInfo = record;
                }
                return item;
            });
        },
        cancel(){
            this.$emit('back');
        },
        save(){
            const params = {
                ExpressTemplates: this.companyList
            }

            this.$request(this.$api.ExpressTemplateModify, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功!');
                    this.$emit('back');
                }else{
                    this.$Message.error(data.message)
                }
            }, null, ()=>{}, true)

            
        }
    }
};
</script>
