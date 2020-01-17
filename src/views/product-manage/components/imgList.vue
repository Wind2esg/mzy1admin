<style lang="less">
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="imghost+item.url">
                <div class="demo-upload-list-cover" v-if="!disabled">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <span v-show="!disabled" style="display: inline-block;width:58px;">
            <Upload
                v-show="uploadList.length<=3"
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                multiple
                type="drag"
                :action="$api.uploadImage"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
        </span>
        <Modal title="查看图片" v-model="visible">
            <img :src="imghost+imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
export default {
    props: {
        disabled:{
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: ()=>{
                return [];
            }
        }
    },
    data () {
        return {
            defaultList: this.list.map(item=>{
                return {
                    name: '1',
                    url: item,
                    status: 'finished'
                }
            }),
            imgName: '',
            visible: false,
            uploadList: []
        }
    },
    methods: {
        handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            file.url = res[0];
            // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            this.$emit('upload', this.uploadList);
            console.log(this.uploadList);
        }
    },
    mounted () {
        const list = this.list.map(item=>{
                return {
                    name: '1',
                    url: item,
                    status: 'finished'
                }
            })
        this.uploadList = this.disabled ? list : this.$refs.upload.fileList;
        console.log(this.uploadList);
    }
}
</script>
