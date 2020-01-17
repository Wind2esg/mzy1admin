<template>
    <div class="staff-box">
        <h1>产品出货统计</h1>

        <Input v-model="KeyWords" placeholder="搜索产品名称" clearable class="inputClass"></Input>

     <!--    <Select v-model="model1" style="width:200px;margin-right:20px;" :placeholder="titles">
             <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->

        <Select  v-model="model1"  style="width:200px;margin-right:20px;" placeholder="产品种类">
            <Option :value="1">普通产品</Option>
            <Option :value="2">礼包产品</Option>
        </Select>



        <DatePicker type="date" placeholder="申请时间(最小时间)" style="width: 200px" v-model="minDate"  @on-change="changeTime"></DatePicker>

        <DatePicker type="date" placeholder="申请时间(最大时间)" style="width: 200px" v-model="maxDate" class="maxDatas" @on-change="changeTime1"></DatePicker>        

        
        <Button type="primary" icon="search" @click="getStaffData" style="margin-left:20px;">搜索</Button>
        <Button type="success" @click="exportDocument_box" icon="document-text" style="margin-left:20px;">导出</Button>


        <!-- 累计出货数量 -->

        <div class="all-number">
            <span>累计成交量:{{allNumber.totalDealCount}}</span>
            <span>累计下单量:{{allNumber.totalOrderCount}}</span>
            <!-- <span>累计退款量:{{allNumber.totalRefundCount}}</span> -->
        </div>


        <!-- 表格 -->
        <div class="table-wraper" style="margin:20px 0 0 20px;">
            <Table ref="selection" :columns="columns" border  :data="data" size="small" @on-sort-change='sortOrder'  ></Table>
        </div>

        <div style="margin-top: 20px;margin-left: 20px;">
          <Page :total="total" :page-size="PageSize" @on-change="pageChange"></Page>
        </div>



   
        
    </div>

</template>


<script>


    export default{

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
                 OrderByParam:'',
                 IsAsc:'',
                 titles:'请选择产品种类',
                 allNumber:'',

                 columns: [
                  {
                  title: '产品ID',
                  key: 'productId',
                  align: 'center',
                  
                },
                {
                  title: '产品名称',
                  key: 'productName',
                  align: 'center',
                },
                {
                  title: '所属种类',
                  key: 'productTypeValue',
                  align: 'center',
                },
                {
                  title: '成交盒数',
                  key: 'dealCount',
                  align: 'center',
                  sortable: true,
                },
               
               {
                  title: '下单盒数',
                  key: 'orderCount',
                  align: 'center',
                  sortable: true,
                },
          
                // {
                //   title: '退款盒数',
                //   key: 'refundCount',
                //   width:250,
                //   align: 'center',
                //   sortable: true,
                // },
                {
                  title: '产品可销库存',
                  key: 'productStock',
                  align: 'center'
                },

            ],
            data: [],

               
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
                   StartTime: this.formatDate(this.minDate||''),
                   EndTime: this.formatDate(this.maxDate||''),
                   OrderByParam:this.OrderByParam || '',
                   IsAsc:this.IsAsc || '',
                }
                let url = this.$api.ProduceShipmentStatisticsExport;
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


              
              getStaffData(){
                // 获取产品数据
                let params={
                   KeyWords:this.KeyWords,
                   ProductType:this.model1 || '',
                   StartTime: this.formatDate(this.minDate||''),
                   EndTime: this.formatDate(this.maxDate||''),
                   OrderByParam:this.OrderByParam || '',
                   IsAsc:this.IsAsc || '',
                   PageIndex:this.PageIndex,
                   PageSize:this.PageSize
                }                

                this.$request(this.$api.ProduceShipmentStatistics , params, data=>{
                     this.data=data.result.resultList;
                     this.allNumber=data.result;
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


              //排序

                sortOrder(event){
            
                  this.OrderByParam=event.column.key;
                   if(event.order=="asc"){
                     this.IsAsc=1;
                   }else{
                     this.IsAsc=0;
                   }

                   this.getStaffData();
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


    
    
</style>