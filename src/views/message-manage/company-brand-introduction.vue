<style lang="less">
    @import '../../styles/common.less';

    .btn-wraper{
        display: inline-block;
        width: 290px;
        vertical-align: top;
    }
    .cb-introduction-apply{
        height: 100%;
        overflow: hidden;
        width: 100%;
        
        .cb-left{
            display: block;
            height: 100%;
            position: relative;
            overflow: hidden;
            

            
            .ivu-col, .ivu-card{
                height: 100%;
            }
            .card{
                position: absolute;
                width: 100%;
            }

            .ivu-card-body{
                display: flex;
                flex-direction: column;

                height: 100%;
            }

            .table-wraper{
                margin-top: 20px;
                margin-bottom: 20px;
                margin-right: 15px;
                flex: 1 1 auto;
                overflow: auto;
            }
        }
        .col-box{
            position: absolute;
        }
        .cb-right{
            left: 67%;
            transition: left .5s
        }
        .cb-r-right{
            left: 100%;
            transition: left .5s
        }
        .img{
            width: 80%;
            margin: 0 auto;

            img{
                display: block;
                width: 100%;
            }
        }
        .edit{
            position: absolute;
            right: 0;
            color: #619fe7;
            font-weight: 400;
            font-size: 12px;
            cursor: pointer;
        }
        
    }

    /**品牌历程编辑显示隐藏动画**/
    .go-left-enter-active, .go-left-leave-active {
        transition: transform .5s
    }
    .go-left-enter{
        -webkit-transform: translate(100%, 0);
        transform: translate(100%, 0);
    }
    .go-left-leave{
        -webkit-transform: translate(0, 0);
        transform: translate(0, 0);
    }
    .go-left-leave-to{
        -webkit-transform: translate(100%, 0);
        transform: translate(100%, 0);
    }



    /**品牌、公司编辑  品牌历程显示隐藏动画**/
    .left-box-enter-active, .left-box-leave-active {
        transition: transform .5s
    }
    .left-box-enter{
        -webkit-transform: translate(-100%, 0);
        transform: translate(-100%, 0);
    }
    .left-box-enter-to{
        -webkit-transform: translate(0, 0);
        transform: translate(0, 0);
    }
    .left-box-leave{
        -webkit-transform: translate(0, 0);
        transform: translate(0, 0);
    }
    .left-box-leave-to{
        -webkit-transform: translate(-100%, 0);
        transform: translate(-100%, 0);
    }


    /**品牌、公司编辑  品牌、公司显示动画**/
    .to-left-enter-active, .to-left-leave-active {
        transition: left .5s
    }
    .to-left-enter-to{
        left: 0;
    }


    .brand-title{
        display: flex;
        justify-content: space-between;
    }

    
</style>

<template>
    <Row class="cb-introduction-apply" :gutter="30">
        
        <transition name="left-box">
            <Col span="16" class="col-box cb-left" v-if="!editBrandVisible">
                <Card class="card" key="page1">
                    <div class="brand-title">
                        <div>
                            <p>品牌历程封面:</p>
                            <Upload
                                ref="upload"
                                :show-upload-list="false"
                                :on-success="handleSuccess"
                                :format="['jpg','jpeg','png']"
                                :action="$api.uploadImage"
                                style="display: inline-block;width:58px;">
                                <div style="width: 200px;height:120px;line-height: 145px;text-align:center;border:1px dashed #ddd;">
                                    <Icon v-if="imgUrl==''" type="plus-round" size=40 style="color:#999"></Icon>
                                    <img v-else :src="imghost+imgUrl" style="width:100%;height:100%"/>
                                </div>
                            </Upload>
                        </div>
                        <div style="margin-top: 100px;margin-right: 10px;"><Button type="primary" @click="showEditTimer({})">新增品牌历程</Button></div>
                    </div>
                    <div class="table-wraper">
                        <Table :columns="columns" :loading="dataLoading" :data="data"></Table>
                    </div>
                    <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" style="margin-top:20px;" ></Page>
                </Card>
                <transition name="go-left">
                    <Card class="card" key="page2" v-if="editVisible" style="z-index:100">
                        <brand-introduction :data="historyData" @back="hideEditTimer" @reload="reloadData" :type="type" key="introduction"></brand-introduction>
                    </Card>
                </transition>
            </Col>
        </transition>
        
        <Col span="8" class="col-box cb-right" :style="{left: left}">
            <Card>
                <p slot="title" style="position:relative">品牌介绍 <span class="edit" @click="editBrand('brand')">查看编辑</span></p>
                <div class="img">
                    <img :src="brandData.imgUrl?(imghost+brandData.imgUrl):'http://cdn.xiaojiankeji.com/images/PC/201801051402281.png'"/>
                </div>
            </Card>
            <Card style="margin-top:10px;">
                <p slot="title" style="position:relative">公司介绍 <span class="edit"  @click="editBrand('company')">查看编辑</span></p>
                <div class="img">
                    <img :src="companyData.imgUrl?(imghost+companyData.imgUrl):'http://cdn.xiaojiankeji.com/images/PC/201801051402281.png'"/>
                </div>
            </Card>
        </Col>

        
        <Col span="16" class="col-box cb-r-right"  :style="{left: left1}">
            <Card class="card" key="page2" style="z-index:100">
                <brand-introduction :data="type=='brand'?brandData:(type=='company'?companyData:{})" @back="hideEditBrand" @reload="reloadData" :type="type" key="introduction1"></brand-introduction>
            </Card>
        </Col>
        
        
        
    </Row>
