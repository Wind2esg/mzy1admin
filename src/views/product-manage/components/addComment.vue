<style lang="less">
    .add-comment{
        padding: 60px 40px;
    }
</style>

<template>
    <div class="add-comment">
        <Form ref="form" :model="form" :rules="rule" :label-width="160">
  
            <FormItem label="评论产品" prop="productId">
                <Select v-model="form.productId" style="width:300px;" :disabled="data.productId?true:false">
                    <Option :value="item.id" :key="item.id" v-for="item in list">{{item.productName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="评论内容" prop="commentContent">
                <Input v-model="form.commentContent" type="textarea" :maxlength=50 :autosize="{minRows:6}" placeholder="评论内容" style="width:300px;"></Input>
            </FormItem>
            <FormItem label="评论人" prop="commentName">
                <Input v-model="form.commentName" placeholder="评论人" :disabled="data.productId?true:false" style="width:300px;"></Input>
            </FormItem>
            <FormItem label="添加评论图片（可选）" prop="pic">
                <img-list @upload="uploadImages" :list="form.commentImg" :disabled="data.productId?true:false"></img-list>
            </FormItem>
            
            <FormItem>
                <Button style="margin-right: 10px;" @click="cancel">返回</Button>
                <Button type="primary" @click="handleSave">保存</Button>
            </FormItem>

        </Form>


    </div>
</template>

<script>

import imgList from './imgList';


export default {
    components: {
        imgList
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
            visible:true,
            list: [],
            form:{
                commentId: null,
                productId: '',
                commentContent: '',
                commentName: '',
                commentImg: []
            },
            rule:{
                productId: [
                    { required: true, message: '请选择产品' }
                ],
                commentContent: [
                    { required: true, message: '请输入评论内容' }
                ],
                commentName: [
                    { required: true, message: '请输入评论人' }
                ]
            }
        }
    },
    created(){

        this.form.commentId = this.data.commentId || null,
        this.form.productId = this.data.productId || '',
        this.form.commentContent = this.data.commentContent || '';
        this.form.commentName = this.data.commentMemberName || '';
        this.form.commentImg = this.data.commentImgs || [];

        this.getList();
    },
    methods: {
        getList(){
            this.$request(this.$api.getProductIdAndNameList, {}, data=>{
                this.list = data || [];
            })
        },
        uploadImages(list){
            this.form.commentImg = list.map(item=>{
                return item.url;
            });
        },
        cancel(){
            this.$emit("cancel");
        },
        handleSave(){
            this.$refs['form'].validate(valid=>{
                if (valid){
                    this.saveData();
                }
            })
        },
        saveData(){

            this.$request(this.$api.insertProductComment, this.form, data=>{
                if (data.isSuccess){
                    this.cancel();
                    this.$emit('reload');
                }else{
                    this.$Message.error(data.message);
                }
            }, null, ()=>{}, true)
        }
    }
};
</script>
