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

        <div class="search" v-if="!visible">

            <Input v-model="keywords" placeholder="产品名称" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
            
            <Select v-model="state" style="width: 150px;margin-right:10px;margin-bottom:10px;">
                <Option value="1">已上架</Option>
                <Option value="2">未上架</Option>
            </Select>

            <div class="btn-wraper">
                <Button type="primary" @click="getData">搜索</Button>
                <Button type="info" @click="showEdit({})">新增</Button>
            </div>

        </div>
        
        <div class="table-wraper" style="max-width:1470px" v-if="!visible">
            <Table :columns="columns" :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" v-if="!visible"></Page>
        
        <add-comment v-if="visible" :data="editData" @cancel="hideEdit" @reload="reloadData"></add-comment>
        
    </Card>
</template>

<script>

import addComment from './components/addComment';

export default {
    name: 'intention-apply',
    components: {
        addComment
    },
    data () {
        return {
            visible: false,
            keywords: '',
            state: '1',
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            editData: {},
            columns: [
                {
                    title: '产品名称',
                    width: 160,
                    key: 'productName'
                },
                {
                    title: '评论内容',
                    width: 200,
                    key: 'commentContent'
                },
                {
                    title: '评论图片',
                    width: 240,
                    key: 'pic',
                    render: (h, params)=>{
                        const img = params.row.commentImgs.map(item=>{
                            return h("img", {
                                attrs: {
                                    src: this.imghost+item
                                },
                                style:{
                                    width: '60px',
                                    maxHeight: '60px',
                                    marginRight: '5px'
                                }
                            })
                        })

                        return h('div', img);
                    }
                },{
                    title: '评论时间',
                    width: 160,
                    key: 'addTime'
                },{
                    title: '评论状态',
                    width: 100,
                    key: 'isDisplay',
                    render: (h, params)=>{
                        return h('div', params.row.isDisplay ? '已上架' : '未上架')
                    }
                },{
                    title: '评论代理',
                    width: 100,
                    key: 'commentMemberName',
                },{
                    title: '代理等级',
                    key: 'roleName',
                    width: 100
                },{
                    title: '代理电话',
                    width: 180,
                    key: 'commentMemberPhone',
                },{
                    title: '操作',
                    key: 'action',
                    width: 220,
                    fixed: 'right',
                    render: (h, params)=>{
                        let arr = [];

                        arr.push(h('Button', {
                            props: {
                                type: 'primary',
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on:{
                                click: ()=>{
                                    this.showEdit(params.row);
                                }
                            }
                        }, '编辑'))

                        if (params.row.isDisplay){
                            arr.push(h('Button', {
                                props: {
                                    type: 'info',
                                },
                                on:{
                                    click: ()=>{
                                        this.changeDisplay(params.row);
                                    }
                                }
                            }, '下架'))
                        }else{
                            arr.push(h('Button', {
                                props: {
                                    type: 'info',
                                },
                                on:{
                                    click: ()=>{
                                        this.changeDisplay(params.row);
                                    }
                                }
                            }, '上架'))
                        }

                        arr.push(
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
                                },
                                style: {
                                    marginLeft: '5px'
                                }
                            }, '删除')])
                        )

                        return h('div', arr);

                    }
                }


            ],
            data: []
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){

            const params = {
                KeyWords: this.keywords,
                IsDisplay: this.state,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            };

            this.$request(this.$api.productCommentList, params, data=>{
                this.total = data.result.totalCount;
                this.data = data.result.resultList;
            })
        },
        stateChange(value){
            this.state = value;
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        showEdit(record){
            this.visible = true;
            this.editData = record;
        },
        hideEdit(){
            this.visible = false;
        },
        reloadData(){
            this.getData();
        },
        changeDisplay(record){
            const params = {
                CommentId: record.commentId
            };

            this.$request(this.$api.productCommentDisplaySet, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('修改成功!');
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            })
        },
        deleteData(record){
            const params = {
                CommentId: record.commentId
            };

            this.$request(this.$api.productCommentDelete, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('修改成功!');
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            })
        }
    }
};
</script>
