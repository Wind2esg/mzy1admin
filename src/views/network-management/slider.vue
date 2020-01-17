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

    .network-change-language{       
        width: 100%;
        background: #f0f0f0;
        padding: 20px 0 20px;       
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        font-size: 17px;
        line-height: 30px;
        cursor: pointer;
        margin-bottom:20px;
        .change-tab{
            margin-left:30px;
            margin-right: 15px;
        }
        .change-tab-action{
            color:blue;
        }

        h1{ 
            font-size: 20px;    
            font-weight: normal;
        }
    }
    

</style>

<template>
    <Card class="intention-apply">

        <div class="network-change-language">
          <!-- <div class="change-tab" :class="{'change-tab-action':tabAction}">中文版</div> -->

          <div v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)">
              <div class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}</div>
          </div>

        </div>

        <div class="search">
            <div class="btn-wraper">
                <Button type="primary" @click="edit({})">新增</Button>
            </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" :loading="dataLoading" :data="data" style="max-width:1400px;"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
        
        <Modal v-model="editVisible" @on-cancel="editVisible=false">
            <Form ref="form" :label-width="60" v-if="editVisible" style="width: 90%">
                <FormItem prop="title" label="标题">
                    <Input type="text" v-model="editData.title" style="width:200px" placeholder="请输入标题"></Input>
                </FormItem>
            </Form>
          <!--   <p style="color: #f84444;margin-left:20px;padding-top:10px;padding-left:10px;margin-bottom:20px;border-top:1px solid #ddd;">注：轮播图最佳适配比率为3：2</p> -->
            <div style="margin-left:20px;"  v-if="editVisible">
                <slider-item v-for="(item, index) in editData.imgUrlList" @change="itemChange" :key="item.uid" @remove="removeItem" :showDelete="index!=0" :data="item"></slider-item>
            </div>

            <div style="padding-left:30px;padding-top:20px;" v-if="!editData.imgUrlList||(editData.imgUrlList&&editData.imgUrlList.length<8)"><Button type="dashed" icon="plus" @click="addData">添加</Button></div>

            <div slot="footer">
                <Button type="text" @click="editVisible=false">取消</Button>
                <Button type="primary" :loading="modal_loading" @click="save">保存</Button>
            </div>
        </Modal>

    </Card>
</template>

<script>

import sliderItem from './components/banner-item.vue';

