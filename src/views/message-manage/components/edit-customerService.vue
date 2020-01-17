<style lang="less">

</style>

<template>
    
    <div style="padding-top:30px">
        <Form ref="form" :model="form" :rules="rule" :label-width="100">
            <FormItem prop="sort" label="排序">
                <InputNumber type="text" v-model="form.sort" style="width:300px" placeholder="请输入标题"></InputNumber>
            </FormItem>
            <FormItem prop="title" label="标题">
                <Input type="text" v-model="form.title" style="width:300px" placeholder="请输入标题"></Input>
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
                sort: 0,
                title: '',
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
        //console.log(this.$store.state.app.sliderType)
    },
    methods: {
        getData(){
            const params = {
                Id: this.data.id
            }

            this.$request(this.$api.CustomerServiceCommonmQuestionModel, params, data=>{
                this.form.sort = data.result.sort;
                this.form.title = data.result.title;
                this.form.content = data.result.content;
            })
        },
        cancel(){
            this.$emit("back");
        },
        save(){
            if (this.form.sort === ''){
                this.$Message.error('请输入排序!');
                return;
            }else if (this.form.title == ''){
                this.$Message.error('请输入标题!');
                return;
            }else if (this.form.content == ''){
                this.$Message.error('请输入公告内容!');
                return;
            }
            
            const params = {
                Id: this.data.id || 0,
                Title: this.form.title,
                Sort: this.form.sort,
                Content: this.form.content
            }

            this.$request(this.$api.CustomerServiceCommonmQuestionEdit, params, data=>{
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
