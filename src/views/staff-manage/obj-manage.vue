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

.ivu-table .demo-table-info-row td {
  background-color: #fafbfc;
}
.manage_box{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.manage_box .search{
  flex: 0 0 auto;
}
</style>
<template>
  <Card class="intention-apply">
    <div class="manage_box">
      <div class="search">
        <Input v-model="keywords" placeholder="职称" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
        <div class="btn-wraper">
          <Button type="primary" icon="search" @click="search_click">搜索</Button>
          <Button type="info" @click="addDepart_Fn" icon="plus">新增</Button>
        </div>
      </div>
      <div class="table-wraper">
        <Table :loading="loading" :columns="columns" :data="departmentData"></Table>
      </div>
      <Page :total="total" @on-change="pageChange" :current="pageIndex" :page-size="pageSize" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange"></Page>
    </div>
    
    <add-obj :visible="visible_Add" :editData="editData" @okAdd="okAdd" @cancelAdd="cancelAdd"></add-obj>
  
    <!-- 权限管理 -->
    <authority-manage :memberId='memberId' :visible="authorityVisible" @modal-ok="authority_ok" @modal-cancel="authorityVisible=false"></authority-manage>
  </Card>
</template>
<script>
import addObj           from './components/addObj';
import authorityManage  from './components/authority_manage';

let that;
export default {
  name: 'intention-apply',
  components: {
    addObj,
    authorityManage
  },
  data() {
    return {
      memberId:0,
      authorityVisible:false,
      DepartmentId:0,
      visible_Add:false,
      loading:true,
      editData:{},
      keywords: '',
      state: '',
      total: 0,
      pageSize: 15,
      pageIndex: 1,
      columns: [{
        title: '职称',
        key: 'name',
        align: 'center'
      },{
        title: '部门',
        key: 'departmentName',
        align: 'center'
      }, {
        title: '添加时间',
        key: 'addTime',
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        align: 'center',
        width:250,
        render(row, column, index) {
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
                return that.editDepartment(column.row)
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
                return that.authorityBtn(column.row)
              }
            }
          }, '权限管理'))

          arr.push(row('Button', {
            props: {
              type: 'warning'
            },
            on: {
              click() {
                return that.delete_dep(column.row)
              }
            }
          }, '删除'))


          return row('div', {
            style: {
              textAlign: "center"
            }
          }, arr);
        }
      }],
      departmentData: []
    }
  },
  created() {
    that = this;
    that.DepartmentId = this.$route.params.department_id

    return that.GetList()
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
    //搜索
    search_click(){
      return that.recoveryData(that.GetList)
    },
    GetList(callback){
      let requedata = {
        DepartmentId:that.DepartmentId,
        indexPage:that.pageIndex,
        Take:that.pageSize,
        keywords:that.keywords
      };
      //if()
      //console.log('GetList',2);
      //console.log(callback);
      return that.$request(this.$api.getListPosition, requedata, data => {
        let result = data.result || {}

        that.total = result.length || 0
        that.departmentData = result.list || []
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
    //删除数据
    delete_dep(row){
      return that.$Modal.confirm({
          title: '提示',
          content: '<p>确定删除</p>',
          loading: true,
          onOk() {
            return that.$request(this.$api.delPosition, {Id:row.id}, data => {
              that.$Modal.remove();
              if(data.isSuccess){
                that.departmentData.splice(row._index,1)
                if(data.message) that.$Message.success(data.message);
              }else if(data.message) that.$Message.error(data.message);
            })
          }
      });
    },
    //新增
    addDepart_Fn(){
      that.visible_Add = true
      that.editData = {}
    },
    //编辑
    editDepartment(row){
      
      that.visible_Add = true
      that.editData = row
      //console.log(that.editData);
    },

    okAdd(name){
      let that = this
      that.visible_Add = false

      let requedata = {};
      requedata.Id = that.editData.id || 0
      requedata.Name = name
      requedata.DepartmentId = that.DepartmentId
      that.loading = true

      return that.$request(this.$api.updatePosition, requedata, data => {
        that.loading = false
        if (data.isSuccess) {
          return that.recoveryData(()=>{
            return that.GetList(()=>{
               that.$Message.success('保存成功');
            })
          })
        } else if (data.message) that.$Message.error(data.message);
        else that.$Message.error('保存失败');
      })
      
    },
    cancelAdd(){
      this.visible_Add = false
    },
    
    //权限管理
    authorityBtn(row){
      that.memberId = row.id
      that.authorityVisible = true
    },
    authority_cancel(){},
    authority_ok(){
      that.authorityVisible = false
      that.$Message.success('保存成功');
      //return that.recoveryData(that.GetList)
    }

  }
};
</script>
