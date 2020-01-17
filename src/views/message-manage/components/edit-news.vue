<style lang="less">

</style>

<template>
    
    <div style="padding-top:30px">
        <Form ref="form" :model="form" :rules="rule" :label-width="100">
            <FormItem prop="title" label="新闻标题">
                <Input type="text" v-model="form.title" style="width:200px;"/>
            </FormItem>

            <FormItem prop="imgUrl" label="新闻配图">
                <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :action="$api.uploadImage"
                    style="display: inline-block;width:58px;">
                    <div style="width: 200px;height:120px;line-height: 145px;text-align:center;border:1px dashed #ddd;">
                        <Icon v-if="form.imgUrl==''" type="plus-round" size=40 style="color:#999"></Icon>
                        <img v-else :src="imghost+form.imgUrl" style="width:100%;height:100%"/>
                    </div>
                </Upload>
            </FormItem>
            
        </Form>

        <text-editor :data="form.content" @on-change="textChange"></text-editor>
        
        <div style="text-align:right;margin-top: 20px;margin-right: 20px;">
            <Button style="margin-right: 30px" @click="cancel">返回</Button>
            <Button type="primary" @click="save">保存</Button>
        </div>

    </div>
    
</template>

<script>

import textEditor from '../../components/quill-editor/quill-editor.vue'


export default {
    name: 'edit-notice',
    components: {
        textEditor
    },
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
            form: {
                title: '',
                imgUrl:'',
                content: ''
            },
            rule: {
            },
        }
    },
    computed: {
    },
    created(){
        
        if (this.data.id){
            this.getData();
        }
        
    },
    methods: {
        getData(){
            const params = {
                Id: this.data.id
            }

            this.$request(this.$api.CompanyNewsModel, params, data=>{
                this.form.title = data.result.title;
                this.form.imgUrl = data.result.imgUrl;
                this.form.content = data.result.content;
                console.log(this.form.content,123456789)
            })
        },
        cancel(){
            this.$emit("back");
        },
        save(){
            if (this.form.title == ''){
                this.$Message.error('请输入新闻标题!');
                return;
            }else if (this.form.imgUrl == ''){
                this.$Message.error('请选择图片!');
                return;
            }else if (this.form.content == ''){
                this.$Message.error('请输入新闻内容!');
                return;
            }
            
            const params = {
                Id: this.data.id || 0,
                Title: this.form.title,
                ImgUrl: this.form.imgUrl,
                Content: this.form.content
            }

            this.$request(this.$api.CompanyNewsEdit, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功!');
                    this.cancel();
                    this.$emit('reload');
                }else{
                    this.$Message.error(data.message);
                }
            })

        },
        textChange(text){
            this.form.content = text;
        },
        handleSuccess(data){
            this.form.imgUrl = data[0];
        }
    }
};
</script>
