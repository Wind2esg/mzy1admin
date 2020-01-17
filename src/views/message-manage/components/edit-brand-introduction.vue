<style lang="less">

</style>

<template>
    
    <div style="padding-top:30px;padding-right: 20px;">
        <Form ref="form" :model="form" :rules="rule" :label-width="type=='history'?100:50">
            <FormItem prop="name" label="标题" v-if="type=='history'">
                <Input type="text" v-model="form.name" style="width: 200px"/>
            </FormItem>
            <FormItem prop="time" label="时间节点" v-if="type=='history'">
                <DatePicker type="date" placeholder="选择时间" v-model="form.time" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem prop="imgUrl" label="配图" v-if="type!='history'">
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

        <text-editor :data="form.text" @on-change="textChange"></text-editor>
        
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
            default:()=>{
                return {}
            }
        },
        type: String
    },
    data () {
        return {
            form: {
                name: '',
                time: '',
                imgUrl:'',
                text: ''
            },
            rule: {
            },
        }
    },
    computed: {
    },
    created(){

    },
    methods: {
        getData(){
            const params = {
                Id: this.data.id
            }

            this.$request(this.$api.CompanyHistoryModel, params, data=>{
                this.form.name = data.result.title;
                this.form.time = data.result.timeNode;
                this.form.text = data.result.content;
                // console.log(this.form);
            })
        },
        cancel(){
            // setTimeout(()=>{
            //     this.form.name = '';
            //     this.form.time = '';
            //     this.form.imgUrl = '';
            //     this.form.text = '';
            // }, 300)
            
            this.$emit("back");
        },
        save(){
            if(!this.validate()) return;
            
            if (this.type == 'history'){
                this.saveHistory();
            }else if (this.type == 'brand'){
                this.saveBrand();
            }else if (this.type == 'company'){
                this.saveCompany();
            }
        },
        validate(){
            if (this.type == 'history'){
                if (this.form.name == ''){
                    this.$Message.error('请输入标题！');
                    return false;
                }else if (this.form.time == ''){
                    this.$Message.error('请选择时间节点！');
                    return false;
                }else if (this.form.text == ''){
                    this.$Message.error('请输入内容详情！');
                    return false;
                }else{
                    return true;
                }
            }else{
                if (this.form.imgUrl == ''){
                    this.$Message.error('请选择图片！');
                    return false;
                }else if (this.form.text == ''){
                    this.$Message.error('请输入内容详情！');
                    return false;
                }else{
                    return true;
                }
            }
        },
        saveHistory(){

            //if (this.type != 'history') return;

            const params = {
                Id: this.data.id || 0,
                Title: this.form.name,
                TimeNode: this.form.time,
                Content: this.form.text
            }

            this.$request(this.$api.CompanyHistoryEdit, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功!');
                    this.$emit("reload");
                    this.cancel();
                }else{
                    this.$Message.error(data.message);
                }
            })

        },
        saveBrand(){
            const params = {
                ImgUrl: this.form.imgUrl,
                Content: this.form.text
            }
            this.$request(this.$api.BrandEdit, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功!');
                    this.$emit("reload");
                    this.cancel();
                }else{
                    this.$Message.error(data.message);
                }
            })
        },
        saveCompany(){
            const params = {
                ImgUrl: this.form.imgUrl,
                Content: this.form.text
            }
            this.$request(this.$api.CompanyEdit, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功!');
                    this.$emit("reload");
                    this.cancel();
                }else{
                    this.$Message.error(data.message);
                }
            })
        },
        handleSuccess(data){
            this.form.imgUrl = data[0];
        },
        textChange(text){
            this.form.text = text;
        }
    },
    created(){
        //console.log(this.data);
        if (this.type == 'history'){
            if (this.data.id){
                this.getData();
            }
        }else{
            this.form.imgUrl = this.data.imgUrl || '';
            this.form.text = this.data.content || '';
        }
        
    },
    watch: {
        data (value){
            this.data = value;
            this.form.imgUrl = this.data.imgUrl || '';
            this.form.text = this.data.content || '';
        }
    }
};
</script>
