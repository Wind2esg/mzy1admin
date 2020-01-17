<style lang="less">
.Modal_from {
  
  .fromInput {
    width: 200px;
  }
}
.highLink_wrap{
  
  .row_box{
    margin-top: 12px;
  }
  .link_btn{
    cursor: pointer;
  }
}

</style>
<template>

    <Modal v-model="isShow" width=745 title='代理银行卡' @on-cancel="hide" class="agent_modalwarp">
        <Table :columns="columns" :data="data" size="small"></Table>
        <Page :total="total" @on-change="pageChange" :page-size="pageSize" style="margin-top:20px"></Page>
        <div slot="footer"></div>
    </Modal>

</template>
<script>

let  that
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        memberId:Number,
    },
    components: {

    },
    data() {
        return {
            isShow: false,
            total: 0,
            pageIndex: 1,
            pageSize: 10,
            columns: [{
                title: '卡号',
                key: 'bankNo',
                width:250,
            },{
                title: '开户银行',
                key: 'bankName',
                width:160,
            },{
                title: '开户人',
                key: 'holderName',
                width:150,
            },
            // {
            //     title: '开户地区',
            //     key: '',
            //     width:160,
            //     render: (h, params)=>{
            //         return h('div', [params.row.province, params.row.city, params.row.area].join(""));
            //     }
            // },{
            //     title: '开户支行',
            //     key: 'bankNetwork',
            //     width:200,
            // },
            {
                title: '状态',
                key: '',
                width:150,
                render: (h, params)=>{
                    return h('div', params.row.isDefault ? '默认':'');
                }
            }],
            data: []
            }
    },
    created() {
        this.getData();
    },
    methods: {
        getData(){
            const params = {
                MemberId: this.memberId,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.$request(this.$api.getBankCardList, params, data=>{
                this.total = data.result.totalCount;
                this.data = data.result.resultList;
            })

        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        hide(){
            this.$emit('modal-ok')
        }
    },
    watch: {
        visible(value) {
            this.isShow = value;
            if (value){
                this.getData();
            }
            
        }
    }
};

</script>
