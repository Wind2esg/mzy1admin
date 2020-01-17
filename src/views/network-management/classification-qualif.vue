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
    }
</style>

<template>
    <Card class="intention-apply">

        <div class="network-change-language">
        <!--   <div v-for="list in listsEglish " :key="list.id" @click="tabsChange(list)">
              <div class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}</div>
          </div> -->

        </div>


        <div class="search">

          <div class="btn-wraper">
              <Button type="primary" @click="edit({})">新增</Button>
          </div>

        </div>
        
        <div class="table-wraper">
            <Table :columns="columns" :loading="dataLoading" :data="data" style="max-width:1650px;"></Table>
        </div>

        <Page :total="total" :page-size="pageSize" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
        
        <Modal v-model="editVisible" @on-cancel="editVisible=false">
            <Form ref="form" :label-width="60" v-if="editVisible" style="width: 90%">
                <FormItem prop="title" label="标题">
                    <Input type="text" v-model="editData.name" style="width:200px" placeholder="请输入标题"></Input>
                </FormItem>

                <FormItem prop="title" label="排序">
                    <Input type="text" v-model="editData.disPlayOrder" style="width:200px" placeholder="请输入序号"></Input>
                </FormItem>

            </Form>

            <div style="margin-left:20px;"   v-if="editVisible">
                <slider-item v-for="(item, index) in imgList" @onChanges="itemChange"  @remove="removeItem" :key="item.uid" :showDelete="index!=0" :data="item" :dataAll="imgList"></slider-item>
            </div>

            <div style="padding-left:30px;padding-top:20px;" v-if="!imgList.MainPicUrl||(imgList.MainPicUrl&&imgList.MainPicUrl.length<10)" ><Button type="dashed" icon="plus" @click="addData">添加</Button></div>


            <div slot="footer">
                <Button type="text" @click="editVisible=false">取消</Button>
                <Button type="primary" :loading="modal_loading" @click="save">保存</Button>
            </div>
        </Modal>

    </Card>
</template>

<script>

import sliderItem from './components/slider-item.vue';

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
            editData: {},
            dataLoading: false,
            superId:'',
            dataList:'',
            imgList:[],
            thisId:'',
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
                    title: '序号',
                    key: 'disPlayOrder',
                    align:'center',
                    width:200
                },
                {
                    title: '资质名称',
                    key: 'name',
                    align:'center',
                    width:250
                },
                {
                    title: '二级名称',
                    key: 'parentName',
                    align:'center',
                    width:250
                },
                {
                    title: '所属一级',
                    key: 'parentParentName',
                    align:'center',
                    width:250
                },
                {
                  title: '开启状态',
                  key: 'isDisPlay',
                  align:'center',
                  width:230,
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
                },{
                        title: '创建时间',
                        key: 'addTime',
                        align:'center',
                        width:245
                },
                {
                    title: '操作',
                    width: 220,
                    align:'center',
                    fixed:'right',
                    render: (h, Id  ) => {

                        let arr = [];

                        arr.push(h('Button', {
                            props: {
                                type:'primary'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on:{

                                click: ()=>{
                                    let palam={
                                        Id:Id.row.id

                                    }
                                    this.thisId=Id.row.id;
                                    this.$request(this.$api.GetPcCardList,palam, data=>{
                                     
                                        if (data){
                                            this.edit(data.result);
                                        }
                                    })                                    
                                }
                            }
                        }, '编辑'));

                          arr.push(h('Poptip', {
                                props: {
                                    confirm: 'confirm',
                                    title: '删除后不可恢复，确定删除？',
                                    placement: 'top-end',
                                    transfer: true
                                },
                                on:{
                                    'on-ok':()=>{
                                        this.deleteData(Id.row);
                                    }
                                }
                            },[h('Button', {
                                props: {
                                    type: 'error',
                                }
                            }, '删除')]))
                        

                        return h('div', arr);
                    }
                }
            ],
            data: []
        }
    },
    computed: {
        sliderList () {
            return this.$store.state.app.sliderType;
        }
    },
    created(){
        this.actionIndex=this.$route.query.actionIndex;
        this.getData();

    },
    methods: {
        getData(bol){
            this.superId=this.$route.query.superId;

            const params = {
                indexPage:this.pageIndex,
                Take:this.pageSize,
                ParentId:this.superId,
                IsChanese:this.actionIndex
            }
            if(this.superId){
                this.$request(this.$api.GetPcCardThreeType, params, data=>{
                    this.data = data.value;
                    this.total = data.key;
                    this.dataLoading = false;
                })
            }
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

            if (this.imgList.length >= 10){
                this.$Message.error('幻灯片最多添加10个');
                return;
            }

            const data = {
                uid: this.guid(),
                id: 0,
                MainPicUrl: '',
            }

            this.imgList.push(data);

        },

        // 改变上下架状态
        changeState(record){
            let palamer={
                Id:record.id
            }
            this.$request(this.$api.changePcCardTypeState,palamer,data=>{
                if(data.isSuccess){
                    this.$Message.success(data.message);
                }else{
                    this.$Message.error(data.message);
                }
            });
        },
        edit(record){
            this.imgList=[];
            if (record[0]){ 
                this.editData=record[0];
                this.dataList=record;

                this.dataList.map(item=>{
                    this.imgList.push({ Id: item.id,MainPicUrl:item.mainPicUrl });             
                });
                this.imgList =this.imgList.map(item=>{
                    let obj = {};
                    for (var u in item){
                        obj[u] = item[u];
                    }
                    obj.uid = this.guid();
                    
                    return obj;
                });

                 
            }else{
                this.thisId="";
                this.editData = {
                    name:'',
                    disPlayOrder:'',
                    mainPicUrl:''
                }

                 this.imgList=[];

            }
            this.editVisible = true;
            
        },
        removeItem(data){    

            this.imgList = this.imgList.filter(item=>{
                return item.uid != data.uid;
            })
            console.log(this.imgList)
            // this.imgList=list;


        },
        itemChange(data){
            this.imgList = this.imgList.map(item=>{
                if (item.uid == data.uid){
                    item = Object.assign(item, data);
                }else if (item.id && data.id && item.id == data.id){
                    item = Object.assign(item, data);
                }

                return item;
            })
        },
        save(){

            const haveImage = this.imgList

            if (this.editData.disPlayOrder == ''){
                this.$Message.error('请输入标题');
                return;
            }else if (!this.imgList.disPlayOrder==''){
                this.$Message.error('请输入排序');
                return;
            }else if (!this.imgList.length){
                this.$Message.error('请添加图片');
                return;
            }else if ( haveImage[0].MainPicUrl==''){
                this.$Message.error('图片不可为空');
                return;
            }
            const params = {
                Id: this.thisId || 0,
                Name: this.editData.name,
                DisPlayOrder:this.editData.disPlayOrder,
                ParentId:this.superId,
                MainPicUrl: this.imgList.map(item=>{
                    return {
                        Id: item.id,
                        MainPicUrl: item.MainPicUrl,
                    }
                }),
                IsChanese:this.actionIndex
            }


            this.$request(this.$api.updatePcCard, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('编辑成功');
                }else{
                    this.$Message.error(data.message);
                }
                this.getData();
                this.editVisible = false;
            }, null, ()=>{}, true)
        },
        
        deleteData(record){
            const params = {
                Id: record.id
            }

            this.$request(this.$api.DeletePcCardType, params, data=>{
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
    },
    watch:{
      
    }

};
</script>

