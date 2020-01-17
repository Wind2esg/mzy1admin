<style lang="less">

</style>

<template>
   <Modal
        v-model="isShow"
        width=573
        title="售后原因管理"
        @on-ok="ok"
        @on-cancel="cancel">

        <p style="margin-bottom: 20px;">
            <Button type="ghost" icon="plus-round" @click="addAddress">新增</Button>
        </p>

        <Table :columns="columns" border :data="data"></Table>

    </Modal>
</template>

<script>

export default {
    components: {
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isShow: this.visible,
            form: {
                msg: ''
            },
            rule: {},
            columns: [{
                title: '类型',
                key: 'addressName',
                width: 120,
                render: (h, params)=>{
                    if (params.row.isEdit){
                        return h('i-input', {
                            props: {
                                value: params.row.addressName
                            }
                        })
                    }else{
                        return h('div', params.row.addressName);
                    }
                }
            },{
                title: '类型内容',
                key: 'userName',
                width: 260,
                render: (h, params)=>{
                    if (params.row.isEdit){
                        return h('i-input', {
                            props: {
                                value: params.row.userName
                            }
                        })
                    }else{
                        return h('div', params.row.userName);
                    }
                }
            },{
                title: ' ',
                key: '',
                width: 160,
                render: (h, params)=>{

                    if (params.row.isEdit){
                        return h('div', [
                            h('Button', {
                                props:{
                                    type:'primary'
                                },
                                style:{
                                    marginRight: '5px'
                                }
                            }, "保存"),
                            h('Button', {
                                props:{
                                    type:'ghost'
                                }
                            }, "取消")
                        ])
                    }else{
                        return h('div', [
                            h('Button', {
                                props:{
                                    type:'primary'
                                },
                                style:{
                                    marginRight: '5px'
                                }
                            }, "编辑"),
                            h('Button', {
                                props:{
                                    type:'error'
                                }
                            }, "删除")
                        ])
                    }
                    
                }
            }],
            data: [{
                id: 1,
                addressName: '地址1',
                userName: '收货人',
                phone: '15370016430',
                city: '浙江杭州江干',
                address: '九和路',
                isEdit: false
            },{
                id: 2,
                addressName: '地址1',
                userName: '收货人',
                phone: '15370016430',
                city: '浙江杭州江干',
                address: '九和路',
                isEdit: false
            }]
        }
    },
    methods: {
        ok(){
            this.$emit('cancel')
        },
        cancel(){
            this.$emit('cancel')
        },
        addAddress(){
            this.data.push({
                id: this.guid(),
                addressName: '',
                userName: '',
                phone: '',
                city: '',
                address: '',
                isEdit: true
            })
        },
        guid(){
            return new Date().getTime();
        }
    },
    watch:{
        visible (value){
            this.isShow = value;
        }
    }
};
</script>
