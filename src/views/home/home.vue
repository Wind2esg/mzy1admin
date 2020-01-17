<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row class="yen-wraper" :gutter="10">
            <Col :sm="24" :md="16">
                <Row>
                    <Col :xs="24" :sm="12" style="margin-bottom:10px;">
                        <Card :padding="0" :style="{overflow:'hidden'}">
                            <Row >
                                <Col :span="8" :style="{background:'#2d8cf0'}">
                                    <Row class="yen-left" type="flex" align="middle" justify="center" >
                                        <Icon type="social-yen" style="font-size:40px"></Icon>
                                    </Row>
                                </Col>
                                <Col :span="16" class="yen-right">
                                    <p class="price">{{result.todayRecharge}}</p>
                                    <p class="title">公司今日收款额</p>
                                    <p class="yesterday">公司昨日收款额：{{result.yestodayRecharge}}</p>
                                </Col>
                            </Row> 
                        </Card>
                    </Col>
                    <Col :xs="24" :sm="12" style="margin-bottom:10px;">
                        <Card :padding="0" :style="{overflow:'hidden'}">
                            <Row >
                                <Col :span="8" :style="{background:'#64d572'}">
                                    <Row class="yen-left" type="flex" align="middle" justify="center" >
                                        <Icon type="social-yen" style="font-size:40px"></Icon>
                                    </Row>
                                </Col>
                                <Col :span="16" class="yen-right">
                                    <p class="price">{{result.thisMonthRecharge}}</p>
                                    <p class="title">公司当月收款额</p>
                                    <p class="yesterday">公司上月收款额：{{result.lastMonthRecharge}}</p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row style="margin-bottom:10px;">
                    <Col>
                        <Card>
                            <p slot="title">公司七日收款统计图</p>
                            <service-requests v-if="data1.x" :data="data1"></service-requests>
                        </Card>
                    </Col>
                </Row>
                <Row style="margin-bottom:10px;">
                    <Col>
                        <Card>
                            <p slot="title">代理新增趋势图</p>
                            <service-requests v-if="data2.x" :data="data2"></service-requests>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col :sm="24" :md="8">
                <Row style="margin-bottom:10px;">
                    <Card :padding="0" :style="{overflow:'hidden'}">
                        <Row>
                            <Col :span="8" :style="{background:'#f25e43'}">
                                <Row class="yen-left" style="height:80px" type="flex" align="middle" justify="center" >
                                    <Icon type="social-yen" style="font-size:40px"></Icon>
                                </Row>
                            </Col>
                            <Col :span="16" class="yen-right" style="height:80px">
                                <p class="yen-title">公司累计收款 {{result.totalRecharge}}</p>
                                <p class="yen-title">公司累计出货 {{result.totalSellStock}}</p>
                            </Col>
                        </Row>
                    </Card>

                </Row>

                <Card>
                    <p slot="title">代理提货统计</p>
                    <div v-for="(item, index) in list">
                        <list-item :data="item" :index="index"></list-item>
                    </div>
                </Card>

            </Col>
        </Row>
    </div>
</template>

<script>

import serviceRequests from './components/serviceRequests.vue';
import listItem from './components/toDoListItem.vue';

export default {
    name: 'home',
    components: {
        serviceRequests, listItem
    },
    data () {
        return {
            result: {},
            list: [],
            data1: {},
            data2: {}
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){
            this.$request(this.$api.GetHomeIndexData, {}, data=>{
                this.result = data.result;
                this.list = data.result.sellStockList;

                let x=[], y=[];
                data.result.newMemberList.map(item=>{
                    x.push(item.day);
                    y.push(item.memberCount);
                })
                this.data2 = {
                    x: x,
                    y: y
                }

                let a=[], b=[];
                data.result.sevenRechargeList.map(item=>{
                    a.push(item.day);
                    b.push(item.rechargeBalance);
                })
                this.data1 = {
                    x: a,
                    y: b
                }

            })
        }
    }
};
</script>
