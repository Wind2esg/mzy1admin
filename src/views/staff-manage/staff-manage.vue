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
    flex: 1 1 auto;
    overflow: auto;
  }
}
.selectType{
  width:80px;
  vertical-align:top;
  margin-right: 12px;
}
.staff_main{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.staff_main .search{
  flex: 0 0 auto;
}
.staff_page,.intention,.staff_main{
  height: 100%;
}
</style>
<template>
  <div class="staff_page">
    <Card class="intention-apply" v-if="staffVisible">
      <div class="staff_main">
        <div class="search" >
          <Input v-model="keywords" placeholder="员工编号、员工姓名" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
          <select-type class="selectType" :typeList="typeList" :typeVal='typeVal' @selectChange="stateChange"></select-type>
          <div class="btn-wraper">
            <Button type="primary" icon="search" @click="search_click">搜索</Button>
            <Button type="info" @click="addStaff" icon="plus">新增</Button>
          </div>
        </div>

        
        <div class="table-wraper">
          <Table :loading="loading" :columns="columns" :data="apidata"></Table>
        </div>
        <Page :total="total" @on-change="pageChange" :page-size="pageSize" :current="pageIndex" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </Card>
    
    <Card  v-if="!staffVisible">
      <p slot="title">{{isEdit?'修改员工信息':'添加员工'}}</p>
      <add-staff :editData="editData" @cancelAdd="cancelAdd" @staff-ok="staff_ok"></add-staff>
      <!-- <edit-staff v-if="isEdit" @cancelAdd="cancelAdd" @staff-ok="staff_ok"></edit-staff> -->
    </Card>

    <edit-password :visible="visible_Add" :memberId="memberId" @cancelpasd="cancelpasd" ></edit-password>
  </div>
  
  
</template>
<script>
import selectType       from '@/views/components/selectType';
import addStaff         from './components/addStaff';
/*import editStaff        from './components/editStaff';*/
import editPassword     from './components/editPassword';

import getstaff from './data/get-staff';

let that;
export default {
  name: 'intention-apply',
  components: {
    selectType,
    addStaff,
    editPassword
  },
  data() {
    return {
      loading:true,
      isEdit:false,
      editData:{},
      memberId:0,
      visible_Add:false,  //修改密码
      staff_tit:'添加员工',
      staffVisible: true,
      typeVal:'0',
      typeList:[{
        value: '0',
        label: '在职'
      },{
        value: '1',
        label: '离职'
      }],
      keywords: '',
      state: '',
      total: 0,
      pageSize: 15,
      pageIndex: 1,
      columns: [{
        title: '员工编号',
        key: 'id',
        align: 'center'
      }, {
        title: '员工姓名',
        key: 'employeeName',
        align: 'center'
      }, {
        title: '所属部门',
        key: 'departmentName',
        align: 'center'
      }, {
        title: '职位',
        key: 'roleName',
        align: 'center'
      }, {
        title: '联系电话',
        key: 'phone',
        align: 'center'
      }, {
        title: '添加时间',
        key: 'addTime',
        align: 'center',
      }, {
        title: '状态',
        key: 'state',
        align: 'center',
        /*render(row, column, index){
          return column.row.Delstatus?'离职':'在职'
        }*/
      }, {
        title: '操作',
        key: 'Mall_RoleId',
        align: 'center',
        width:250,
        render(row, column, index){
          if(column.row.state==='在职'){
            let arr = [];

            arr.push(row('Button', {
              props: {
                type: 'primary'
              },
              style: {
                marginRight: '10px'
              },
              on: {
                click() {
                  that._editBtn(column.row)
                }
              }
            }, '编辑'))

            arr.push(row('Button', {
              props: {
                type: 'primary'
              },
              style: {
                marginRight: '10px'
              },
              on: {
                click() {
                  that._manageBtn(column.row)
                }
              }
            }, '修改密码'))

            arr.push(row('Button', {
              props: {
                type: 'warning'
              },
              on: {
                click() {
                  that._deleteBtn(column.row)
                }
              }
            }, '离职'))


            return row('div', {
              style: {
                textAlign: "center"
              }
            }, arr);
          }else{
            return false
          }
        }
      }],
      apidata: getstaff.FinalResult.Results
    }
  },
  created() {
    that = this;

    return that.GetList()
  },
  methods: {
    //搜索
    search_click(){
      return that.recoveryData(that.GetList)
    },

    GetList(callback){
      let requedata = {
        State:that.typeVal,
        indexPage:that.pageIndex,
        Take:that.pageSize,
        keywords:that.keywords
      };
      //if()
      //console.log('GetList',2);
      //console.log(callback);
      return that.$request(this.$api.getEmployeeList, requedata, data => {
        let result = data.result || {}

        that.total = result.length || 0
        that.apidata = result.list || []
        that.loading = false

        return callback && callback()
      })
    },
    //恢复数据
    recoveryData(callback){
      //console.log('recoveryData',1);
      that.loading = true
      that.total = 0
      //that.departmentData = []
      that.pageIndex = 1
      return callback && callback()
    },
    stateChange(value) {
        //console.log('stateChange',value)
        that.typeVal = value
      },
      pageChange(value) {
        this.pageIndex = value;
        that.loading = true
        return that.GetList()
      },
      pageSizeChange(value){
          this.pageSize = value;
          this.GetList();
      },
      //新增员工
      addStaff() {
        that.staffVisible = false
        that.isEdit = false
        that.memberId = 0
        that.editData = {}
      },
      //表格编辑
      _editBtn(row){
        //console.log('表格编辑');
        that.isEdit = true
        that.staffVisible = false
        that.memberId = row.id
        that.editData = row
      },
      //表格管理 == 修改密码
      _manageBtn(row){
        that.visible_Add = true
        that.memberId = row.id
      },
      //表格删除
      _deleteBtn(row){
        return that.$Modal.confirm({
            title: '提示',
            content: '<p>确定离职</p>',
            loading: true,
            onOk() {
              return that.$request(this.$api.delEmployee, {Id:row.id}, data => {
                that.$Modal.remove();
                if(data.isSuccess){
                  that.apidata.splice(row._index,1)
                  if(data.message) that.$Message.success(data.message);
                }else if(data.message) that.$Message.error(data.message);
              })
            }
        });
        
      },
      //页面返回
      cancelAdd(){
        console.log("d");
        that.staffVisible = true
      },

      //员工保存
      staff_ok(formInfo,AndRoleVal){
        that.staffVisible = true
        return that.recoveryData(()=>{
          return that.GetList(()=>{
            that.$Message.success('修改成功');
          })
        })
        /*let requedata = {
          Id:that.memberId,
          Phone:formInfo.Phone,
          DepartmentId:AndRoleVal[0],
          EmployeeRoleId:AndRoleVal[1],
          Name:formInfo.Name
        };
        if(formInfo.Password) requedata.Password = formInfo.Password
        if(formInfo.PasswdCheck) requedata.ConfirmPassword = formInfo.PasswdCheck

        console.log(requedata);
        return that.$request('updateEmployee', requedata, data => {
           if(data.isSuccess){
              return that.recoveryData(that.GetList)
            }else if(data.message) that.$Message.error(data.message);
              else that.$Message.error('保存失败');
        })*/
        
      },

      cancelpasd(){
        that.visible_Add = false
      }
  }
};
</script>
