<template>
    <div class="networkhead">
      
        <div class="network-change-language">
            <div style="font-size:20px">加盟管理</div>
        <!--     <span v-for="list in listEnglish " :key="list.id" @click="tabsChange(list)" class="change-tab" :class="{'change-tab-action':actionIndex==list.id}">{{list.value}}
            </span> -->

        </div>

        <!--  搜索 -->
        <Input v-model="Keywords" placeholder="电话/姓名" clearable style="width: 200px;margin: 0 20px;"></Input>

        <Select v-model="model1" style="width:200px;margin-right:15px;" placeholder="未处理" clearable>
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Select v-model="model3" style="width:200px" clearable>
            <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Button type="primary" style="margin-left:15px;"  @click="foundFun">搜索</Button>

        <!-- 表格 -->
        <Table :columns="columns1" border :data="data1" style="margin:20px;max-width:1653px;"></Table>

        <!-- 分页 -->

        <div style="margin-top: 20px;margin-left: 20px;">
          <Page :total="total" :page-size="PageSize" @on-change="pageChange" :current="pageIndex"></Page>
        </div>


        <!-- 查看信息的弹框 -->

        <Modal
            v-model="modal2" width="800">
            <div class="information-one">
                <h1>基本资料</h1>
                <span  class="sexs">姓名:{{detailsList.applyName}}</span>
                <span>性别:{{detailsList.gender}}</span><br/>
                <span class="sexs">出生年月:{{detailsList.birthDay}}</span>
                <span >品牌加盟起止日期:{{detailsList.brandStartTime}}~{{detailsList.brandEndTime}}</span><br/>
                <span  class="sexs">代理级别:{{detailsList.roleName}}</span>
                <span>所属上家:{{detailsList.superName}}</span><br/>
                <span class="sexs">所属执行董事:{{detailsList.regionName}}</span>
                <span >最高学历:{{detailsList.education}}</span><br/>
                <span class="sexs">邮箱:{{detailsList.email}}</span>
                <span>手机号:{{detailsList.phone}}</span><br/>
                <span class="sexs">微信号:{{detailsList.weiXin}}</span>
                <span >身份证号:{{detailsList.cardId}}</span><br/>
                <span>联系地址:{{detailsList.province}}{{detailsList.addRess}}</span>
            </div>

            <div class="information-one">
                <h1>渠道销售经验</h1>
                <div>是否有店铺管理经验:{{detailsList.isHaveBrand}}</div>
                <div>目前所经营品牌:{{detailsList.nowBrand}}</div>
            </div>

            <div class="information-one">
                 <h1>加盟详情</h1>
                 <div>申请加盟地区:{{detailsList.joinProvice+detailsList.joinAddRess}}</div>
                 <div>城市人口:{{detailsList.cityPopulation}}</div>
                 <div>消费水平:{{detailsList.consumptionLevel}}</div>
                 <div>加盟店铺类型:{{detailsList.shopType}}</div>
                 <div>有无现成店铺:{{detailsList.haveShop}}</div>
                 <div>店铺位置情况概述:{{detailsList.shopAddRessDetail}}</div>
                 <div>如无店铺请概述店铺情况及店铺规划想法:{{detailsList.shopDream}}</div>
                 <div>[店铺信息]实际使用面积:{{detailsList.realShopFloor}}</div>
                 <div>[店铺信息]所处位置:{{detailsList.shopProvince}}{{detailsList.shopAddRess}}</div>
                 <span class="moneys">可投入资金:{{detailsList.haveMoney}}</span>
                 <span class="moneys">经营方式:{{detailsList.operationMode}}</span>
                 <span class="moneys">管理方式:{{detailsList.manageWay}}</span>
            </div>

            <div class="information-one">
                <h1>店铺照片</h1>

                <span class="imgs-imgs" v-for="img in  picArry"  >
                   <img :src="imghost+img" v-if=" ! img=='' "   @click="imgsBig(img)" >
                </span>
            </div>


            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  @click="del">关闭</Button>
            </div>
        </Modal>


        <!-- 产看大图的的弹框 -->
        <Modal
        v-model="modal22"
        width="500" >
            <img :src="imgShow" style="width:100%;padding:30px 0;">
            <div slot="footer" style="text-align:center;">
                <Button  size="large"  @click="delImgs">关闭</Button>
            </div>
       </Modal>
        


    </div>
</template>

