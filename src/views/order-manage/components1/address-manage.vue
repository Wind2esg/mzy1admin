<style lang="less">

</style>

<template>
   <Modal
        v-model="isShow"
        width=913
        title="售后地址管理"
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
                title: '地址名称',
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
                title: '收货人姓名',
                key: 'userName',
                width: 100,
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
                title: '收货人联系电话',
                key: 'phone',
                width: 150,
                render: (h, params)=>{
                    if (params.row.isEdit){
                        return h('i-input', {
                            props: {
                                value: params.row.phone
                            }
                        })
                    }else{
                        return h('div', params.row.phone);
                    }
                }
            },{
                title: '地区',
                key: 'city',
                width: 150,
                render: (h, params)=>{
                    if (params.row.isEdit){
                        return h('i-input', {
                            props: {
                                value: params.row.city
                            }
                        })
                    }else{
                        return h('div', params.row.city);
                    }
                }
            },{
                title: '详细地址',
                key: 'address',
                width: 200,
                render: (h, params)=>{
                    if (params.row.isEdit){
                        return h('i-input', {
                            props: {
                                value: params.row.address
                            }
                        })
                    }else{
                        return h('div', params.row.address);
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
