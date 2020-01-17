<style lang="less">
.btn-wraper {
  display: inline-block;
  width: 290px;
  vertical-align: top;
}

.intention-apply {
  height: 100%;
  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .table-wraper {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.ivu-table .demo-table-info-row td {
  background-color: #fafbfc;
}
.agent_information{
  .selectType{
    width:140px;
    vertical-align:top;
    margin-right: 12px;
  }
}
.manage_box{
  height: 100%;
  display: flex;
  flex-direction: column;

  .search{
    flex: 0 0 auto;
  }
  .table-wraper{
    flex: 1 1 auto;
    height: 100%;
    overflow: auto;
  }
  .page-wraper{
    flex: 0 0 auto;
  }
}
</style>
<template>
  <Card class="agent_information intention-apply">
    <div class="manage_box">
      <div class="search">
        <Input v-model="keywords" placeholder="姓名、电话" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
        <!-- <select-type class="selectType" :typeList="ApplyStateList" @selectChange="ApplyState_Change"></select-type> -->
        <Select v-model="RoleVal" class="selectType" placeholder="选择代理等级" clearable>
          <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
        </Select>
        <date-apply  placeholder="申请时间" @dateChange="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="search_click">搜索</Button>
          <Button type="success" @click="exportDocument_click" icon="document-text">导出</Button>
        </div>
      </div>
      <div class="table-wraper">
        <Table :loading="loading" :columns="columns" :data="apidata" size="small"></Table>
      </div>
      <div class="page-wraper">
        <Page :total="total" :page-size="pageSize" @on-change="pageChange" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" :current="pageIndex" ></Page>
      </div>
    </div>

    <edit-authorization :visible="editVisible" :MemberId="MemberId" @edit-cancel="edit_cancel" @edit-through="edit_through" @edit-veto="edit_veto"></edit-authorization>
  </Card>
</template>
<script>
import selectType             from '@/views/components/selectType';
import dateApply              from '@/views/components/dateApply';
import editAuthorization      from './components/editCheckUp';

import utils            from '@/libs/util';

const mockData = {
  isSuccess: false,
  message: "",
  result: {
    totalCount: 20,
    resultList: [
      {
        memberId: 1,
        name: "用户1",
        phone: "123456",
        roleName: "懂事",
        authRechargeStock: 100,
        pricePerStock: 200,
        authRechargeBalance: 300,
        upRoleName: "总代",
        superName: "aa",
        superPhone: "11",
        province: "1",
        city: "2",
        area: "3",
        applyTime: "2017-12-12"
      },
      {
        memberId: 2,
        name: "用户2",
        phone: "123456",
        roleName: "懂事",
        authRechargeStock: 100,
        pricePerStock: 200,
        authRechargeBalance: 300,
        upRoleName: "总代",
        superName: "aa",
        superPhone: "11",
        province: "1",
        city: "2",
        area: "3",
        applyTime: "2017-12-12"
      },
      {
        memberId: 3,
        name: "用户3",
        phone: "123456",
        roleName: "懂事",
        authRechargeStock: 100,
        pricePerStock: 200,
        authRechargeBalance: 300,
        upRoleName: "总代",
        superName: "aa",
        superPhone: "11",
        province: "1",
        city: "2",
        area: "3",
        applyTime: "2017-12-12"
      }
    ]
  }
}

let that;
export default {
  name: 'intention-apply',
  components: {
    selectType,
    dateApply,
    editAuthorization
  },
  created() {
    that = this;

    let RoleList = []
    utils.getRoleList(that,data => {
      data.map((el, ix) => {
        if(el.id>1) RoleList.push(el)
      })
    })
    that.RoleList  = RoleList

    that.ApplyStateList = that.$store.state.user.ApplyStateList //代理授权状态
    
    return that.GetList();
  },
  data() {
    let dropList = [
      {
        'value':1,
        'label':'我的下级'
      },
      {
        'value':2,
        'label':'我推荐的人'
      },
      {
        'value':3,
        'label':'修改上级'
      },
      {
        'value':4,
        'label':'修改推荐人'
      },
      {
        'value':5,
        'label':'设置官方'
      },
      {
        'value':6,
        'label':'区域保护'
      }
    ]
    return {
      editVisible:false,
      MemberId:0,
      loading:true,
      ApplyState:'',
      ApplyStateList:[],
      RoleList:[],
      RoleVal :'',
      keywords: '',
      StartTime:'',
      EndTime:'',
      total: 0,
      pageSize: 15,
      pageIndex: 1,
      columns: [
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          width:150,
        },
        {
          title: '电话',
          key: 'phone',
          width:110,
          ellipsis:true,
          align: 'center',
          width:150,
        },
        {
          title: '当前等级',
          key: 'roleName',
          align: 'center',
          width:150,
        },{
          title: '升级门槛',
          key: 'authRechargeBalance',
          align: 'center',
          width:120,
        },{
          title: '升级等级',
          key: 'upRoleName',
          align: 'center',
          width:120,
        },{
          title: '当前上级',
          key: 'superName',
          align: 'center',
          width:150,
        },{
          title: '当前上级电话',
          key: 'superPhone',
          align: 'center',
          width:110,
          ellipsis:true
        },{
          title: '地域',
          key: 'allAddress',
          align: 'center',
          width:300,
          ellipsis:true
        },{
          title: '申请时间',
          key: 'addTime',
          width:200,
          align: 'center'
        },{
          title: '操作',
          key: 'action',
          align: 'center',
          "fixed": "right",
          width:200,
          render(row, column, index) {
            let arr = [];

            arr.push(row('Button', {
              props: {
                type: 'info'
              },
              style: {
                marginRight: '10px'
              },
              on: {
                click() {
                  that.editApi_click(column.row)
                }
              }
            }, '审核'))

            return row('div', {
              style: {
                textAlign: "center"
              }
            }, arr);
          }
        }
      ],
      apidata: []
    }
  },
  methods: {
    pageChange(value) {
      this.pageIndex = value;
      that.loading = true
      return that.GetList()
    },
    pageSizeChange(value){
        this.pageSize = value;
        this.GetList();
    },
    //导出文档
    exportDocument_click() {
      let requedata = {
        keywords:that.keywords,
        // ApplyState:that.ApplyState || '',
        RoleId:that.RoleVal || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime
      };
      let url = this.$api.ExportCheckMemberUpInfoList;
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

    //审核通过
    edit_through(Id){
      that.editVisible = false
      let requedata = {MemberId:Id};

      //console.log(requedata);
      return that.$request(this.$api.checkMemberUpSuccess, requedata, data => {
        if(data.isSuccess){
          if(data.message) that.$Message.success(data.message);
          return that.recoveryData(that.GetList)
        }else if(data.message) that.$Message.error(data.message);
      })
    },
    //审核否决
    edit_veto(Id,RefuseReason){
      that.editVisible = false
      let requedata = {MemberId:Id,FailReason:RefuseReason};

      //console.log(requedata);
      return that.$request(this.$api.checkMemberUpFail, requedata, data => {
        if(data.isSuccess){
          if(data.message) that.$Message.success(data.message);
          return that.recoveryData(that.GetList)
        }else if(data.message) that.$Message.error(data.message);
      })
    },

    //列表
    GetList(){
      let requedata = {
        PageIndex:that.pageIndex,
        PageSize:that.pageSize,
        keywords:that.keywords,
        RoleId:that.RoleVal || '',
        StartTime:that.StartTime,
        EndTime:that.EndTime
      };
      //if()
      //console.log(requedata);
      return that.$request(this.$api.getCheckMemberUpInfoList, requedata, data => {
        that.total = data.result.totalCount || 0
        that.apidata = data.result.resultList || []
        that.loading = false
      })
    },
    //恢复数据
    recoveryData(callback){
      that.total = 0
      that.loading = true
      //that.apidata = []
      that.pageIndex = 1
      return callback && callback()
    },

    //搜索
    search_click(){
      return that.recoveryData(that.GetList)
    },

    //编辑
    editApi_click(row){
     // console.log('editApi_click',row.memberId);
      that.editVisible = true
      that.MemberId = row.memberId
    },
    
    //时间选择
    dateChange(value){
      that.StartTime  = value[0] || ''
      that.EndTime    = value[1] || ''
      //console.log(value);
    },

    //授权状态
    ApplyState_Change(val){
      //console.log(val);
      that.ApplyState = val
    },

    //更多菜单
    DropApi_click(name,row){
      console.log('sdf',name,row.memberId);
    },

    edit_cancel(){
      that.editVisible = false
    }
  }
};
</script>