<script>
    export default{
        data(){
            return{
                Keywords:'',
                model1:'',
                modal2:false,
                model3:'',
                total:0,
                PageSize:10,
                pageIndex:1,
                detailsList:[],
                picArry:[],
                imghost:'http://img.xsmore.com/mzy',
                modal22:false,
                imgShow:'',
                listEnglish:[
                    {id:1,value:'中文版'},
                    {id:0,value:'英文版'}
                ],
                actionIndex:1,
                cityList: [
                    {
                        value: '1',
                        label: '未处理'
                    },
                    {
                        value: '2',
                        label: '已处理'
                    },
                    {
                        value: '0',
                        label: '全部'
                    }
                ],

                cityList1: [
                    {
                        value: '未拿品牌授权',
                        label: '未拿品牌授权'
                    },
                    {
                        value: '一级',
                        label: '一级'
                    },
                    {
                        value: '销售总监',
                        label: '销售总监'
                    },
                    {
                        value: '官方合作伙伴',
                        label: '官方合作伙伴'
                    },
                    {
                        value: '董事',
                        label: '董事'
                    }
                ],

                 columns1: [
                    {
                        title: '序号',
                        key: 'id',
                        width:150,
                        align: 'center',
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        width:150,
                        align: 'center',
                    },
                    {
                        title: '手机号',
                        key: 'phone',
                        width:150,
                        align: 'center',
                    },
                    {
                        title: '申请级别',
                        key: 'roleName',
                        width:200,
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'isLookVal',
                        width:150,
                        align: 'center',
                    },
                    {
                        title: '加盟地区',
                        key: 'addRess',
                        width:250,
                        align: 'center',
                    },
                    {
                        title: '申请时间',
                        key: 'addTime',
                        width:200,
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'address',
                        width:400,
                        align: 'center',
                        fixed: 'right',
                        render:(row, column)=>{
                          let arr = [];

                          arr.push(row('Button', {
                            props: {
                              type: 'primary',
                            },
                            style: {
                              marginRight: '15px',
                              marginLeft: '5px',
                            },
                            on: {
                              click: ()=>{                
                                this.lookDetails(column.row)
                              }
                            }
                          }, '查看详情'))

                           arr.push(row('Button', {
                            props: {
                              type: 'primary',
                            },
                            style: {
                              marginRight: '15px',
                              marginLeft: '5px',
                            },
                            on: {
                              click: ()=>{                
                                this.markChange(column.row)
                              }
                            }
                          }, '标记为已处理'))
                          

                          arr.push(row('Poptip', {
                                props: {
                                    confirm: 'confirm',
                                    title: '删除后不可恢复，确定删除？',
                                    placement: 'top-end',
                                    transfer: true
                                },
                                on:{
                                    'on-ok':()=>{                       
                                        this.deleteApply(column.row);
                                    }
                                }
                            },[row('Button', {
                                props: {
                                    type: 'error',
                                }
                            }, '删除')]))


                          return row('div', {
                            style: {
                              textAlign: "center"
                            }
                          }, arr);
                        }
                    }
                ],
                data1: []
            }
        },

        beforeMount(){
            this.getDatas();
        },
        methods:{

            // 获取加盟的的数据

            getDatas(){

            let datas={
                indexPage:this.pageIndex,
                Take:this.PageSize,
                Keywords:this.Keywords,
                IsLook:this.model1,
                RoleName:this.model3
            }

            this.$request(this.$api.GetShopApplyList, datas, data => {
                this.data1=data.value;
                this.total=data.key;
            })

            },

             //tab的切换
            // tabsChange(list){
            //     this.actionIndex=list.id;
            //     this.getDatas();
            // },

            lookDetails(records){

                this.modal2=true;
                let details={
                    Id:records.id,
                }

                this.$request(this.$api.GetApplyShopInfoById,details,data =>{
                    this.detailsList=data;
                    const str =data.picDetails; 
                    this.picArry=str.split(",");
                    console.log(this.detailsList,66)
                });
            },

            del(){
                this.modal2=false;
            },

            // 分页
            pageChange(value){
                this.pageIndex = value;
                this.getDatas();
            },

            // 搜索
            foundFun(){
                this.pageIndex=1;
                this.getDatas(); 
            },

            // 删除
            deleteApply(record){
                let deleData={
                    Id:record.id,
                }
                this.$request(this.$api.DeleteApplyShop,deleData,data=>{
                     if (data.isSuccess){
                        this.$Message.success('删除成功!');
                        this.getDatas();
                    }else{
                       this.$Message.error(data.message);
                    }
                });
            },

            // 店铺图片的放大
            imgsBig(img){
               this.modal22=true;
               this.imgShow=this.imghost+img;

            },
            // 确认关闭
            delImgs() {
                this.modal22=false;
            },

            // 标记为已处理
            markChange(recd){
                let changMark={
                    Id:recd.id,
                }
                this.$request(this.$api.LookApplyShop,changMark,data=>{
                    if(data.isSuccess){
                        this.$Message.success("标记成功");
                        this.getDatas();
                    }else{
                        this.$Message.error(data.message);
                    }
                })

            },


            
        },
    }
</script>

<style lang="less" scoped>
.networkhead{
    overflow-x:hidden;
    overflow-y:auto;
    height: 100%;
    background: #fff;


    h1{
        width: 100%;
        background: #f0f0f0;
        padding: 10px 0 20px;
        font-size: 20px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
        font-weight: normal;
    }
}

.network-change-language{   
      width: 100%;
      background: #f0f0f0;
      padding: 10px 0 20px;   
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
      .change-tab{
        margin-left: 45px;
      }
      .change-tab-action{
        color:blue;
      }
  }

.information-one{
    padding:10px 0;
    border-bottom:1px solid #ccc;
    font-size:16px;
    color:#333;
    .sexs{
        display:inline-block;
        width:300px;
        margin-bottom:6px;
    }
    div{
        margin-bottom:6px;
    }
    .moneys{
        width:245px;
        display:inline-block;
    }
    h1{
        font-size: 20px;
        color: #1c2438;
        margin:5px 0 15px;
        font-weight:normal;
    }
    .imgs-imgs{
        display:inline-block;
        img{
            width:150px;
            margin-right:20px;
            border:1px solid #ccc;
            margin-bottom:5px;
        }
    }
}
</style>