</template>

<script>

import brandIntroduction from './components/edit-brand-introduction.vue';

export default {
    name: 'slider-manage',
    components: {
        brandIntroduction
    },
    data () {
        return {
            editVisible: false,
            editBrandVisible: false,
            left: '67%',
            left1: '100%',
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            itemList: [],
            historyData: {},
            dataLoading: false,
            brandData: {},
            companyData: {},
            type: '',
            imgUrl: '',
            columns: [
                {
                    title: '标题',
                    key: 'title'
                },
                {
                    title: '时间节点',
                    key: 'timeNode'
                },
                {
                    title: '是否开启',
                    render: (h, params) => {
                        return h('div', [
                                h('i-switch', {
                                    props:{
                                        'value': params.row.isOpen
                                    },
                                    on:{
                                        'on-change':()=>{
                                            this.changeOpen(params.row);
                                        }
                                    }
                                })
                            ])
                    }
                },
                {
                    title: ' ',
                    width: 160,
                    render: (h, params) => {

                        const elem = [
                            h('Button', {
                                props: {
                                    type:'primary'
                                },
                                style: {
                                    marginRight: '10px'
                                },
                                on:{
                                    click: ()=>{
                                        this.showEditTimer(params.row)
                                    }
                                }
                            }, '编辑'),
                            h('Poptip', {
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
                            }, '删除')])
                        ]

                        return h('div', elem);
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
        this.getBrand();
        this.getCompany();
        this.getImg();
        //console.log(this.$store.state.app.sliderType)
    },
    methods: {
        getData(bol){

            const params = {
                IndexPage: this.pageIndex,
                Take: this.pageSize
            }

            if (!bol){
                this.dataLoading = true;
            }
            
            this.$request(this.$api.CompanyHistoryList, params, data=>{
                this.dataLoading = false;
                this.data = data.result.list;
                this.total = data.result.length;
            })

        },
        getBrand(){
            this.$request(this.$api.BrandModel, {}, data=>{
                this.brandData = data.result;
            })
        },
        getCompany(){
            this.$request(this.$api.CompanyModel, {}, data=>{
                this.companyData = data.result;
            })
        },
        getImg(){
            this.$request(this.$api.CompanyHistoryMainImgModel, {}, data=>{
                this.imgUrl = data.result.imgUrl;
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
        showEditTimer(record){
            this.type = 'history';
            this.historyData = record;
            this.editVisible = true;
        },
        hideEditTimer(){
            this.editVisible = false;
        },
        hideEditBrand(){
            this.left = '67%';
            this.left1 = '100%';
            
            setTimeout(()=>{
                this.type = '';
            }, 1000)

            this.editBrandVisible = false;
        },
        editBrand(type){
            
            if (this.editBrandVisible){
                this.type = type;
            }else{
                setTimeout(()=>{
                    this.type = type;
                }, 1000)
            }

            this.left = '0';
            this.left1 = '32%';
            this.editBrandVisible = true;

            
            
        },
        reloadData(){
            if (this.type == 'brand'){
                this.getBrand();
            }else if (this.type == 'company'){
                this.getCompany();
            }else{
                this.getData();
            }
        },
        changeOpen(record){
            const params = {
                Id: record.id,
                IsOpen: !record.isOpen
            }

            this.$request(this.$api.CompanyHistoryOpen, params, data=>{
                setTimeout(()=>{
                    this.getData(true)
                }, 200);
            })

        },
        deleteData(record){
            const params = {
                Id: record.id
            }

            this.$request(this.$api.CompanyHistoryDelete, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('删除成功！');
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            })

        },
        handleSuccess(data){
            this.imgUrl = data[0];

            const params = {
                ImgUrl: this.imgUrl
            }

            this.$request(this.$api.CompanyHistoryMainImgEdit, params, data=>{
                this.$Message.info(data.message);
            })
        },
        getUID(){
            return new Date().getTime()
        }
    }
};
</script>
