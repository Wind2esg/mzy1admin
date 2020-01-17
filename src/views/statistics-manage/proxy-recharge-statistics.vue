<template>
    <div class="staff-box">
        <h1>代理充值统计</h1>

        <Input v-model="KeyWords" placeholder="搜索姓名/手机" clearable class="inputClass"></Input>

   <!--      <Select v-model="model1" style="width:200px;margin-right:20px;" :placeholder="titles">
             <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
 -->

        <Select v-model="model1"  placeholder="选择代理等级" style="width:200px;margin-right:20px;">
          <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
        </Select>

        <Select  v-model="model2"  style="width:150px;margin-right:20px;" placeholder="请选择收款类型" >
            <Option :value="1">在线充值</Option>
            <Option :value="5">升级充值</Option>
            <Option :value="4">授权充值</Option>
        </Select>



        <DatePicker type="date" placeholder="申请时间(最小时间)" style="width: 200px" v-model="minDate"  @on-change="changeTime"></DatePicker>

        <DatePicker type="date" placeholder="申请时间(最大时间)" style="width: 200px" v-model="maxDate" class="maxDatas" @on-change="changeTime1"></DatePicker>        

        
        <Button type="primary" icon="search" @click="getStaffData" style="margin-left:20px;">搜索</Button>
        <Button type="success" @click="exportDocument_box" icon="document-text" style="margin-left:20px;">导出</Button>


        <!-- 表格 -->
        <div class="table-wraper" style="max-width:1800px;margin:20px 0 0 20px;">
            <Table ref="selection" :columns="columns"  :data="data" size="small" ></Table>
        </div>

        <div style="margin-top: 20px;margin-left: 20px;">
          <Page :total="total" :page-size="PageSize" @on-change="pageChange"></Page>
        </div>


        <!-- 查看详细资料的弹框 -->

        <Modal v-model="modal1" :width="790">
            
            <div class="angey-titile">代理资料</div>

            <div class="img-box">
                <div>身份证截图</div>

                <div class="jie-picture">
                  <img :src="imghost+memberDaetails.cardUrl" v-if="memberDaetails.cardUrl">
                </div>

            </div>

            <div class="agent-information">

              <span>姓名: {{memberDaetails.name}}</span>
              <span>电话: {{memberDaetails.phone}}</span>
              <span>微信昵称: {{memberDaetails.nickName}}</span><br/>
              <span>身份证: {{memberDaetails.idCard}}</span>
              <span>授权等级: {{memberDaetails.roleName}}</span><br/>
              <span>上级: {{memberDaetails.superName}} <i v-if="memberDaetails.superRoleName" style=" font-style:normal"> [{{memberDaetails.superRoleName}}]</i></span>
              <span>推荐人:{{memberDaetails.recommandName}} <i v-if="memberDaetails.recommandRoleName" style=" font-style:normal" >[{{memberDaetails.recommandRoleName}}]</i></span><br/>
              <span>上级手机: {{memberDaetails.superPhone}}</span>
              <span>推荐人手机: {{memberDaetails.recommandPhone}}</span><br/>
              <span>授权地址: {{memberDaetails.authAddress}}</span>
              <span>详细地址: {{memberDaetails.authDetailAddress}}</span>
              
            </div>

            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  @click="del">关闭</Button>
            </div>

        </Modal>



        <!-- 他的充值记录的弹框 -->

        <Modal v-model="modal12" :width="1055">
            
            <div class="angey-titile">他的充值记录</div>

            <!-- 表格 -->
            <Table :columns="columns2" :data="data2"></Table>

            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  @click="del2">关闭</Button>
            </div>

        </Modal>




   
        
    </div>

</template>


