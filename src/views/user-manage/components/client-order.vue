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

    <Modal v-model="isShow" width=900 title='' @on-cancel="Modal_cencel" class="agent_modalwarp">
        
        <div>
            <Input type="text" placeholder="关键字" v-model="keywords" style="width: 200px" />
            <Select v-model="state" class="selectType" placeholder="选择订单状态" style="width:160px">
                <Option v-for="(item,index) in stateList" v-if="item.value<=4" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <date-apply placeholder="下单时间" @on-change="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>
            <Button type="primary" @click="getData">搜索</Button>
            <Button type="info" @click="expressData">导出</Button>
        </div>

        <div style="margin:10px 0">
            <Table :columns="columns" :data="list" :loading="loading"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page>

        <div slot="footer">
            <!-- <Button size="large" @click="Modal_cencel">取消</Button>
            <Button type="primary" :loading="save_loading" size="large" @click="Modal_ok" >确认</Button> -->
        </div>
    </Modal>

</template>
<script>

import dateApply from '@/views/components/date';

export default {
    props: {
        visible: {
          type: Boolean,
          default: false
        },
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    components: {
        dateApply
    },
    data() {
        return {
            isShow: this.visible,
            state: '',
            keywords: '',
            date: ['',''],
            stateList:this.$store.state.user.OrderStateList,
            loading: false,
            total: 0,
            pageSize: 8,
            pageIndex: 1,
            list: [],
            columns: [
                {
                    title: '订单编号',
                    key: 'orderNo'
                },
                {
                    title: '订单产品',
                    key: 'productInfo'
                },
                {
                    title: '订单金额',
                    key: 'orderPrice'
                },
                {
                    title: '订单状态',
                    key: 'orderStateValue'
                },{
                    title: '下单时间',
                    key: 'addTime'
                },
                {
                    title: '收货人',
                    key: 'receiveName'
                },
                {
                    title: '收货人手机号',
                    key: 'receivePhone'
                },
                {
                    title: '收货人地址',
                    key: 'receiveAddress'
                }
            ],
        }
    },
    created() {
    },
    methods: {
        getData(){
            const params = {
                MemberId: this.data.id,
                StartTime: this.date[0] || '',
                EndTime: this.date[1] || '',
                OrderState: this.state,
                KeyWords: this.keywords,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            }

            this.loading = true;

            this.$request(this.$api.UserMemberOrderList, params, data=>{
                this.total = data.result.totalCount;
                this.list = data.result.resultList;
                this.loading = false;
            })

        },
        dateChange(value){
            this.date = value;
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        expressData(){
            location.href = this.$api.UserMemberOrderList + '?' +
                            [
                                'MemberId='+this.data.id,
                                'StartTime='+(this.date[0] || ''),
                                'EndTime='+(this.date[1] || ''),
                                'OrderState='+this.state,
                                'KeyWords='+this.keywords
                            ].join('&');
        },
        Modal_cencel(){
            this.$emit('cancel');
        },
        Modal_ok(){

        }
    },
    watch: {
        visible(value) {
            this.isShow = value;

            if (value){
                this.getData();
            }else{
                this.date = ['', ''];
                this.keywords = '';
                this.state = '';
            }
        },
    }
};

</script>
