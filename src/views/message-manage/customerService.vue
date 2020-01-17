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
        <div class="search" v-if="!editVisible">

            <div class="btn-wraper">
                <Button type="primary" @click="edit({})">新增</Button>
            </div>

        </div>
        
        <div class="table-wraper" v-if="!editVisible">
            <Table :columns="columns" :loading="loadingData" :data="data"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" v-if="!editVisible"></Page>
        
        <edit-notice v-if="editVisible" :data="editData" @back="hideEdit" @reload="getData"></edit-notice>
       
    </Card>
</template>

<script>

import editNotice from './components/edit-customerService.vue';

export default {
    name: 'slider-manage',
    components: {
        editNotice
    },
    data () {
        return {
            loadingData: false,
            editVisible: false,
            editData: {},
            pageIndex: 1,
            pageSize: 15,
            total: 0,
            columns: [
                {
                    title: '排序',
                    key: 'sort'
                },
                {
                    title: '标题',
                    key: 'title'
                },
                {
                    title: '创建时间',
                    key: 'addTime'
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
                                        this.edit(params.row)
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
    },
    created(){
        this.getData();
        //console.log(this.$store.state.app.sliderType)
    },
    methods: {
        getData(bol){

            if (!bol){
                this.loadingData = true;
            }
            

            const params = {
                IndexPage: this.pageIndex,
                Take: this.pageSize
            };

            this.$request(this.$api.CustomerServiceCommonmQuestionList, params, data=>{
                this.data = data.result.list.map((item, index)=>{
                    item.index = (this.pageIndex-1)*this.pageSize + index + 1;
                    return item;
                });
                this.total = data.result.length;
                this.loadingData = false;
            })

        },
        edit(record){
            this.editData = record;
            this.editVisible = true;
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        hideEdit(){
            this.editVisible = false;
        },
        changeOpen(record){
            const params = {
                Id: record.id,
                IsOpen: !record.isOpen
            }

            this.$request(this.$api.CustomerServiceCommonmQuestionOpen, params, data=>{
                setTimeout(()=>{
                    this.getData(true)
                }, 200);
            })

        },
        deleteData(record){
            const params = {
                Id: record.id
            }

            this.$request(this.$api.CustomerServiceCommonmQuestionDelete, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('删除成功！');
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            })

        },
    }
};
</script>
