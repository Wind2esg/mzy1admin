<style lang="less">
    .freight-apply{
        display: flex;
        height: 100%;

        flex-direction: column;
        overflow: auto;
    }
    .freight-list{
        flex: 1;
    }
</style>

<template>
    <div class="freight-apply">

        
        <div style="padding: 20px" v-if="!visible"><Button type="primary" @click="visible=true">运费设置</Button></div>
       

        <div class="freight-list" v-if="!visible">
            <!-- <freight-nopostage style="margin-bottom:20px"></freight-nopostage> -->
            <freight-weightpostage :key="item.expressCompanyNo" style="margin-bottom:20px" v-for="item in list" :data="item"></freight-weightpostage>
            <!-- <freight-areapostage style="margin-bottom:20px"></freight-areapostage> -->
        </div>
        
        <add-freight v-if="visible" @back="editBack"  :companyList="list"></add-freight>

    </div>
</template>

<script>

import addFreight from './components/addFreight';
//import freightNopostage from './components/freight-no-postage-view';
import freightWeightpostage from './components/freight-weight-postage-view';
//import freightAreapostage from './components/freight-area-postage-view';

export default {
    name: 'freight',
    components: {
        addFreight,
        //freightNopostage,
        freightWeightpostage,
        //freightAreapostage
    },
    data () {
        return {
            visible: false,
            list: []
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){
            let that = this;
            this.$request(this.$api.ExpressTemplateList, {}, data=>{
                let list = [];
                    console.log(data,89)
                list = data.result.expressTemplates.map(item=>{
                    if(item.expressDetailInfo.length) item.expressDetailInfo = item.expressDetailInfo.map(item1=>{
                       item1.uid=that.guid();
                       return item1;
                    })
                    return item;
                });

                that.list = list;
            })

        },
        editBack(){
            this.visible = false;
        },
        guid(){
            var a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};
            return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()
        }
    },
};
</script>
