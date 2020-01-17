<template>
    <div>
        <Table :columns="columns" :data="data" border></Table>
        <Button type="dashed" icon="plus-round" style="margin-top:20px;" @click="addArea">添加配送区域</Button>

        <Modal v-model="areaVisible" title="选择配送区域" width="360" @on-cancel="areaVisible=false">
            
            <div style="max-height: 500px;overflow:auto">
                <CheckboxGroup v-model="area" size="large">
                    <Checkbox :label="item.id" :key="item.uid" v-for="item in areaList" style="display:block; margin-bottom:10px"><span>{{item.name}}</span></Checkbox>
                </CheckboxGroup>
            </div>

            <div slot="footer">
                <Button type="primary" @click="areaSure">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    props:{
        list: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data () {
        return {
            areaVisible: false,
            areaList: this.$store.state.app.areaList,
            area: [],
            editData: {},
            columns: [
                {
                    title: '配送区域',
                    key: 'areas',
                    render: (h, params) => {

                        let arr = [];
                        if (params.row.areas.indexOf('全国统一运费') > -1){
                            arr = params.row.areas.map(item=>{
                                return h('Tag', {
                                        props: {
                                            color: 'green'
                                        }
                                    }, item)
                            })
                        }else{
                           
                            arr = params.row.areas.map((item, index)=>{
                                return h('Tag', {
                                        props: {
                                            color: 'green',
                                            closable: true
                                        },
                                        on:{
                                            'on-close': ()=>{
                                               
                                                this.deleteTag(params.row, item, index)
                                            }
                                        }
                                    }, item)
                            })

                            arr.push(h('Button', {
                                props: {
                                    type: 'dashed',
                                    icon: "ios-plus-empty",
                                    size: 'small'
                                },
                                on: {
                                    click: ()=>{
                                        this.addEditArea(params.row);
                                    }
                                }
                            }, '添加区域'))
                        }
                        

                        return h('div', {
                            style: {
                                padding: '5px 0'
                            }
                        }, arr);
                    }
                },
                {
                    title: '首重（克）',
                    width: 120,
                    key: 'firstHeavy',
                    render: (h, params) => {
                        return h('div',[
                            h('InputNumber', {
                                props:{
                                    'value': params.row.firstHeavy,
                                    min:0
                                },
                                on: {
                                    'on-blur': (value)=>{
                                        this.data.map(item=>{
                                            if (item.uid == params.row.uid){
                                                item.firstHeavy = +event.target.value
                                            }
                                            return item;
                                        })
                                        this.reload();
                                    }
                                }
                            })
                        ])
                    }
                },
                {
                    title: '首费（元）',
                    width: 120,
                    key: 'firstPrice',
                    render: (h, params) => {
                        return h('div',[
                            h('InputNumber', {
                                props:{
                                    'value': params.row.firstPrice,
                                    min:0
                                },
                                on: {
                                    'on-blur': (value)=>{
                                        this.data.map(item=>{
                                            if (item.uid == params.row.uid){
                                                item.firstPrice = +event.target.value
                                            }
                                            return item;
                                        })
                                        this.reload();
                                    }
                                }
                            })
                        ])
                    }
                },
                {
                    title: '续重（克）',
                    width: 120,
                    key: 'followHeavy',
                    render: (h, params) => {
                        return h('div',[
                            h('InputNumber', {
                                props:{
                                    'value': params.row.followHeavy,
                                    min:0
                                },
                                on: {
                                    'on-blur': (value)=>{
                                        this.data.map(item=>{
                                            if (item.uid == params.row.uid){
                                                item.followHeavy = +event.target.value
                                            }
                                            return item;
                                        })
                                        this.reload();
                                    }
                                }
                            })
                        ])
                    }
                },
                {
                    title: '续重（元）',
                    width: 120,
                    key: 'followPrice',
                    render: (h, params) => {
                        return h('div',[
                            h('InputNumber', {
                                props:{
                                    'value': params.row.followPrice,
                                    min:0
                                },
                                on: {
                                    'on-blur': (value)=>{
                                        this.data.map(item=>{
                                            if (item.uid == params.row.uid){
                                                item.followPrice = +event.target.value
                                            }
                                            return item;
                                        })
                                        this.reload();
                                    }
                                }
                            })
                        ])
                    }
                },
                {
                    title: '指定条件包邮（选填）',
                    key: 'freeHevy',
                    render: (h, params)=>{
                        return h('div', [
                            h('span', '重量'),
                            h('InputNumber', {
                                props:{
                                    'value': params.row.freeHevy,
                                    min:0
                                },
                                style: {
                                    width: '50px',
                                    margin: '0 5px'
                                },
                                on: {
                                    'on-blur': (value)=>{
                                        this.data.map(item=>{
                                            if (item.uid == params.row.uid){
                                                item.freeHevy = +event.target.value
                                            }
                                            return item;
                                        })
                                        this.reload();
                                    }
                                }
                            }),
                            h('span', '克（含）以内包邮')
                        ])
                    }
                }
            ],
            data: []
        }
    },
    methods: {
        addArea(){
            this.areaVisible = true;
            this.area = [];
            this.editData = {};

            this.reload();
        },
        areaSure(){
            let areas = [];
            this.area.map(item=>{

                this.areaList.map(record=>{
                    if (item == record.id){
                        areas.push(record.name);
                    }
                })
            })

           

            if (this.editData.uid){

                this.data.map(item=>{

                    if (item.uid == this.editData.uid){
                        item.areas = areas;
                        item.areaIds = this.area;
                    }
                    return item;
                })

            }else{

                this.data.push({
                    uid: this.guid(),
                    areas: areas,
                    areaIds: this.area,
                    firstHeavy: 0,
                    firstPrice: 0,
                    followHeavy: 0,
                    followPrice: 0,
                    freeHevy: 0, 
                })

            }

            this.areaVisible = false;

            this.reload();
            
        },
        deleteTag(record, name, index){            

            this.data.map((item,index)=>{
               
                if(item.uid == record.uid && item.areas.length==1){
                     this.data.splice(index, 1);
                }
                return this.data
            });
            
           console.log(this.data)

            this.data.map(item=>{ 
                if (item.uid == record.uid){
                    item.areas.splice(index, 1);
                    item.areaIds.splice(index, 1);
                }
                return item;
            })

            this.reload();
        },
        addEditArea(record){
            this.area = record.areaIds;
            this.areaVisible = true;
            this.editData = record;
            this.reload();
        },
        reload(){
            this.$emit('reloadData', this.data);
        },
        guid(){
            var a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};
            return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()
        }
    },
    mounted () {
        this.data = this.list.expressDetailInfo;
        if (!this.data.length){
            this.data.push({
                uid: this.guid(),
                areas:['全国统一运费'],
                areaIds: [-1],
                firstHeavy: 0,
                firstPrice: 0,
                followHeavy: 0,
                followPrice: 0,
                freeHevy: 0, 
            })
        }
    }
}
</script>

<style lang="less">
    
</style>