export default {
    name: 'slider-manage',
    components: {
        sliderItem
    },
    data () {
        return {
            editVisible: false,
            total: 100,
            pageSize: 15,
            pageIndex: 1,
            modal_loading: false,
            slideType: '1',
            editData:{},
            dataLoading: false,
            listsEglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
            actionIndex:1,
            rule: {
                title: [
                    { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: 'Please fill in the password.', trigger: 'blur' }
                ]
            },
            columns: [
                {
                    title: '标题',
                    key: 'title',
                    align:'center',
                    width:250,
                },
                {
                    title: '图片数量',
                    key: 'picCount',
                    align:'center',
                    width:250
                },
                {
                    title: '创建时间',
                    key: 'addTime',
                    align:'center',
                    width:295,
                },
                {
                    title: '是否开启',
                    align:'center',
                    width:250,
                    render: (h, params) => {
                          return h('div', [
                              h('i-switch', {
                                  props:{
                                      'value': params.row.isDisPlay
                                  },
                                  on:{
                                      'on-change':()=>{
                                          this.changeState(params.row);
                                      }
                                  }
                              })
                          ])
                        }
                },
                {
                    title: ' 操作',
                    align:'center',
                    width:350,
                    fixed:'right',
                    render: (h, params) => {

                        let arr = [];

                        arr.push(h('Button', {
                            props: {
                                type:'primary'
                            },
                            style: {
                                marginRight: '10px'
                            },
                            on:{
                                click: ()=>{
                                    
                                    this.$request(this.$api.TurnPicGet, {Id:params.row.id}, data=>{
                                         console.log(data)
                                        // if (data.isSuccess){
                                            this.edit(data.result || '');
                                        // }
                                    })

                                    
                                }
                            }
                        }, '编辑'));
                      
                        if (!params.row.isDisPlay){
                            arr.push(h('Poptip', {
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
                            }, '删除')]))
                        }

                        return h('div', arr);
                    }
                }
            ],
            data: [],
        }
    },
    computed: {
        sliderList () {
            return this.$store.state.app.sliderType;
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(bol){

            const params = {
                indexPage: this.pageIndex,
                Take: this.pageSize,
                IsChanese:this.actionIndex
            }            

            if (!bol){
                this.dataLoading = true;
            }

        

            this.$request(this.$api.TurnPicList, params, data=>{      
                this.data=data.result.resultList;
                this.total=data.totalCount;
                this.dataLoading = false;
            })
        },

        //tab的切换
        tabsChange(list){
            this.actionIndex=list.id;
            this.pageIndex=1;
            this.getData();
        },

        pageChange(value){
            this.pageIndex = value;
            this.getData();
        },
        pageSizeChange(value){
            this.pageSize = value;
            this.getData();
        },
        typeChange(){
            this.getData();
        },
        addData(){

            if (this.editData.imgUrlList.length >= 8){
                this.$Message.error('幻灯片最多添加8个');
                return false;
            }

            const data = {
                uid: this.guid(),
                id: 0,
                carouselImgId: 0,
                imgUrl: ''
            }

            console.log(this.editData)
            this.editData.imgUrlList.push(data);

        },
        edit(record){
            if (record.id){                       
                this.editData = record;
                this.editData.imgUrlList = this.editData.imgUrlList.map(item=>{
                    let obj = {};
                    for (var u in item){
                        obj[u] = item[u];
                    }
                    obj.uid = this.guid();
                    
                    return obj;
                })

            }else{
                this.editData = {
                    title: '',
                    type: '',
                    imgUrlList: []
                }

            }
            
            this.editVisible = true;
        },
        removeItem(data){
            const list = this.editData.imgUrlList.filter(item=>{
                return item.uid != data.uid;
            })
            
            this.editData.imgUrlList = list
        },
        itemChange(data){
            this.editData.imgUrlList = this.editData.imgUrlList.map(item=>{
                if (item.uid == data.uid){
                    item = Object.assign(item, data);
                }else if (item.id && data.id && item.id == data.id){
                    item = Object.assign(item, data);
                }
                return item;
            })
        },
        save(){

            const haveImage = this.editData.imgUrlList.filter(item=>{
                return item.imgUrl == '';
            })

            

            if (this.editData.title == ''){
                this.$Message.error('请输入标题');
                return;
            }else if (!this.editData.imgUrlList.length){
                this.$Message.error('请添加图片');
                return;
            }else if (haveImage.length){
                this.$Message.error('图片不可为空');
                return;
            }
            const params = {

                Id: this.editData.id || 0,
                Title: this.editData.title,
                IsDisPlay:this.editData.isDisPlay || false,
                ImgUrlList: this.editData.imgUrlList.map(item=>{
                    return {
                        Id: item.id,
                        PcTurnPicId: item.carouselImgId,
                        ImgUrl: item.imgUrl,
                    }
                }),
                IsChanese:this.actionIndex
            }
            

            this.$request(this.$api.updateTurnPic, params, data=>{
                if (data.isSuccess){
                    this.$Message.success(data.message);
                }else{
                    this.$Message.error(data.message);
                }
                this.getData();
                this.editVisible = false;
            }, null, ()=>{}, true)
            console.log(this.editData.imgUrlList);
        },

        // 改变上下架状态
        changeState(record){
            let plama={
                Id:record.id
            }
            this.$request(this.$api.changeTurnPicState, plama, data=>{
                if (data.isSuccess){
                    this.$Message.success(data.message);
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }

            })
        },

        // 删除图片
        deleteData(record){
            const params = {
                Id: record.id
            }

            this.$request(this.$api.DeleteTurnPicState, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('删除成功！');
                    this.getData();
                }else{
                    this.$Message.error(data.message);
                }
            })

        },
        getUID(){
            return new Date().getTime()
        },
        guid(){
            var a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};
            return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()
        }
    }
};
</script>