<script>
    import utils            from '@/libs/util';


    export default{

       created() {

          utils.getRoleList(this,data => {
            this.RoleList  = data
          })
        },
        data(){
            return{
                 minDate:'',
                 maxDate:'',             
                 KeyWords:'',
                 PageIndex:1,
                 PageSize:10,
                 total: 0,
                 minTime:'',
                 maxTime:'',
                 model1:'',
                 model2:'',
                 OrderByParam:'',
                 IsAsc:'',
                 titles:'请选择产品种类',
                 allNumber:'',
                 modal1:false,
                 modal12:false,
                 memberDaetails:[],
                 RoleList:[],
                 columns: [
                  {
                  title: 'ID',
                  key: 'memberId',
                  align: 'center',
                  width: 150,
                  
                },
                {
                  title: '姓名',
                  key: 'name',
                  width: 175,
                  align: 'center',
                },
                {
                  title: '手机号',
                  key: 'phone',
                  width: 200,
                  align: 'center',
                },
                {
                  title: '代理等级',
                  key: 'roleName',
                  width: 200,
                  align: 'center',
                },
               
               {
                  title: '收款类型',
                  key: 'recordTypeValue',
                  width: 200,
                  align: 'center',
                },
          
                {
                  title: '充值金额',
                  key: 'rechargeBalance',
                  width:200,
                  align: 'center',
                },
                {
                  title: '充值时间',
                  key: 'addTime',
                  width:250,
                  align: 'center'
                },
                {
                  title: '操作',
                  key: 'productStock',
                  width:300,
                  align: 'center',
                  fixed: 'right',
                  render:(row, column)=>{
                    let arr = [];

                    arr.push(row('Button', {
                      props: {
                        type: 'primary',
                      },
                      style: {
                        marginRight: '10px',
                        marginLeft: '5px',
                      },
                      on: {
                        click: ()=>{                
                          this.lookrecord(column.row)
                        }
                      }
                    }, '他的充值记录'))

                    arr.push(row('Button', {
                      props: {
                        type: 'primary',
                      },
                      style: {
                        marginRight: '10px',
                        marginLeft: '5px',
                      },
                      on: {
                        click: ()=>{                
                          this.lookdetalis(column.row)
                        }
                      }
                    }, '查看详细资料'))
                    



                    return row('div', {
                      style: {
                        textAlign: "center"
                      }
                    }, arr);

                  }

                },

            ],
            data: [],

            columns2: [
                  {
                  title: 'ID',
                  key: 'memberId',
                  align: 'center',
                  width: 120,
                  
                },
                {
                  title: '姓名',
                  key: 'name',
                  width: 150,
                  align: 'center',
                },
                {
                  title: '手机号',
                  key: 'phone',
                  width: 150,
                  align: 'center',
                },
                {
                  title: '代理等级',
                  key: 'roleName',
                  width: 100,
                  align: 'center',
                },
               
               {
                  title: '收款类型',
                  key: 'recordTypeValue',
                  width: 100,
                  align: 'center',
                },
          
                {
                  title: '充值金额',
                  key: 'rechargeBalance',
                  width:200,
                  align: 'center',
                },
                {
                  title: '充值时间',
                  key: 'addTime',
                  width:200,
                  align: 'center'
                },


            ],
            data2: [],

               
            }
        },
        beforeMount(){
          
            this.getStaffData();
        },

       methods:{


            exportDocument_box(){
               let requedata={
                   KeyWords:this.KeyWords,
                   ProductType:this.model1 || '',
                   RecordType:this.model2 || '',
                   StartTime: this.formatDate(this.minDate||''),
                   EndTime: this.formatDate(this.maxDate||''),
                }
                let url = this.$api.MemberRechargeRecordListExport;
                let initUrl = url
                //location.href = that.ajaxUrl
                for(let key in requedata){
                  if(requedata[key]) {
                    if(url===initUrl) url += '?'+key+'='+requedata[key]
                      else url += '&'+key+'='+requedata[key]
                  }
                }
                //console.log(url);
                location.href = url
              },


              
              getStaffData(){
                // 获取数据
                let params={ 
                  KeyWords:this.KeyWords || '',
                  RoleId:this.model1 || '',
                  RecordType:this.model2 || '',
                  StartTime: this.formatDate(this.minDate||''),
                  EndTime: this.formatDate(this.maxDate||''),
                  PageIndex:this.PageIndex,
                  PageSize:this.PageSize,
                }   
           

                this.$request(this.$api.MemberRechargeRecordList , params, data=>{
                     this.data=data.result.resultList;  
                     this.total=data.result.totalCount;                 
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

                // 他的充值记录
                lookrecord(record){
                  this.modal12=true;

                    let params={ 
                       KeyWords:record.phone || '',
                       RoleId: '',
                       RecordType:'',
                       StartTime:'',
                       EndTime:'',
                     }                

                     this.$request(this.$api.MemberRechargeRecordList , params, data=>{
                          this.data2=data.result.resultList;
                          
                     });                 
                },

                 // 查看详细资料

                 lookdetalis(details){

                   this.modal1=true;

                   let member={                   
                       MemberId:details.memberId
                    }                

                    this.$request(this.$api.MemberInfoDetails , member, data=>{
                      console.log('MemberInfoDetails',data)
                         this.memberDaetails=data.result;                        
                    });   



                 },

                 // 关闭信息的弹框
                 del(){
                    this.modal1=false;
                 },

                 del2(){
                    this.modal12=false;
                 },




               // 日期的改变
               changeTime(){
                  this.minTime=this.formatDate(this.minDate||'');
               },
               changeTime1(){
                  this.maxTime=this.formatDate(this.maxDate||'');
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

    .all-number{
      margin-left:20px;
      font-size:16px;
      span{
        margin-right:15px;
      }
    }

    .angey-titile{
      padding:10px 0;
      border-bottom:1px solid #ccc;
      color:#333;
      font-size:16px;
    }

    .img-box{
      width:100%;
      padding:15px 0;
      border-bottom:1px solid #ccc;
      text-align:center;
      .jie-picture{
        width:150px;
         height:150px;
         margin:15px auto;
         img{
         width:150px;
         height:150px;
         border:1px solid #ccc;

        }
      }
      
    }

    .agent-information{
        width:100%;
        padding:15px 0 0;
        span{
           font-size:14px;
           color:#333;
           display:inline-block;
           width:250px;
           margin-bottom:5px;
        }
      }


    
    
</style>