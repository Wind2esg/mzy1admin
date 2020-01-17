<style lang="less">
    @import '../../styles/common.less';

    .btn-wraper{
        display: inline-block;
        width: 290px;
        vertical-align: top;
    }
    .intention-apply{
        height: 100%;

        .ivu-card-body{
            display: flex;
            flex-direction: column;

            height: 100%;
        }

        .table-wraper{
            margin-top: 20px;
            margin-bottom: 20px;
            flex: 1 1 auto;
            overflow: auto;
        }
    }
</style>

<template>
    <Card class="intention-apply">
        <div class="search">
            
            <Select style="width: 200px;margin-right: 20px;" v-model="slideType" @on-change="typeChange">
                <Option value="1">首页轮播图</Option>
                <Option value="2">商城轮播图</Option>
            </Select>

            <div class="btn-wraper">
                <Button type="primary" @click="edit({})">新增</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" :loading="dataLoading" :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
        
        <Modal v-model="editVisible" @on-cancel="editVisible=false">
            <Form ref="form" :label-width="60" v-if="editVisible" style="width: 90%">
                <FormItem prop="title" label="标题">
                    <Input type="text" v-model="editData.title" style="width:200px" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem prop="type" label="类型">
                    <Select v-model="editData.type" style="width:200px">
                        <Option value="1">首页轮播图</Option>
                        <Option value="2">商城轮播图</Option>
                    </Select>
                </FormItem>
            </Form>
            <p style="color: #f84444;margin-left:20px;padding-top:10px;padding-left:10px;margin-bottom:20px;border-top:1px solid #ddd;">注：轮播图最佳适配比率为3：2</p>
            <div style="margin-left:20px;">
                <slider-item v-for="(item, index) in editData.imgUrlList" @change="itemChange" :key="item.uid" @remove="removeItem" :showDelete="index!=0" :data="item"></slider-item>
            </div>

            <div style="padding-left:30px;padding-top:20px;" v-if="!editData.imgUrlList||(editData.imgUrlList&&editData.imgUrlList.length<5)"><Button type="dashed" icon="plus" @click="addData">添加</Button></div>

            <div slot="footer">
                <Button type="text" @click="editVisible=false">取消</Button>
                <Button type="primary" :loading="modal_loading" @click="save">保存</Button>
            </div>
        </Modal>

    </Card>

    
</template>

<script>

import sliderItem from './components/slider-item.vue';

