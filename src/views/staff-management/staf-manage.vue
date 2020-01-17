<template>
    <div class="staff-box">
      <div v-show="saffMain">
        <h1>员工管理</h1>
        <Input v-model="KeyWords" placeholder="搜索姓名/手机号" clearable class="inputClass"></Input>

       <Cascader :data="provinces"  v-model="areaVal" placeholder="选择区域" :render-format="format1" style="display:inline-block;width: 200px;margin-right:10px;"></Cascader>


        <DatePicker type="date" placeholder="订单完成最小时间" style="width: 200px" v-model="minDate"  @on-change="changeTime"></DatePicker>

        <DatePicker type="date" placeholder="订单完成最大时间" style="width: 200px" v-model="maxDate" class="maxDatas" @on-change="changeTime1"></DatePicker>        

        
        <Button type="primary" icon="search" @click="getStaffData" style="margin-left:20px;">搜索</Button>
        <Button type="success" @click="exportDocument_box" icon="document-text" style="margin-left:20px;">导出</Button>

        <Button type="primary" icon="search" @click="add_box" style="margin-left:20px;">添加</Button>

        <!-- 表格 -->
        <div class="table-wraper" style="max-width:1800px;margin:20px 0 0 20px;">
            <Table ref="selection" :columns="columns" :data="data" size="small" ></Table>
        </div>

        <div style="margin-top: 20px;margin-left: 20px;">
          <Page :total="total" :page-size="PageSize" @on-change="pageChange"></Page>
        </div>
    </div>


        <!-- 新增代理的弹框 -->

      <div v-show="staffBox" class="staff-bos">
            <div class="staff-title">添加员工</div>

            <span class="name-box" style="vertical-align: 7px;">姓名:</span><Input v-model="StuffName" placeholder="请输入员工姓名" clearable style="width: 250px;margin-bottom:20px;"></Input><br/>

            <span class="name-box" style="vertical-align: 7px;">手机号:</span><Input v-model="StuffPhone" placeholder="请输入员工手机号" clearable style="width: 250px;margin-bottom:20px;"></Input><br/>

           <span class="name-box">分配地区:</span><Cascader :data="provinces"  :render-format="format" v-model="areaVal1" placeholder="选择区域" style="display:inline-block;width: 200px;margin-right:10px;width: 250px;margin-bottom:20px;"></Cascader><br/>

            <span class="name-box name-box1">添加备注:</span> <textarea class="textarea" v-model="Remark"></textarea>

            <div class="buttons">
              <Button style="margin-right:25px;" @click="canselbtns">取消</Button>
               <Button type="primary" @click="surebtns">确定</Button>

            </div>


      </div>


      <!-- 查看详情的弹框 -->
        <Modal v-model="modal1" width="600">
            <div style="border-bottom:1px solid #ccc;padding-bottom:15px;">  
               <span class="sale-title">销售明细</span>
               <span>统计区间:{{minTime}}  ~<span>{{maxTime}}</span></span>
            </div>

            <div class="sale-numbers">
               <span>总销售盒数:{{stafNumber.totalOrderCount}}</span>
               <span style="margin-left:35px;">总销售业绩:{{stafNumber.totalSellMoney}}</span>
            </div>

            <!-- 表格 -->
            <Table ref="selection" :columns="columns1" :data="data1" size="small" style="margin:20px 0;"></Table>

            <div slot="footer">
                  <Button type="primary" size="large"  @click="del">关闭</Button>
            </div>

        </Modal>

      <!-- 添加备注的弹框 -->

      <Modal
        v-model="modaler"
        title="添加备注"
        @on-ok="okMark"
        @on-cancel="cancel">
        <textarea  v-model="textMark" placeholder="请添加备注" style="width:94%;padding:10px 3%;height:100px;outline:none;resize:none;border:1px solid #ccc"></textarea>
      </Modal>



   
        
    </div>

</template>


<script>

