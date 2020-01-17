<style lang="less">
.statistics_pages{
  .selectType{
    width:140px;
    vertical-align:top;
    margin-left: 5px;
  }
  .card_title{
    overflow:visible;
    font-weight: 300;
  }
  .data-source-row{
    
  }
}


.card-box{
    display: flex;
    height: 100%;
    flex-direction: column;

    .ivu-card-body{
        flex: 1 1 auto;

        display: flex;
        flex-direction: column;
    }

    .search-box{
        flex: 0 0 auto;
    }
    .table-box{
        flex: 1 1 auto;
        overflow: auto;
        margin: 10px 0;
    }
}


</style>
<template>
  <Row  class="statistics_pages" style="height: 100%" :gutter="16">
      <Col :sm="24" :md="12" style="height: 100%">
        <Card class="card-box">
            <p slot="title">用户数据</p>

            <div class="search-box">
                <DatePicker type="daterange" :options="options" @on-change="dateChange" placeholder="选择日期" style="width: 200px"></DatePicker>
                <Button style="margin-left:80px;" type="primary" @click="expressData">导出</Button>
            </div>
            
            <div class="table-box">
                <Table ref="table" :columns="columns" border :data="data1"></Table>
            </div>

           <!--  <Page :total="total" :page-size="pageSize" @on-change="pageChange"></Page> -->

        </Card>
      </Col>
      <!-- 右边 -->
      <Col :sm="24" :md="12">
        <Row style="margin-bottom:10px;">
            <Col>
                <Card>
                    <p slot="title">新增用户七日折线图</p>
                    <service-requests v-if="data2.x" :data="data2"></service-requests>
                </Card>
            </Col>
        </Row>
        <Row style="margin-bottom:10px;">
            <Col>
                <Card>
                    <p slot="title">活跃用户七日折线图</p>
                    <service-requests v-if="data3.x" :data="data3"></service-requests>
                </Card>
            </Col>
        </Row>
      </Col>
  </Row>
  
</template>
<script>
import utils                  from '@/libs/util';

import serviceRequests from '@/views/components/serviceRequests.vue';

export default {
    components: {
        serviceRequests
    },
    created() {
        this.getData();
    },
    data() {
        return {
            startTime: '',
            endTime: '',
            data1: [],
            data2: {},
            data3: {},
            isReady: true,
            total: 0,
            pageSize: 15,
            pageIndex: 1,
            columns: [
                {
                    title: '时间',
                    key: 'time',
                    sortable: true,
                    sortType: 'desc'
                },
                {
                    title: '新增人数',
                    key: 'newUser'
                },
                {
                    title: '活跃人数',
                    key: 'activeUser'
                }
            ],
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
        }
    },
    methods: {
        getData(){

            const params = {
                StartTime: this.startTime,
                EndTime: this.endTime
            }

            this.$request(this.$api.UserInfoMonth, params, data=>{

                let x = [];
                let newUser = [];
                let activeUser = [];

                let array = [];

                data.result.map(item=>{
                    array.push({
                        time: item.dateInfo.split(' ')[0],
                        newUser: item.newUser,
                        activeUser: item.activeUser
                    })
                    x.push(item.dateInfo.split(' ')[0]);
                    newUser.push(item.newUser);
                    activeUser.push(item.activeUser);
                })

                this.data1 = array;

                if (this.isReady){

                    const title = x.length > 7 ? x.splice(x.length-7, 7) : x;
                    const user = newUser.length > 7 ? newUser.splice(newUser.length-7, 7) : newUser;
                    const active = activeUser.length > 7 ? activeUser.splice(activeUser.length-7, 7) : activeUser;

                    this.data2 = {
                        x: title,
                        y: user
                    }

                    this.data3 = {
                        x: title,
                        y: active
                    }

                    this.isReady = false;
                }
                
            })

        },
        dateChange(value){
            this.startTime = value[0] || '';
            this.endTime = value[1] || '';
            this.getData();
        },
        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        expressData(){
            this.$refs.table.exportCsv({
                filename: '用户数据'+new Date().getTime(),
                original: false
            });
        }
    
    }
};
</script>