export default {
    name: 'slider-manage',
    components: {
        sliderItem
    },
    data () {
        return {
            editVisible: false,
            total: 100,
            pageSize: 15,
            pageIndex: 1,
            modal_loading: false,
            slideType: '1',
            editData: {},
            dataLoading: false,
            rule: {
                title: [
                    { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: 'Please fill in the password.', trigger: 'blur' }
                ]
            },
            columns: [
                {
                    title: '标题',
                    key: 'title'
                },
                {
                    title: '类型',
                    key: 'typeShow'
                },
                {
                    title: '图片数量',
                    key: 'imgCount'
                },
                {
                    title: '创建时间',
                    key: 'addTime'
                },
                {
                    title: '是否开启',
                    render: (h, params) => {
                        return h('div', params.row.isOpen ? '是':'否');
                    }
                },
                {
                    title: ' ',
                    width: 220,
                    render: (h, params) => {

                        let arr = [];

                        arr.push(h('Button', {
                            props: {
                                type:'primary'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on:{
                                click: ()=>{

                                    this.$request(this.$api.CarouselImgModel, {Id:params.row.id}, data=>{
                                        if (data.isSuccess){
                                            this.edit(data.result);
                                        }
                                    })

                                    
                                }
                            }
                        }, '编辑'));

                        if (!params.row.isOpen){
                            arr.push(h('Button', {
                                props: {
                                    type:'info'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on:{
                                    click: ()=>{
                                        this.changeOpen(params.row);
                                    }
                                }
                            }, '启用'))
                            arr.push(h('Poptip', {
                                props: {
                                    confirm: 'confirm',
                                    title: '删除后不可恢复，确定删除？',
                                    placement: 'top-end',
                                    transfer: true
                                },
                                on:{
                                    'on-ok':()=>{
                                        this.deleteData(params.row);
                                    }
                                }
                            },[h('Button', {
                                props: {
                                    type: 'error',
                                }
                            }, '删除')]))
                        }

                        return h('div', arr);
                    }
                }
            ],
            data: []
        }
    },
    computed: {
        sliderList () {
            return this.$store.state.app.sliderType;
        }
    },
    created(){
        this.getData();
        //console.log(this.$store.state.app.sliderType)
    },
    methods: {
        getData(bol){
            const params = {
                IndexPage: this.pageIndex,
                Take: this.pageSize,
                Type: this.slideType
            }

            if (!bol){
                this.dataLoading = true;
            }

            this.$request(this.$api.CarouselImgList, params, data=>{
                this.data = data.result.list;
                this.total = data.result.length;
                this.dataLoading = false;
            })
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        typeChange(){
            this.getData();
        },
        addData(){

            if (this.editData.imgUrlList.length >= 5){
                this.$Message.error('幻灯片最多添加5个');
                return;
            }

            const data = {
                uid: this.guid(),
                id: 0,
                carouselImgId: 0,
                imgUrl: '',
                linkUrl: ''
            }

            this.editData.imgUrlList.push(data);

        },
        edit(record){
            if (record.id){
                this.editData = record;
                this.editData.imgUrlList = this.editData.imgUrlList.map(item=>{
                    let obj = {};                  
                    for (var u in item){
                        obj[u] = item[u];
                    }
                    obj.uid = this.guid();
                    return obj;
                })
                console.log(this.editData);

                this.editData.type = this.editData.type+'';
            }else{
                this.editData = {
                    title: '',
                    type: '',
                    imgUrlList: []
                }
            }
            
            this.editVisible = true;
        },
        removeItem(data){
            const list = this.editData.imgUrlList.filter(item=>{
                return item.uid != data.uid;
            })
            this.editData.imgUrlList = list
        },
        itemChange(data){
            this.editData.imgUrlList = this.editData.imgUrlList.map(item=>{
                
                if (item.uid == data.uid){
                    item = Object.assign(item, data);
                }else if (item.id && data.id && item.id == data.id){
                    item = Object.assign(item, data);
                }
                return item;
            })
        },
        save(){

            const haveImage = this.editData.imgUrlList.filter(item=>{
                return item.imgUrl == '';
            })

            if (this.editData.title == ''){
                this.$Message.error('请输入标题');
                return;
            }else if (this.editData.type == ''){
                this.$Message.error('请选择轮播类型');
                return;
            }else if (!this.editData.imgUrlList.length){
                this.$Message.error('请添加图片');
                return;
            }else if (haveImage.length){
                this.$Message.error('图片不可为空');
                return;
            }

            const params = {
                Id: this.editData.id || 0,
                Title: this.editData.title,
                Type: this.editData.type,
                ImgUrlList: this.editData.imgUrlList.map(item=>{
                    return {
                        Id: item.id,
                        CarouselImgId: item.carouselImgId,
                        ImgUrl: item.imgUrl,
                        LinkUrl: ''
                    }
                })
            }

            // console.log(params);
            // return;

            this.$request(this.$api.CarouselImgEdit, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功');
                }else{
                    this.$Message.error(data.message);
                }
                this.getData();
                this.editVisible = false;
            }, null, ()=>{}, true)

            console.log(params)
        },
        changeOpen(record){
            const params = {
                Id: record.id,
                IsOpen: true
            }

            this.$request(this.$api.CarouselImgOpen, params, data=>{
                this.getData()
            })

        },
        deleteData(record){
            const params = {
                Id: record.id
            }

            this.$request(this.$api.CarouselImgDelete, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('删除成功！');
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            })

        },
        getUID(){
            return new Date().getTime()
        },
        guid(){
            var a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};
            return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()
        }
    }
};
</script>