import areaData               from '@/libs/arealist.json';
    export default{

        data(){
            return{
                 namePhone:'',
                 minDate:'',
                 maxDate:'',             
                 KeyWords:'',
                 Province:'',
                 City:'',
                 Area:'',
                 PageIndex:1,
                 PageSize:10,
                 total: 0,
                 saffMain:true,
                 staffBox:false,
                 StuffPhone:'',
                 StuffName:'',
                 Province1:'',
                 City1:'',
                 Area1:'',
                 Remark:'',
                 modal1: false,
                 staffKey:'',
                 staffOrder:'',
                 AreaData: areaData,
                 areaVal:[],
                 areaVal1:[],
                 Province2:'',
                 City2:'',
                 Area2:'',
                 staffDetails:[],
                 minTime:'',
                 maxTime:'',
                 stafNumber:[],
                 modaler:false,
                 textMark:'',
                 markId:'',
                 markPhone:'',
                 markProvce:'',
                 markCity:'',
                 markArea:'',
                 markName:'',
                 allText:'',
                 nowRecord:'',
                 provinces:[],
                 columns: [
                  {
                  title: '员工ID',
                  key: 'stuffId',
                  align: 'center',
                  width: 150,
                  
                },
                {
                  title: '姓名',
                  key: 'stuffName',
                  width: 120,
                  align: 'center',
                },
                {
                  title: '手机号',
                  key: 'stuffPhone',
                  width: 150,
                  align: 'center',
                },
                {
                  title: '分配区域',
                  key: 'allocation',
                  width: 255,
                  align: 'center',
                },
               
               {
                  title: '总销量',
                  key: 'allSellCount',
                  width: 200,
                  align: 'center',
                },
          
                {
                  title: '销售金额',
                  key: 'allSellBalance',
                  width:200,
                  align: 'center',
                },
                {
                  title: '添加时间',
                  key: 'addTime',
                  width:150,
                  align: 'center'
                },

                {
                  title: '备注',
                  key: 'remark',
                  width:250,
                  align: 'center',
                  render:(row, column)=>{
                          let arr = [];

                          arr.push(row('span', {
                            props: {
                              type: 'primary',                             
                            },
                            style: {
                              marginRight:'10px'
                            },
                           }, column.row.remark))

                          arr.push(row('a', {
                            props: {
                              type: 'primary',
                            },
                            on: {
                              click: ()=>{                
                                this.addmark(column.row);                          
                              }
                            }
                          }, '添加备注'))
                          

                          return row('div', {
                            style: {
                              textAlign: "center"
                            }
                          }, arr);
                        }
                },
                {
                  title: '操作',
                  key: 'action',
                  align: 'center',
                  "fixed": "right",
                  width:200,
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
                          this.lookInfore(column.row)
                        }
                      }
                    }, '查看'))
                    

                    arr.push(row('Poptip', {
                          props: {
                              confirm: 'confirm',
                              title: '删除后不可恢复，确定删除？',
                              placement: 'top-end',
                              transfer: true
                          },
                          on:{
                              'on-ok':()=>{                       
                                  this.deletestaff(column.row);
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
            data: [],

            columns1: [
                  {
                  title: '产品ID',
                  key: 'productId',
                  align: 'center',
                  width: 150,
                  
                },
                {
                  title: '产品名称',
                  key: 'productName',
                  width: 250,
                  align: 'center',
                },
                {
                  title: '销售盒数',
                  key: 'sellCount',
                  width: 165,
                  align: 'center',
                },
              
            ],
            data1: [],

            }
        },
        created(){
        let obj={};
        let objs={};
        this.AreaData.Province.map(item=>{
     
             obj={
                 value:item.value,
                 label:item.label,
                 children:[]
              }  
              
             
              item.children.map(record=>{
                objs={
                    value:record.value,
                    label:record.label,
                    children:[]
                }         

                obj.children.push(objs)
                 
            })
            this.provinces.push(obj)
          })
         },
        beforeMount(){
          
            this.getStaffData();
        },

       methods:{


            exportDocument_box(){
              let requedata = {
                  KeyWords:this.KeyWords,
                   Province:this.Province || '',
                   City: this.City || '',
                   Area: this.Area || '',
                   StartTime: this.formatDate(this.minDate||''),
                   EndTime: this.formatDate(this.maxDate||'')
                };
                let url = this.$api.StuffManagerListExport;
                let initUrl = url
                //location.href = that.ajaxUrl
                for(let key in requedata){
                  if(requedata[key]) {
                    if(url===initUrl) url += '?'+key+'='+requedata[key]
                      else url += '&'+key+'='+requedata[key]
                  }
                }
                location.href = url
              },

              add_box(){
                  this.saffMain=false;
                  this.staffBox=true;
                  this.StuffName='';
                  this.StuffPhone='';
                  this.areaVal1=[];
                  this.Remark='';
              },

              
              getStaffData(){

                // 获取员工数据
                let params={
                   KeyWords:this.KeyWords,
                   Province:this.Province || '',
                   City: this.City || '',
                   Area: this.Area || '',
                   StartTime: this.formatDate(this.minDate||''),
                   EndTime: this.formatDate(this.maxDate||''),
                   PageIndex:this.PageIndex,
                   PageSize:this.PageSize
                }                

                this.$request(this.$api.StuffManagerList, params, data=>{
                      this.data=data.result.resultList;
                      this.total = data.result.totalCount;
                });               

                  

              },
              formatDate(date){
                if (!date) return '';

                const year = date.getFullYear();
                const month =  date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1): date.getMonth()+1;
                const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

                return [year, month, day].join('-')
              },

              pageChange(value){
                this.PageIndex = value;
                this.getStaffData();
              },              

              // 取消和保存经销商信息

              canselbtns(){
                  this.saffMain=true;
                  this.staffBox=false;
              },
              surebtns(){                 

                  if(this.StuffName==''){
                      this.$Message.error('请输入姓名');
                      return false;
                  }else if(this.StuffPhone==''){
                      this.$Message.error('请输入电话');
                      return false;
                  }else if(this.areaVal1==''){
                      this.$Message.error('请选择区域');
                      return false;
                  }else if(this.Remark==''){
                      this.$Message.error('请填写备注');
                      return false;
                  }
             

                    this.saffMain=true;
                    this.staffBox=false;

                    // 新增员工
                     let addStaff={
                         StuffName:this.StuffName,
                         StuffPhone:this.StuffPhone,
                         Province:this.Province2 || '',
                         City: this.City2 || '',
                         Area: this.Area2 || '',
                         Remark:this.Remark,

                     }

                  this.$request(this.$api.StuffInit, addStaff, data=>{
                    console.log(data)
                        if (data.isSuccess){
                             this.$Message.success('新增成功!');
                             this.getStaffData();
                          }else{
                              this.$Message.error(data.message);
                          }
                  });


              },

              // 查看详情

              lookInfore(records){
                this.modal1=true;
                // 员工业绩明细

                let DetailsList={
                  StuffId:records.stuffId,
                  StartTime:this.formatDate(this.minDate||''),
                  EndTime:this.formatDate(this.maxDate||''),
                  PageIndex:1,
                  PageSize:10,
                }
               
                this.$request(this.$api.StuffManagerDetailsList, DetailsList, data=>{
                  this.data1=data.result.resultList;
                  this.stafNumber=data.result;
                });

              },

               // 删除

               deletestaff(recod){
                console.log(recod)
                this.$request(this.$api.StuffDelete, {StuffId:recod.stuffId}, data => {
                if (data.isSuccess){
                    this.$Message.success('删除成功!');
                    this.getStaffData();
                 }else{
                    this.$Message.error(data.message);
                    }
                 })
                },

                format (labels, selectedData) {

                  this.Province2=labels[0];
                  this.City2=labels[1];
                  this.Area2=labels[2] || '';
                   return labels.join('/');
               },

               format1 (labels, selectedData) {

                  this.Province=labels[0];
                  this.City=labels[1];
                  this.Area=labels[2] || '';
                   return labels.join('/');
               },

               // 日期的改变
               changeTime(){
                  this.minTime=this.formatDate(this.minDate||'');
               },
               changeTime1(){
                  this.maxTime=this.formatDate(this.maxDate||'');
               },

               // 关闭弹框
              del () {
                this.modal1=false;
              },

              // 添加备注

              addmark(records){
                this.modaler=true;
                this.textMark='';
                this.markId=records.stuffId;
                this.markPhone=records.stuffPhone;
                this.markArea=records.area;
                this.markProvce=records.province;
                this.markCity=records.city;
                this.markName=records.stuffName;
                this.textMark='';
                this.nowRecord=records.remark

              },

              okMark(records){
               
                this.modaler=false;
                if(this.textMark==''){
                    this.$Message.error('请输入备注');
                    return false;
                }
                     this.allText=this.textMark+','+this.nowRecord;
                     let addStaff={                        
                        StuffId:this.markId,
                        StuffName:this.markName,
                        StuffPhone:this.markPhone,
                        Province:this.markProvce || '',
                        City: this.markCity ||'',
                        Area: this.markArea || '',
                        Remark:this.allText,

                     }

                  this.$request(this.$api.StuffInit, addStaff, data=>{
                    console.log(data)
                        if (data.isSuccess){
                             this.$Message.success('添加成功!');
                             this.getStaffData();
                          }else{
                              this.$Message.error(data.message);
                          }
                  });


         
              },

              cancel(){
                this.modaler=false;
              },


        },

    }
</script>

<style lang='less' scoped>
    .staff-box{
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
      .inputClass{
        width:200px;
        margin:20px;
      }

      .maxDatas{
         margin:0 20px;
      }
    }

    .staff-bos{
      width:800px;
      margin:100px auto;
      border:1px solid #ccc;
      border-radius:5px;
      padding:10px  0 20px;
      .staff-title{
        text-align:center;
        font-size:20px;
        padding:15px 0 25px;
        color:#333;
      }

      .name-box{
        margin-left:20px;
        display:inline-block;
        width:65px;
        height:32px;
        line-height:32px;
      }
      .name-box1{
        vertical-align:top;
      }
      .textarea{
        width:240px;
        resize:none;
        height:150px;
        border:1px solid #ccc;
        border-radius:5px;
        padding:10px;
      }

      .buttons{
          text-align:right;
          padding-right:30px;
      }
    }

    .sale-title{
      font-size:20px;
      padding:10px 20px 10px  10px;
    }

    .sale-numbers{
      padding:20px 0;
      span{
        font-size:16px;
      }
    }
    
    
</style>