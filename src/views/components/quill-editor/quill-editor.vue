<style lang="less">
    .ql-snow .ql-picker-label:before{
        vertical-align: top;
    }
    .quill-editor:not(.bubble) .ql-container,
    .quill-editor:not(.bubble) .ql-container .ql-editor {
        height: 300px;
        padding-bottom: 1rem;
    }
</style>

<template>
    <quill-editor :content="content"
                :options="editorOption"
                @change="onEditorChange($event)">
    </quill-editor>
</template>

<script>

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillRedefine } from 'vue-quill-editor-upload'
import { quillEditor } from 'vue-quill-editor'


export default {
    name: 'text-editor',
    components:{
        quillEditor, quillRedefine
    },
    props:{
        data: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            content: this.data,
            editorOption: {
              // some quill options
            }
        };
    },
    methods: {
        // onEditorBlur(quill) {
        //     console.log('editor blur!', quill)
        // },
        // onEditorFocus(quill) {
        //     console.log('editor focus!', quill)
        // },
        // onEditorReady(quill) {
        //     console.log('editor ready!', quill)
        // },
        onEditorChange({ quill, html, text }) {
            // console.log('editor change!', quill, html, text)
            // this.content = html
            this.$emit('on-change', html);
        }
    },
    created () {
        // console.log(1);
        this.editorOption = quillRedefine({
              // 图片上传的设置
              uploadConfig: {
                action:  this.$api.uploadImage,  // 必填参数 图片上传地址
                // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
                // 你必须把返回的数据中所包含的图片地址 return 回去
                res: (respnse) => {
                  return this.imghost+respnse[0]  // 这里切记要return回你的图片地址
                }
              }
            }
        )
    },
    mounted () {
    },
    destroyed () {
  
    },
    watch:{
        data(value){
            console.log(value)
            this.content = value;
        }
    }
};
</script>

<style>

</style>
